describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/tasks')
  })
  it('render tasks main', () => {
    cy.get(".tasks .tasks__header").should("be.visible").within(() => {
      cy.get(".tasks-header__title img").should("be.visible")
      cy.get(".tasks-header__title h1").should("be.visible")

      cy.get(".tasks__interact-field .tasks__filter-btn").should("be.visible").within(() => {
        cy.get("i").should("be.visible")
        cy.get("span").should("be.visible")
      })
      cy.get(".tasks__interact-field .tasks__search-box").should("be.visible").within(() => {
        cy.get("input").should("be.visible")
        cy.get("button").should("be.visible")
      })
    })
    
    cy.get(".tasks .tasks__main").should("be.visible").within(() => {
      cy.get(".tasks-main__list").should("have.length", 4).each(() => {
        cy.get(".tasks-main-list__header h2").should("be.visible")
        cy.get(".tasks-main-list__header .tasks-main-list-header__interact-container").should("be.visible")
        // cy.get(".tasks-main-list__content").should("be.visible")
      })
    })
  })

  it('create new task', () => {
    // Login first
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

    // Create task
    const createTaskBtn = cy.get('.tasks-main-list-header__interact-container > button').eq(0).should("be.visible")
    createTaskBtn.click()

    cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
      cy.get("input[name='task_name']").type("New task")
      cy.get("textarea[name='task_des']").type("This is new task")
  
      const statusChooser = cy.get(".common-component__button-dropdown").eq(0).should("be.visible")
      statusChooser.should("be.visible")
      statusChooser.click()

      cy.get("button[data-id='Backlog']").click()
  
      const priorityChooser = cy.get(".common-component__button-dropdown").eq(1).should("be.visible")
      priorityChooser.should("be.visible")
      priorityChooser.click()

      cy.get("button[data-id='Critical']").click()

      cy.get(".task-create__submit-btn").click()
    })

    // Edit task
    cy.get(".common-component__task[data-taskname='New task'] .cc-task__more-options-wrapper").should("be.visible").within(() => {
      cy.get(".cc-task__more-options > button").click()
      cy.get("button[data-id='editTask']").click()

      cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
        cy.get("input[name='task_name']").type("Hello world")
        cy.get("textarea[name='task_des']").type("Oh shit, here we go again")
    
        const statusChooser = cy.get(".common-component__button-dropdown").eq(0).should("be.visible")
        statusChooser.should("be.visible")
        statusChooser.click()
  
        cy.get("button[data-id='Done']").click()
    
        const priorityChooser = cy.get(".common-component__button-dropdown").eq(1).should("be.visible")
        priorityChooser.should("be.visible")
        priorityChooser.click()
  
        cy.get("button[data-id='Minor']").click()
  
        cy.get(".task-create__submit-btn").click()
      })
    })


    // Delete task
    cy.get(".common-component__task[data-taskname='New task'] .cc-task__more-options-wrapper").should("be.visible").within(() => {
      cy.get(".cc-task__more-options > button").click()
      cy.get("button[data-id='deleteTask']").click()
    })
  })
})