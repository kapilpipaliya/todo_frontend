describe('Org Page Test', () => {
  beforeEach(() => {
  	cy.login()
  	cy.visit('/admin/members')

  })

  it('List', () => {
    cy.contains('h1', 'Members')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Email', 'kapil@g.com')
    cy.submitButtonClick()
  })

   it('Update', () => {
   	cy.editKeyClick('test')
    cy.inputType('Email', 'k@g.com')
    cy.submitButtonClick()
   })

   it('Delete', () => {
   	cy.deleteKeyClick('test')
   })

})
