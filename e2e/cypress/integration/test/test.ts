describe('Test', () => {
  it('xablau', () => {
    cy.visit('http://localhost:3000');

    cy.get('h1').contains('Welcome');
  });
});
