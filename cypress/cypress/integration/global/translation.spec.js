describe('Translation Page Test', () => {
  beforeEach(() => {
  	cy.login()
    cy.visit('/page/translation')
  })

  it('List', () => {
    cy.contains('h1', 'Translation')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    //cy.inputType('Subject', 'test2')
    cy.submitButtonClick('translation')
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    //cy.inputType('Subject', 'test2')
    cy.submitButtonClick('translation')
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
