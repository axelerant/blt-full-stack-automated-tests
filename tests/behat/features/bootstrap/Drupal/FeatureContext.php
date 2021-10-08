<?php

namespace Drupal;

use Drupal\DrupalExtension\Context\RawDrupalContext;
use Behat\Mink\Exception\ExpectationException;
use Behat\Mink\Exception\UnsupportedDriverActionException;
use Behat\Mink\Exception\DriverException;

/**
 * FeatureContext class defines custom step definitions for Behat.
 */
class FeatureContext extends RawDrupalContext
{

  /**
   * Every scenario gets its own context instance.
   *
   * You can also pass arbitrary arguments to the
   * context constructor through behat.yml.
   */
  public function __construct()
  {
  }

  /**
   * @When I fill in the :arg1 field with :arg2
   */
  public function iFillInTheFieldWith($name, $value)
  {
    $selector = $this->getFieldSelector($name);
    $field = $this->fixStepArgument($selector);
    $value = $this->fixStepArgument($value);
    $this->getSession()->getPage()->fillField($field, $value);
  }

  /**
   * Return a region from the current page.
   *
   * @throws \Exception
   *   If region cannot be found.
   *
   * @param string $region
   *   The machine name of the region to return.
   *
   * @return \Behat\Mink\Element\NodeElement
   */
  public function getRegion($region)
  {
    $session = $this->getSession();
    $regionObj = $session->getPage()->find('region', $region);
    if (!$regionObj) {
      throw new \Exception(sprintf('No region "%s" found on the page %s.', $region, $session->getCurrentUrl()));
    }
    return $regionObj;
  }

  /**
   * Find elements in a specific region.
   *
   * @Then I should see the expected elements in the :region( region)
   * @throws \Exception
   *   If region or elements within it cannot be found.
   */
  public function assertRegionElements($region)
  {
    $regionObj = $this->getRegion($region);
    if ($region === 'header') {
      //Iterate the links in the header region
      foreach (['.links li:nth-child(1)', '.links li:nth-child(2)', '.menu-account__link', '.menu-main li:nth-child(1)', '.menu-main li:nth-child(2)', '.menu-main li:nth-child(3)'] as $webElement) {
        $element = $regionObj->find('css', $webElement);
        if (empty($element)) {
          throw new \Exception(sprintf('No element with the identity of "%s" in the "%s" region on the page %s', $webElement, $region, $this->getSession()->getCurrentUrl()));
        }
      }
    } else if ($region === 'footer') {
      //Iterate the links in the footer region
      foreach (['.block__title .field', '.footer-promo-content .field:nth-child(1)', '.footer-promo-content .field:nth-child(2)', '#block-umami-footer .block__title', '#block-umami-footer .menu-footer__link'] as $webElement) {
        $element = $regionObj->find('css', $webElement);
        if (empty($element)) {
          throw new \Exception(sprintf('No element with the identity of "%s" in the "%s" region on the page %s', $webElement, $region, $this->getSession()->getCurrentUrl()));
        }
      }
    } else {
      throw new \Exception('Incorrect Region');
    }
  }

  /**
   * List of URLs we have visited.
   * @var array
   */
  public $visited_links = array();
  /**
   * @Then every link in the block :arg1 should pass
   */
  public function everyLinkInTheBlockShouldWork($arg1)
  {
    $elements = $this->getSession()->getPage()->findAll('xpath', $arg1);
    $count = count($elements);

    print "\n Total Links Count: $count \n";

    $i = 0;
    $linkArray=array();
    //Store all the links in the given page in $linkArray
    foreach ($elements as $element) {
      $i++;
      // Skip if empty
      if (empty($element->getParent())) {
        continue;
      }
      $href = $element->getAttribute('href');
      print "\n Link #$i ". $href . "\n";
      array_push($linkArray,$href);
    }

    for($i=0; $i<count($linkArray); $i++){
      // Skip if empty
      if (empty($linkArray[$i])) {
        continue;
      }

      // Skip if already visited
      if (isset($this->visited_links[$linkArray[$i]])) {
        print "Skipping visited link: $linkArray[$i] \n\n";
        continue;
      }

      // Save URL for later to avoid duplicates.
      $this->visited_links[$linkArray[$i]] = $linkArray[$i];

      // Skip if an anchor tag
      if (strpos($linkArray[$i], '#') === 0) {
        print "Skipping anchor link: $linkArray[$i] \n\n";
        continue;
      }

      // Skip remote links
      if (strpos($linkArray[$i], 'http') === 0) {
        print "Skipping remote link: $linkArray \n\n";
        continue;
      }

      // Skip mailto links
      if (strpos($linkArray[$i], 'mailto') === 0) {
        print "Skipping mailto link: $linkArray[$i]  \n\n";
        continue;
      }

      print "\n Checking Link: " .$linkArray[$i]. "\n";

      //Mimics Drupal\DrupalExtension\Context\MinkContext::assertAtPath
      $this->getSession()->visit($this->locatePath($linkArray[$i]));

      try {
        $this->getSession()->getStatusCode();
        $this->assertSession()->statusCodeEquals('200');
        print "200 Success \n";
      } catch (UnsupportedDriverActionException $e) {
        // Simply continue on, as this driver doesn't support HTTP response codes.
      } catch (UnsupportedDriverActionException $e) {
        print "200 Success NOT received \n";
        throw new \Exception("Page at URL $href did not return 200 code.");
      } catch (DriverException $e) {
        throw new \Exception($e->getMessage());
      }
      print "\n";
   }
    print "Done! Checked $count Links";
  }

