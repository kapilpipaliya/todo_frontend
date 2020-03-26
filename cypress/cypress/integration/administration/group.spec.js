describe('Group Page Test', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/admin/groups')
  })

  it('List', () => {
    cy.contains('h1', 'Groups')
  })

  it('Create', () => {
    cy.addClick()
    cy.inputType(' key', 'test')
    cy.inputType('Id', 'group1')
    cy.inputType('Name', 'Pipaliya')
    cy.submitButtonClick('group')
  })

  it('Update', () => {
    cy.editKeyClick('test')
    cy.inputType('Id', 'group2')
    cy.inputType('Name', 'Pipaliya')
    cy.submitButtonClick('group')
  })

  it('Delete', () => {
    cy.deleteKeyClick('test')
  })
})
