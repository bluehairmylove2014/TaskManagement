describe('Login Spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })
  it('Check Use login with valid data', () => {
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
  })
  it('Check Use login with empty data', () => {
    // Không nhập email
    // Nhập '123456' vào trường password
    cy.get("input[type='password']").type("123456")
    // Bấm nút login
    cy.get("button[type='submit']").click()

    // Kiểm tra thẻ enoti-email-invalid có được thêm class "active" vào để hiển thị lên không
    cy.get('#enoti-empty').should('have.class', 'active')
    // Kiểm tra sau animation có xóa class "active" không
    cy.wait(3500);
    cy.get('#enoti-empty').should('not.have.class', 'active')

    // Nhập 'example1@example.com' vào trường email
    cy.get("input[type='email']").type("example1example.com")
    // Xóa mật khẩu
    cy.get("input[type='password']").clear()
    // Bấm nút login
    cy.get("button[type='submit']").click()

    // Kiểm tra thẻ enoti-email-invalid có được thêm class "active" vào để hiển thị lên không
    cy.get('#enoti-empty').should('have.class', 'active')
    // Kiểm tra sau animation có xóa class "active" không
    cy.wait(3500);
    cy.get('#enoti-empty').should('not.have.class', 'active')
  })
  it('Check User login with invalid data (email invalid)', () => {
    // Nhập 'example1@example.com' vào trường email
    cy.get("input[type='email']").type("example1example.com")

    // Nhập '123456' vào trường password
    cy.get("input[type='password']").type("123456")

    // Bấm nút login
    cy.get("button[type='submit']").click()

    // Kiểm tra thẻ enoti-email-invalid có được thêm class "active" vào để hiển thị lên không
    cy.get('#enoti-email-invalid').should('have.class', 'active')
    // Kiểm tra sau animation có xóa class "active" không
    cy.wait(3500);
    cy.get('#enoti-email-invalid').should('not.have.class', 'active')
    
  })
  it('Check User login with invalid data (short password)', () => {
    // Nhập 'example1@example.com' vào trường email
    cy.get("input[type='email']").type("example1@example.com")

    // Nhập '123456' vào trường password
    cy.get("input[type='password']").type("126")

    // Bấm nút login
    cy.get("button[type='submit']").click()

    // Kiểm tra thẻ enoti-psw-short có được thêm class "active" vào để hiển thị lên không
    cy.get('#enoti-psw-short').should('have.class', 'active')
    // Kiểm tra sau animation có xóa class "active" không
    cy.wait(3500);
    cy.get('#enoti-psw-short').should('not.have.class', 'active')
  })
  it('Check User login with invalid data (wrong email)', () => {
    // Nhập 'example1@example.com' vào trường email
    cy.get("input[type='email']").type("examp@example.com")

    // Nhập '123456' vào trường password
    cy.get("input[type='password']").type("123456")

    // Bấm nút login
    cy.get("button[type='submit']").click()

    // Kiểm tra thẻ enoti-wrong có được thêm class "active" vào để hiển thị lên không
    cy.get('#enoti-wrong').should('have.class', 'active')
    // Kiểm tra sau animation có xóa class "active" không
    cy.wait(3500);
    cy.get('#enoti-wrong').should('not.have.class', 'active')
  })
  it('Check User login with invalid data (wrong password)', () => {
    // Nhập 'example1@example.com' vào trường email
    cy.get("input[type='email']").type("example1@example.com")

    // Nhập '123456' vào trường password
    cy.get("input[type='password']").type("12adadad36")

    // Bấm nút login
    cy.get("button[type='submit']").click()

    // Kiểm tra thẻ enoti-wrong có được thêm class "active" vào để hiển thị lên không
    cy.get('#enoti-wrong').should('have.class', 'active')
    // Kiểm tra sau animation có xóa class "active" không
    cy.wait(3500);
    cy.get('#enoti-wrong').should('not.have.class', 'active')
  })
})