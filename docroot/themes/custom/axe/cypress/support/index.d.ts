/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject> {
        /**
        * Include and Check Accessibility A11y issues for the given pages and impacts
        * @param {*} path - string
        * @param {*} impacts - object
        */
        checkPageA11y(path: string,impacts: object): Chainable<any>;

        /**
         * Create an article node using JSON:API:Reference: https://www.drupal.org/project/jsonapi
         * @param {*} token  - String - User's session token
         * @param {*} nodeType  - String (Possible value: "article")
         * @param {*} primary_fields  - Json input
         * @param {*} secondary_fields  - Json input
         */
         createNode(token: string, nodeType: string, primary_fields: object, secondary_fields: object): Chainable<any>;

         /**
         * Delete a article node using JSON:API
         * @param {*} token  - String - User's session token
         * @param {*} nodeType  - String (Possible value: "article")
         * @param {*} uuid  - String - Unique Identifier for the User's content
         */
         deleteNode(token: string, nodeType: string, uuid: string): Chainable<any>;

         /**
         * Get Nodes with given article title using JSON:API
         * @param {*} token  - String - User's session token
         * @param {*} nodeType  - String (Possible value: "article")
         * @param {*} title  - String - Content Title
         */
         getNodesWithTitle(token: string, nodeType: string, title: string): Chainable<any>;

         /**
         * Get User's Session Token using JSON:API
         * @param {*} user  - String - Username
         * @param {*} password  - String - Password
         */
         getRestToken(user: string, password: string): Chainable<any>;

         /**
         * Login with different user roles
         * @param {*} type  - String - Possible Role Types: "administrator" and "editor"
         */
         login(type: string): Chainable<any>;

         /**
         * Logout with cy.request
         */
         logout(): Chainable<any>;

         /**
         * Re-seeding(Get-Delete-Post) an article data through JSON:API
         * @param {*} token  - String - User's session token
         * @param {*} nodeType  - String (Possible value: "article")
         * @param {*} primary_fields  - Json input
         * @param {*} secondary_fields  - Json input
         */
         reseedArticle(token: string, nodeType: string, primary_fields: object, secondary_fields: object): Chainable<any>;

         /**
         * Create taxonomy term through JSON:API
         * @param {*} token  - String - User's session token
         * @param {*} field  - Json input
         */
         createTaxonomyTerm(token: string, field: object): Chainable<any>;

         /**
        * Create a User through Drush
        * @param {*} user - String
        * @param {*} password - String
        * @param {*} role - String (Possible Values: "administrator", "editor")
        */
         createUser(user: string, password: string, role: string): Chainable<any>;

         /**
         * Delete a User through Drush
         * @param {*} user - String
         */
         deleteUser(user: string)

         /**
         * Enable Visual Testing by calling Applitools Eyes Check Window Method
         * @param {*} tagName - String (Ex: Home Page)
         */
         takeSnapshot(tagName: string): Chainable<any>;
     }

    }