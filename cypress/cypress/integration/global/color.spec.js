describe('Color Page Test', () => {
  beforeEach(() => {
  	cy.login()
    cy.visit('/page/global_color')
  })

  it('List', () => {
    cy.contains('h1', 'Color')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Code', 'test2')
    cy.submitButtonClick()
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    cy.inputType('Code', 'test2')
    cy.submitButtonClick()
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
