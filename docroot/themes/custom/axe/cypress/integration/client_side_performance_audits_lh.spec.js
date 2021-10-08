/// <reference types="cypress" />

import pages  from "../fixtures/urls_test_data.json";

describe("Lighthouse audit", { tags: "@lh-performance" }, () => {

  context("Lighthouse Performance audits without custom thresholds in mobile view",{ tags: "@lh-performance-mobile" },() => {
    pages.forEach((page) => {
        it(`Performance audits without custom thresholds in mobile view for the page: ${page.url}`,{ tags: "@lh-mobile-no-custom" },() => {
            cy.visit(page);
            cy.lighthouse();
          });
      });
    });

  context("Lighthouse Performance audits with custom thresholds for desktop view", { tags: "@lh-performance-desktop-custom" },() => {
      pages.forEach((page) => {
        it(`Performance audits with custom thresholds in desktop view for the page: ${page.url}`,{ tags: "@lh-desktop-custom" },() => {
            cy.visit(page);
            const customThresholds = {
              performance: 50,
              accessibility: 50,
              seo: 70,
              "first-contentful-paint": 2000,
              "largest-contentful-paint": 3000,
              "cumulative-layout-shift": 0.1,
              "total-blocking-time": 500,
            };
            const desktopConfig = {
              formFactor: "desktop",
              screenEmulation: { disabled: true },
            };
            cy.lighthouse(customThresholds, desktopConfig);
          });
      });
    });
});
