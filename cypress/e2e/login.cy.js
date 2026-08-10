describe('Login Test', () => {
  it('should login with test_student account', () => {
    cy.visit('/')
    cy.get('input[placeholder*="用户名"], input[type="text"]').first().type('test_student')
    cy.get('input[type="password"]').type('test123')
    cy.get('button[type="submit"], button:contains("登录")').click()
    cy.url().should('not.include', '/login')
  })
})
