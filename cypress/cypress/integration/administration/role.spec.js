describe('Role Page Test', () => {
  beforeEach(() => {
  	cy.login()
  	cy.visit('/admin/roles')

  })

  it('List', () => {
    cy.contains('h1', 'Roles')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Id', 'role1')
    cy.inputType('Name', 'Pipaliya')
    cy.submitButtonClick('role')
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    cy.inputType('Id', 'role2')
    cy.inputType('Name', 'Pipaliya')
    cy.submitButtonClick('role')
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
