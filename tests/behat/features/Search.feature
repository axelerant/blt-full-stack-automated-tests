@basic_search
Feature: Basic Search
 The application should allow user to search and provide the expected search results

@smoke @full_title_search @javascript
Scenario Outline: Searching for a page with full title that exists
   Given I am on "<URL>"
   And I wait for the page to load
   And I fill in "edit-keys" with "<fullTitle>"
   When I click the "#edit-submit" button
   Then I should see the heading "<fullTitle>"

   Examples:
      | URL | fullTitle |
      | /en | Fiery chili sauce |
      | /es | Salsa de chile ardiente |

@smoke @partial_title_search @javascript
Scenario Outline: Searching for a page with partial title that exists on multiple pages
   Given I am on "<URL>"
   And I wait for the page to load
   And I fill in "edit-keys" with "<partialTitle>"
   When I click the "#edit-submit" button
   Then I should see "<partialTitle>" in the ".search-result__snippet" element in the "search_content" region
   And I should see "<fullTitle>"
   Examples:
      | URL  | fullTitle | partialTitle |
      | /en | Dairy-free and delicious milk chocolate | chocolate |
      | /es | Dale a tu avena el cambio de imagen definitivo | chocolate |

@negative @incorrect_search @javascript
Scenario Outline: Searching for a page that does NOT exists
   Given I am on "<URL>"
   And I wait for the page to load
   When I fill in "edit-keys" with "<incorrectText>"
   And I click the "#edit-submit" button
   Then I should see "<expectedWarningMessage>"
   Examples:
      | URL | incorrectText  | expectedWarningMessage  |
      | /en | Cypress | Your search yielded no results. |
      | /es | Ciprés | Su búsqueda no produjo resultados |

@negative @empty_search @javascript
Scenario Outline: Empty Search
   Given I am on "<URL>"
   And I wait for the page to load
   When I click the "#edit-submit" button
   Then I should see "<expectedWarningMessage>"
   Examples:
      | URL | expectedWarningMessage  |
      | /en | Please enter some keywords. |
      | /es | Por favor, escriba algunas palabras clave. |
