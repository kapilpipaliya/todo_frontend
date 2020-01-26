describe('Org Page Test', () => {
  beforeEach(() => {
  	cy.login()
  	cy.visit('/admin/orgs')

  })

  it('List', () => {
    cy.contains('h1', 'Organizations')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType('Id', 'Kapil')
    cy.pause()
    cy.inputType('Name', 'Pipaliya')
    cy.submitButtonClick()
  })

   it('Update', () => {
   	cy.editClick()
    cy.inputType('Id', 'Kapil1')
    cy.inputType('Name', 'Pipaliya1')
    cy.submitButtonClick()
   })

   it('Delete', () => {
   	cy.deleteClick()
   })

})
