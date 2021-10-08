/// <reference types="cypress" />

import {
  article_json_tag_attribute, article_json_sec_taxonomy_attributes, node_type, article_json_prim_attributes, article_json_header_title, article_json_body_value, article_json_tag, language_codes
} from '../fixtures/article_test_data';
import {
  ele_article_header, ele_article_body, ele_article_tag
} from '../page-objects/create_article_page';

describe('Create article and verify them via json:api', { tags: '@json:api' }, () => {

  it(`Create article and verify that via json:api in both languages for user:${Cypress.env('cyAdminUser')}`, () => {
    cy.createUser(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword'), Cypress.env('cyAdminRole'));
    cy.getRestToken(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword')).then((token) => {
      cy.createTaxonomyTerm(token, article_json_tag_attribute).then(($uuid) => {
        article_json_sec_taxonomy_attributes.field_tags.data.id = $uuid;
        return cy.reseedArticle(token, node_type, article_json_prim_attributes, article_json_sec_taxonomy_attributes)
      })
    }).then(node_id => {
      language_codes.forEach(language_code => {
        cy.visit(`${language_code}/node/${node_id}`);
        cy.get(ele_article_header).should('contain.text', article_json_header_title);
        cy.get(ele_article_body).should('contain.text', article_json_body_value);
        cy.get(ele_article_tag).should('contain.text', article_json_tag);
      });
    });
    cy.logout();
    cy.deleteUser(Cypress.env('cyAdminUser'));
});
});
