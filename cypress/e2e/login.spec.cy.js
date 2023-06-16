describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/tasks')
  })
  it('render header', () => {
    cy.get("header .header__logo").should("be.visible").within(() => {
      cy.get("img").should("be.visible")
    })
    cy.get("header .header__user-interact").should("be.visible").within(() => {
      cy.get(".header__notification").should("be.visible")
      cy.get(".header__user-login-btn").should("be.visible")
      cy.get(".header__user-joinus-btn").should("be.visible")
    })
  })
  it('change page to login and login', () => {
    const linkToLoginPage = cy.get(".header__user-login-btn").contains("Login")
    linkToLoginPage.should("be.visible")
    linkToLoginPage.click()
    cy.url().should("include", "/login")

    
    // Nhập 'example1@example.com' vào trường email
    cy.get("input[type='email']").type("example1@example.com")

    // Nhập '123456' vào trường password
    cy.get("input[type='password']").type("123456")

    // Bấm nút login
    cy.get("button[type='submit']").click()
  })
})