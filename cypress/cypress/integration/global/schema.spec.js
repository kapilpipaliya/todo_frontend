describe('Schema Page Test', () => {
  beforeEach(() => {
  	cy.login()
    cy.visit('/page/schema')
  })

  it('List', () => {
    cy.contains('h1', 'Schema')
  })

  it('Create', () => {
    cy.addClick()
    cy.wait(1500)
    cy.inputType(' key', 'test')
    cy.get('.jsoneditor')
    cy.submitButtonClick()
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    cy.wait(1500)
    cy.get('.jsoneditor')
    cy.submitButtonClick()
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
