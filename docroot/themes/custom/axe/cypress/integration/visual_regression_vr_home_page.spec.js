/// <reference types="cypress" />

import { ele_region_Header } from '../page-objects/home_page';
import pages from "../fixtures/urls_test_data.json";

describe("Visual tests", { tags: "@visual" }, () => {
    pages.forEach((page) => {
        it(`Visual test for the page: ${page.url}`, { tags: "@visual" }, () => {
            cy.visit(page.url);
            cy.get(ele_region_Header).should('be.visible');
            cy.takeSnapshot(page.title);
        });
    });
});
