@header_footer
Feature: Header and Footer Components
  The Header and Footer components in the application should be visible and behave as intended

@smoke @header_footer_visibility
Scenario Outline: Verify the visibility of header and footer elements in Homepage, Contact form, Search results Pages
  Given I go to "<URL>"
  And I should see the expected elements in the "header" region
  And I should see the expected elements in the "footer" region
  Examples:
    | URL |
    | /en |
    | /es |
    | /en/contact |
    | /es/contact |
    | /en/search/node?keys= |
    | /es/search/node?keys= |

@smoke @header_footer_broken_links
Scenario Outline: Verify Broken Links
  Given I go to "<URL>"
  And every link in the block "//header//a[@href]" should pass
  And every link in the block "//footer//a[@href]" should pass
  Examples:
    | URL |
    | /en |
    | /es |