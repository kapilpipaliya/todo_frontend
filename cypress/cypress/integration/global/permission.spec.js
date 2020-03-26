describe('Permission Page Test', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/page/global_permission')
  })

  it('List', () => {
    cy.contains('h1', 'Global Permissions')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Name', 'test2')
    cy.submitButtonClick('global_permission')
  })

  it('Update', () => {
    cy.editKeyClick('test')
    cy.inputType('Name', 'test2')
    cy.submitButtonClick('global_permission')
  })

  it('Delete', () => {
    cy.deleteKeyClick('test')
  })
})
