describe('Sign In flow', () => {
  it('Signs the user in if email / password are correct', () => {
    cy.visit('/');

    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('#email').type('rust@email.com');
    cy.get('#password').type('rust');
    cy.get('button').contains('Sign In').click();

    cy.contains('p', 'Rust User', { timeout: 10000 });
  });

  it('Shows an error if email / password are incorrect', () => {
    cy.visit('/');

    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('#email').type('rust@email.com');
    cy.get('#password').type('wrong password');
    cy.get('button').contains('Sign In').click();

    cy.contains('Wrong Email or Password');
  });
});
