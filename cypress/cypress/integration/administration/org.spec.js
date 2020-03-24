describe('Org Page Test', () => {
  beforeEach(() => {
  	cy.login()
  	cy.visit('/organizations')

  })

  it('List', () => {
    cy.contains('h1', 'Organizations')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Id', 'Kapil')
    cy.inputType('Name', 'Pipaliya')
    cy.submitButtonClick('organization')
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    cy.inputType('Id', 'Kapil1')
    cy.inputType('Name', 'Pipaliya')
    cy.submitButtonClick('organization')
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
