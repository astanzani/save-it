// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    loginByApi(email: string, password: string): Chainable<Element>;
  }
}

Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request('POST', 'http://localhost:8080/api/v1/users/login', {
    email,
    password,
  }).then(() => {
    cy.request('http://localhost:8080/api/v1/users/current').then(
      (response) => {
        window.localStorage.setItem(
          'current-user',
          JSON.stringify(response.body)
        );
      }
    );
  });
});
