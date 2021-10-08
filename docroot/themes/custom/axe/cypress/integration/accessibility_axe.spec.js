/**
 * Note:
 * We can also find-out accessibility issues by calling: cy.pa11y() which belongs to https://www.npmjs.com/package/cypress-audit package
 * But https://www.npmjs.com/package/cypress-axe package is having more features when compare to pay11y()
 */

/// <reference types="cypress" />

import pages from "../fixtures/urls_test_data.json";
const sizes = ["iphone-8","ipad-mini",[1920, 1080]];

describe("Accessibility tests", { tags: "@accessibility" }, () => {

    context("Validate all severity accessibility issues", { tags: "@accessibility-all-impacts" }, () => {
        sizes.forEach((size) => {
            pages.forEach((page) => {
                it(`Basic accessibility test for the page: ${page.url} in '${size}' resolution`,{tags: "@accessibility-all-impacts" },() => {
                    if (Cypress._.isArray(size)) {
                        cy.viewport(size[0], size[1]);
                    } else {
                        cy.viewport(size);
                    }
                    cy.checkPageA11y(page);
                });
            });
        });
    });

    context("Validate serious and critical severity accessibility issues", { tags: "@accessibility-only-high-impacts" }, () => {
        sizes.forEach((size) => {
            pages.forEach((page) => {
                it(`Accessibility test to include rules only with serious and critical impacts for the page: ${page.url} in '${size}' resolution`,{  tags: "@accessibility-only-high-impacts" },() => {
                    if (Cypress._.isArray(size)) {
                        cy.viewport(size[0], size[1]);
                    } else {
                        cy.viewport(size);
                    }
                    cy.checkPageA11y(page,{ includedImpacts: ["critical", "serious"] });
                });
            });
        });
    });
});