  /**
   * Waits a while, for debugging.
   *
   * @param int $seconds
   *   How long to wait.
   *
   * @When I wait :seconds second(s)
   */
  public function wait($seconds)
  {
    sleep($seconds);
  }

  /**
   * Wait for the page load.
   * @Given /^I wait for the page to load$/
   */
  public function iWaitForThePageToLoad()
  {
    $this->getSession()->wait(15000, "document.readyState === 'complete'");
  }

  /**
   * Returns selector for specified field/
   * @param string $field
   * @return string
   */
  protected function getFieldSelector($field)
  {
    $selector = $field;

    switch ($field) {
      case 'email address':
        $selector = 'mail';
        break;

      case 'passwordNew':
        $selector = 'pass[pass1]';
        break;

      case 'confirmPassword':
        $selector = 'pass[pass2]';
        break;

      case 'subject':
        $selector = 'subject[0][value]';
        break;

      case 'message':
        $selector = 'message[0][value]';
        break;

      case "title":
        $selector = 'title[0][value]';
        break;

      case "body":
        $selector = 'body[0][value]';
        break;

      case "preparationTime":
        $selector = 'edit-field-preparation-time-0-value';
        break;

      case "numberOfServings":
        $selector = 'edit-field-number-of-servings-0-value';
        break;

      case "summary":
        $selector = 'field_summary[0][value]';
        break;

      case "recipeInstruction":
        $selector = 'field_recipe_instruction[0][value]';
        break;
    }
    return $selector;
  }

  /**
   * Returns fixed step argument (with \\" replaced back to ")
   * @param string $argument
   * @return string
   */
  protected function fixStepArgument($argument)
  {
    return str_replace('\\"', '"', $argument);
  }


  /**
   * @Then I( should) see :text in the :tag element in the :region( region)
   */
  public function assertRegionElementText($text, $tag, $region)
  {
    $page = $this->getSession()->getPage();
    $paginationElements = $page->findAll('css', ".pager__item:not(.is-active)");
    $regionObj = $this->getRegion($region);
    $results = $regionObj->findAll('css', $tag);
    //If The search results are resides on the same page and doesn't have pagination
    if (empty($paginationElements)) {
      if (!empty($results)) {
        foreach ($results as $result) {
          if (stripos($result->getText(), $text) == false) {
            throw new \Exception(sprintf('The text "%s" was not found in the "%s" text in the "%s" region on the page %s', $text, $result->getText(), $region, $this->getSession()->getCurrentUrl()));
          }
        }
      }
    } else {
      //The search results are resides on more than one page and have pagination
      foreach ($paginationElements as $paginationElement) {
        if (!empty($results)) {
          foreach ($results as $result) {
            if (stripos($result->getText(), $text) == false) {
              throw new \Exception(sprintf('The text "%s" was not found in the "%s" text in the "%s" region on the page %s', $text, $result->getText(), $region, $this->getSession()->getCurrentUrl()));
            }
          }
        }
        //Click the paginated element on the page if it's only available
        if ($paginationElement) {
          $paginationElement->click();
        }
      }
    }
  }

  /**
   * @Given /^I click an element having xpath "([^"]*)"$/
   */
  public function iClickAnElementHavingXpath($xpath)
  {
    $page = $this->getSession()->getPage();
    $element = $page->find('xpath', $xpath);
    if ($element) {
      $element->click();
    } else {
      throw new \Exception($xpath . " not found");
    }
  }

  /**
   * @Then /^(?:|I )click (?:on |)(?:|the )"([^"]*)"(?:|.*)$/
   */
  public
  function iClickAnElementHavingCss($arg1)
  {
    $findName = $this->getSession()->getPage()->find("css", $arg1);
    if (!$findName) {
      throw new \Exception($arg1 . " not found");
    } else {
      $findName->click();
    }
  }

  /**
   * @When I scroll :elementId into view
   */
  public function scrollIntoView($elementId)
  {
    $function = <<<JS
       (function(){
       var elem = document.getElementById("$elementId");
       elem.scrollIntoView(false);
       })()
JS;
    try {
      $this->getSession()->executeScript($function);
    } catch (\Exception $e) {
      throw new \Exception("ScrollIntoView failed");
    }
  }


  /**
   * Compare the validationMessage of given element.
   * @Then /^the "([^"]*)" validationMessage should be "([^"]*)"$/
   */
  public function theValidationMessageShouldBe($css, $expectedText)
  {
    $function = <<<JS
        (
            function()
            {
                return document.querySelector("$css").validationMessage
            })()
JS;
    $actualText = $this->getSession()->evaluateScript($function);
    if ($actualText !== $expectedText) {
      throw new \Exception(sprintf("Expected validationMessage attribute value '%s' doesn't match with actual value '%s'", $expectedText, $actualText ));
    }
  }

  /**
   * Fill in wysiwyg on field.
   *
   * @Then I fill in wysiwyg on field :locator with :value
   */
  public function iFillInWysiwygOnFieldWith($locator, $value)
  {
    $el = $this->getSession()->getPage()->findField($locator);
    if (empty($el)) {
      throw new ExpectationException('Could not find WYSIWYG with locator: ' . $locator, $this->getSession());
    }
    $fieldId = $el->getAttribute('id');
    if (empty($fieldId)) {
      throw new \Exception('Could not find an id for field with locator: ' . $locator);
    }
    $this->getSession()
      ->executeScript("CKEDITOR.instances[\"$fieldId\"].setData(\"$value\");");
  }
}