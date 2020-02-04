describe('Role Page Test', () => {
  beforeEach(() => {
  	cy.login()
    cy.visit('/page/global_role')
  })

  it('List', () => {
    cy.contains('h1', 'Global Roles')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Name', 'test2')
    cy.submitButtonClick()
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    cy.inputType('Name', 'test2')
    cy.submitButtonClick()
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
