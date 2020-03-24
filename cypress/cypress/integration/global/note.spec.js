describe('Note Page Test', () => {
  beforeEach(() => {
  	cy.login()
    cy.visit('/page/note')
  })

  it('List', () => {
    cy.contains('h1', 'Note')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Subject', 'test2')
    cy.submitButtonClick('note')
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    cy.inputType('Subject', 'test2')
    cy.submitButtonClick('note')
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
