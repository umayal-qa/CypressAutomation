//custom Commands

Cypress.Commands.add('selectFilterCheckbox', (value) =>  {
    cy.get('label.vertical-filters-label').contains('' +value+ '').click({force:true})
})
//triggering commit

// Cypress.Commands.add('selectFilterCheckbox', (value) =>  {
//     cy.get('input').should('have.value', '' +value+ '').click({force:true})
// })


//// -- This is a parent command --
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