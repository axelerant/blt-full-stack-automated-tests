/// <reference types="cypress" />

import "cypress-audit/commands";

const severityIndicators = {
  minor:    '⚪️',
  moderate: '🟡',
  serious:  '🟠',
  critical: '🔴',
}
function reportA11y(violations) {
  const violationData = violations.map(
      ({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        nodes: nodes.length,
      })
    );
  //To print accessibility issues in console.log in table format which helps for reporting
  cy.task("table", violationData);

  //Log A11Y issues in cypress test runner(interactive mode) which helps for faster fix
  //This is referred from https://github.com/jonoliver/cypress-axe-demo
  violations.forEach(violation => {
    const nodes = Cypress.$(violation.nodes.map(node => node.target).join(','))
    Cypress.log({
      name: `${severityIndicators[violation.impact]} A11Y`,
      consoleProps: () => violation,
      $el: nodes,
      message: `[${violation.help}](${violation.helpUrl})`
    })

    violation.nodes.forEach(({ target }) => {
      Cypress.log({
        name: '🔧',
        consoleProps: () => violation,
        $el: Cypress.$(target.join(',')),
        message: target
      })
    })
  });
}

/**
 * Include and Check Accessibility A11y issues for the given pages and impacts
 * @param {*} path - string
 * @param {*} impacts - object
 */
Cypress.Commands.add("checkPageA11y", (path, impacts) => {
  cy.visit(path);
  cy.injectAxe();
  //Filtering to include and report only the given impacts violations else consider and report all impacts(minor,moderate,serious,critical)
  if(impacts){
    cy.checkA11y(null, impacts, reportA11y);
  } else {
    cy.checkA11y(null, null, reportA11y);
  }
})


/**
 * Create an article node using JSON:API:Reference: https://www.drupal.org/project/jsonapi
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} primary_fields  - Json input
 * @param {*} secondary_fields  - Json input
 */
Cypress.Commands.add(
  "createNode",
  function (token, nodeType, primary_fields, secondary_fields) {
    return cy
      .request({
        method: "POST",
        url: `/jsonapi/node/${nodeType}`,
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          "X-CSRF-Token": token,
        },
        body: {
          data: {
            type: `node--${nodeType}`,
            attributes: primary_fields,
            relationships: secondary_fields,
          },
        },
      })
      .its("body.data.attributes.drupal_internal__nid");
  }
);

/**
 * Delete a article node using JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} uuid  - String - Unique Identifier for the User's content
 */
Cypress.Commands.add("deleteNode", function (token, nodeType, uuid) {
  return cy
    .request({
      method: "DELETE",
      url: `/jsonapi/node/${nodeType}/${uuid}`,
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "X-CSRF-Token": token,
      },
    })
    .its("body");
});

/**
 * Get Nodes with given article title using JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} title  - String - Content Title
 */
Cypress.Commands.add("getNodesWithTitle", function (token, nodeType, title) {
  return cy
    .request({
      method: "GET",
      url: `/jsonapi/node/${nodeType}?filter[article-title][path]=title&filter[article-title][value]=${title}&filter[article-title][operator]==`,
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "X-CSRF-Token": token,
      },
    })
    .then((res) => {
      return JSON.parse(JSON.stringify(res.body)).data;
    });
});

/**
 * Get User's Session Token using JSON:API
 * @param {*} user  - String - Username
 * @param {*} password  - String - Password
 */
Cypress.Commands.add("getRestToken", function (user, password) {
  cy.login(user, password);
  return cy
    .request({
      method: "GET",
      url: "/session/token",
    })
    .its("body");
});

/**
 * Login with different user roles
 * @param {*} type  - String - Possible Role Types: "administrator" and "editor"
 */
Cypress.Commands.add("login", function (type) {
  let perms = {};
  switch (type) {
    case "admin":
      perms = {
        name: Cypress.env("cyAdminUser"),
        pass: Cypress.env("cyAdminPassword"),
      };
      break;
    case "editor":
      perms = {
        name: Cypress.env("cyEditorUser"),
        pass: Cypress.env("cyEditorPassword"),
      };
      break;
  }
  return cy.request({
    method: "POST",
    url: "/user/login",
    form: true,
    body: {
      ...perms,
      form_id: "user_login_form",
    },
  });
});

/**
 * Logout with cy.request
 */
Cypress.Commands.add("logout", function () {
  cy.request({
    method: "GET",
    url: "/user/logout",
    followRedirect: false, // turn off following redirects
  }).then((resp) => {
    // redirect status code is 302
    expect(resp.status).to.eq(302);
  });
});

/**
 * Re-seeding(Get-Delete-Post) an article data through JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} primary_fields  - Json input
 * @param {*} secondary_fields  - Json input
 */
Cypress.Commands.add(
  "reseedArticle",
  function (token, nodeType, primary_fields, secondary_fields) {
    cy.getNodesWithTitle(token, nodeType, primary_fields.title.value).then(
      (nodes) => {
        nodes.map(function (node) {
          cy.deleteNode(token, nodeType, node.id);
        });
      }
    );
    return cy.createNode(token, nodeType, primary_fields, secondary_fields);
  }
);

/**
 * Create taxonomy term through JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} field  - Json input
 */
Cypress.Commands.add("createTaxonomyTerm", function (token, field) {
  return cy
    .request({
      method: "POST",
      url: "/jsonapi/taxonomy_term/tags",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "X-CSRF-Token": token,
      },
      body: {
        data: {
          type: "taxonomy_term--tags",
          attributes: field,
        },
      },
    })
    .then((res) => {
      return JSON.parse(JSON.stringify(res.body)).data.id;
    });
});

/**
 * Create a User through Drush
 * @param {*} user - String
 * @param {*} password - String
 * @param {*} role - String (Possible Values: "administrator", "editor")
 */
Cypress.Commands.add("createUser", function (user, pass, role) {
  let drush = '../../../../vendor/bin/drush';
  cy.exec(
    `${drush} user-create "${user}" --mail="${user}@example.com" --password="${pass}"`,
    //Code will continue to execute if the given user account data already exists
    { failOnNonZeroExit: false }
  );

  cy.exec(`${drush} user-add-role "${role}" "${user}"`, {
    failOnNonZeroExit: false,
  });

  cy.exec(`${drush} user-information "${user}"`);
  //we didn’t explicitly set the failOnNonZeroExit property here and the test will fail
  //if the given user account doesn’t exist.
});

/**
 * Delete a User through Drush
 * @param {*} user - String
 */
Cypress.Commands.add("deleteUser", function (user) {
  let drush = '../../../../vendor/bin/drush';
  cy.exec(`${drush} -y user:cancel --delete-content "${user}"`, {
    timeout: 120000,
  });
});


/**
 * Enable Visual Testing by calling Applitools Eyes Check Window Method
 * @param {*} tagName - String (Ex: Home Page)
 */
Cypress.Commands.add("takeSnapshot", function (tagName) {
  cy.eyesCheckWindow({
    tag: tagName,
    target: 'window',
    fully: true
  })
});