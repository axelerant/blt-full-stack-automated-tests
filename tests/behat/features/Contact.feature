@contact_us_form @javascript
Feature: Contact Us Form
    In order to verify the contact form
    As a user (authenticated/anonymous user)
    I should be/not allowed to submit the form with/out all the mandatory fields respectively

    Rule:
        - All the Fields: "Name" , "Email Address", "Subject", "Message" are mandatory

@smoke @anonymous_user_success
Scenario Outline: As an anonymous User, Submit the Contact Form with all the mandatory field values
    Given I am an anonymous user
    And I am on "<URL>"
    And I fill in the "name" field with "<name>"
    And I fill in the "email address" field with "qa@axelerant.com"
    And I fill in the "subject" field with "<subject>"
    And I fill in the "message" field with "<message>"
    When I click the "#contact-message-feedback-form #edit-submit" button
    Then I should see the message "<expectedSuccessText>"
    Examples:
        | URL  | name  | subject  | message  | expectedSuccessText  |
        | /contact/feedback  | Quality | QA Hackathon | Learning Behat | Your message has been sent. |
        | /es/contact/feedback | Calidad | Hackathon de control de calidad |Aprendiendo Behat | Su mensaje ha sido enviado. |

@smoke @api @authenticated_user_success
Scenario Outline: As an Authenticated User, Submit the Contact form with all the mandatory field values
    Given I am logged in as a user with the "Authenticated user" role
    And I am on "<URL>"
    And I wait for the page to load
    And I fill in the "subject" field with "<subject>"
    And I fill in the "message" field with "<message>"
    When I click the "#contact-message-feedback-form #edit-submit" button
    And I wait for the page to load
    Then I should see the message "<expectedSuccessText>"
    Examples:
        | URL  | subject  | message  | expectedSuccessText  |
        | /en/contact  | QA Hackathon | Learning Behat | Your message has been sent. |
        | /es/contact | Hackathon de control de calidad | Aprendiendo Behat | Su mensaje ha sido enviado. |

@negative @anonymous_user_error
Scenario Outline: As an anonymous User, Submit the Contact form without mandatory field values
    Given I am an anonymous user
    And I am on "<URL>"
    When I click the "#contact-message-feedback-form #edit-submit" button
    Then the "#edit-subject-0-value" validationMessage should be "Please fill out this field."
    Examples:
        | URL  |
        | /en/contact |
        | /es/contact |

@api @authenticated_user_error @negative
Scenario Outline: As an Authenticated User, Submit the Contact form without mandatory field values
    Given I am logged in as a user with the "Authenticated user" role
    And I am on "<URL>"
    When I click the "#contact-message-feedback-form #edit-submit" button
    Then the "#edit-subject-0-value" validationMessage should be "Please fill out this field."
    Examples:
        | URL  |
        | /en/contact |
        | /es/contact |
