describe('Logout spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })
  it('Kiểm tra logout sau khi đăng nhập', () => {
    // Nhập 'example1@example.com' vào trường email
    cy.get("input[type='email']").type("example1@example.com")

    // Nhập '123456' vào trường password
    cy.get("input[type='password']").type("123456")

    // Bấm nút login
    cy.get("button[type='submit']").click()

    // Hiển thị thông báo
    cy.get(".update-success-noti", {timeout: 3000}).should("have.class", 'active').within(() => {
      // Chờ 3s animation :>
      // cy.wait(3000)
      // Kiểm tra có navigate qua /tasks chưa
      cy.url().should('include', '/tasks')
    })     
    // Bấm nút logout từ user-interaction
    cy.get("button[data-testid='user-interaction-btn']").should("be.visible").click()
    cy.get("button[data-testid='logout-btn']").should("be.visible").click()

    cy.wait(2000)

    // Kiểm tra đã hiển thị nút login register chưa
    cy.get(".header__user-login-btn").should("be.visible")
    cy.get(".header__user-joinus-btn").should("be.visible")
    // Kiểm tra đã ẩn user interaction hay chưa
    cy.get("button[data-testid='user-interaction-btn']").should("not.be.visible")
    // Kiểm tra không còn tasks nào được hiển thị
    cy.get(".common-component__task").should('have.length', '0')
  })
})