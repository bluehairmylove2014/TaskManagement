import { result } from "lodash"

describe('Tasks spec', () => {
  // Đăng nhập cái nha
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')

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
  it('Kiểm tra trang task có render đủ các thành phần cơ bản không', () => {
    // "Các thành phần phải render đủ gồm:
    // 1. Header
    cy.get(".header").should("be.visible")
    // 2. Header logo
    cy.get(".header__logo").should("be.visible").within(() => {
      cy.get("img").should("be.visible")
    })
    // 3. Header avatar
    cy.get("button[data-testid='user-interaction-btn']").should("be.visible")
    cy.get("a[data-testid='avatar']").should("be.visible")
    // 4. Nút notiffication
    cy.get(".header__notification").should("be.visible").within(() => {
      cy.get("i").should("be.visible")
    })
    // 5. Tiêu đề task
    cy.get(".tasks-header__title").should("be.visible").within(() => {
      cy.get("img").should("be.visible")
      cy.get("h1").should("be.visible")
    })
    // 6. Nút Filter
    cy.get(".tasks__filter-btn").should("be.visible")
    // 7. Ô search
    cy.get(".tasks__search-box").should("be.visible").within(() => {
      cy.get("input").should("be.visible")
      cy.get("button").should("be.visible")
    })
    // 8. 4 task lists
    cy.get(".tasks-main__list").should("have.length", 4)
    // 9. Nút sort dropdown trên từng task lists
    cy.get(".tasks-main-list-header__sort-options-btn").should("have.length", 4)
    // 10. Nút tạo task trên từng task list"
    cy.get(".tasks-main-list-header__create-btn").should("have.length", 4)
  })

  it('Kiểm tra các thành phần cơ bản có tương tác đúng hay không', () => {
    // Bấm vào filter, filter phải hiện ra, bấm 1 lần nữa hoặc 
    // bấm nút đóng thì phải đóng bảng filter lại
    cy.get(".tasks__filter-btn").should("be.visible").click()
    cy.get(".common-component__filter-board").should("be.visible")
    cy.get(".tasks__filter-btn").should("be.visible").click()
    cy.get(".common-component__filter-board").should("not.be.visible")

    cy.get(".tasks__filter-btn").should("be.visible").click()
    cy.get(".common-component__filter-board").should("be.visible")
    cy.get(".cc-filter__close-btn").should("be.visible").click()
    cy.get(".common-component__filter-board").should("not.be.visible")

    // Bấm vào user interaction thì dropdown xổ xuống gồm Profile, 
    // Setting, Logout, bấm ra ngoài thì đóng lại
    cy.get("button[data-testid='user-interaction-btn']").should("be.visible").click()
    cy.get(".header-user-dropdown__content").should("be.visible").within(() => {
      cy.get("li a").should("have.length", 2)
      cy.get("li button").should("have.length", 1)
    })
    cy.get("button[data-testid='user-interaction-btn']").should("be.visible").click()
    cy.get(".common-component__filter-board").should("not.be.visible")

    // Lấy từng task list
    cy.get(".tasks-main__list").each(($list) => {
      // Bấm vào sort dropdown thì xổ xuống gồm Sort By Priority, 
      // reverse Sort, bấm ra ngoài thì đóng lại
      cy.wrap($list).find(".tasks-main-list-header__sort-options-btn").should("be.visible").click()
      cy.wrap($list).find(".tasks-main-list-header__sort-dropdown").should("be.visible").within(() => {
        cy.get(".tasks-main-list-header__priority-sort").should("be.visible")
        cy.get(".tasks-main-list-header__reverse-sort").should("be.visible")
      })
      cy.wrap($list).find(".tasks-main-list-header__sort-options-btn").should("be.visible").click()
      cy.wrap($list).find(".tasks-main-list-header__sort-dropdown").should("not.be.visible")

      // Bấm vào tạo task thì bảng tạo task hiện ra, bấm đóng thì đóng lại
      cy.wrap($list).find(".tasks-main-list-header__create-btn").should("be.visible").click()
      cy.wait(1000)
      cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
        cy.get(".tasks__close-btn").should("be.visible").click()
      })
      cy.get(".common-component__tasks-configuration").should("not.be.visible")
    })

    // Bấm more options thì bảng more option hiện ra gồm Edit Task và Delete Task
    cy.get(".common-component__task").each(($task) => {
      cy.wrap($task).find("button[data-testid='showDropdown']").should("be.visible").click()
      cy.wrap($task).find(".cc-task__more-options-dropdown").should("be.visible").within(() => {
        cy.get("button[data-id='deleteTask']").should("have.length", 1)
        
        // Bấm Edit Task thì bảng Edit Task hiện ra, bấm đóng thì đóng lại
        cy.get("button[data-id='editTask']").should("have.length", 1).click()
      })
      cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
        cy.get(".tasks__close-btn").should("be.visible").click()
      })
      cy.get(".common-component__tasks-configuration").should("not.be.visible")
    })
  })

  it('Thêm task mới hợp lệ (Không để trống task_name, status, priority)', () => {
    // 2.Chọn chức năng "Thêm task".
    const createTaskBtn = cy.get('.tasks-main-list-header__interact-container > button').eq(0).should("be.visible")
    createTaskBtn.click()

    cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
      // 3.Nhập tên task, giai đoạn, tags, description, due_date và priority.
      // Tên task
      cy.get("input[name='task_name']").type("New task")

      // Tạo tag
      cy.get("button[data-testid='add-tag-btn']").should("be.visible").click()
      cy.get(".task-create-main__new-tag").should("be.visible").within(() => {
        cy.get("input").eq(0).should("be.visible").type("Design")
        cy.get("input").eq(1).should("be.visible").invoke("val", "#3C2C7C").trigger("change")
        cy.get("button").should("be.visible").click();
      })

      // Description
      cy.get("textarea[name='task_des']").type("This is new task")
      
      // Chọn status
      const statusChooser = cy.get(".common-component__button-dropdown").eq(0).should("be.visible")
      statusChooser.should("be.visible").click()
      cy.get("button[data-id='Process']").click()
  
      // Chọn Priority
      const priorityChooser = cy.get(".common-component__button-dropdown").eq(1).should("be.visible")
      priorityChooser.should("be.visible").click()
      cy.get("button[data-id='Critical']").click()

      // 4.Lưu task.
      cy.get(".task-create__submit-btn").click()
    })
    cy.wait(2000);
    // Kiểm tra lại task có kết quả đúng chưa
    const resultTask = cy.get("[data-taskname='New task'][data-status='Process'][data-priority='Critical']");
    resultTask.should("be.visible").within(() => {
      // Kiểm tra title
      cy.get(".cc-task__title").contains("New task")
      // Kiểm tra tag Design
      cy.get(".cc-task__tag[data-testid='task-tag-Design']").should("be.visible")
      // Kiểm tra description
      cy.get(".cc-task__description").contains("This is new task")
    })

  })
  it("Edit task nhưng xóa task_name", () => {

    // 2.Tìm và chọn task cần chỉnh sửa.
    cy.get(".common-component__task[data-taskname='New task'] .cc-task__more-options-wrapper").should("be.visible").within(() => {
      cy.get(".cc-task__more-options > button").should("be.visible").click()

      // 3.Chọn chức năng "Edit task".
      cy.get("button[data-id='editTask']").should("be.visible").click()
    })
    cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
      // 4.Sửa các thông tin cần thay đổi (tên task, giai đoạn, tags, description, due_date, priority).
      cy.get("input[name='task_name']").should("be.visible").clear() // Xóa task_name
      // Description
      cy.get("textarea[name='task_des']").should("be.visible").clear().type("Oh shit, here we go again")

      // Tạo tag
      cy.get("button[data-testid='add-tag-btn']").should("be.visible").click()
      cy.get(".task-create-main__new-tag").should("be.visible").within(() => {
        cy.get("input").eq(0).should("be.visible").type("Coding")
        cy.get("input").eq(1).should("be.visible").invoke("val", "#8B0000").trigger("change")
        cy.get("button").should("be.visible").click();
      })
  
      // Chọn status
      const statusChooser = cy.get(".common-component__button-dropdown").eq(0).should("be.visible")
      statusChooser.should("be.visible").click()
      cy.get("button[data-id='Done']").click()
  
      // Chọn Priority
      const priorityChooser = cy.get(".common-component__button-dropdown").eq(1).should("be.visible")
      priorityChooser.should("be.visible").click()
      cy.get("button[data-id='Minor']").click()

      // 5.Lưu task đã chỉnh sửa.
      cy.get(".task-create__submit-btn").click()

      // Hiển thị thông báo yêu cầu nhập task_name.
      cy.get(".tasks-create__error-notification").should("be.visible").within(() => {
        cy.get("p b").contains("Please choose task name!")
      })
    })
  })
  it("Edit task hợp lệ (Không để trống task_name, status, priority)", () => {

    // 2.Tìm và chọn task cần chỉnh sửa.
    cy.get(".common-component__task[data-taskname='New task'] .cc-task__more-options-wrapper").should("be.visible").within(() => {
      cy.get(".cc-task__more-options > button").should("be.visible").click()

      // 3.Chọn chức năng "Edit task".
      cy.get("button[data-id='editTask']").should("be.visible").click()
    })
    cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
      // 4.Sửa các thông tin cần thay đổi (tên task, giai đoạn, tags, description, due_date, priority).
      cy.get("input[name='task_name']").should("be.visible").clear().type("Hello world")
      // Description
      cy.get("textarea[name='task_des']").should("be.visible").clear().type("Oh shit, here we go again")

      // Tạo tag
      cy.get("button[data-testid='add-tag-btn']").should("be.visible").click()
      cy.get(".task-create-main__new-tag").should("be.visible").within(() => {
        cy.get("input").eq(0).should("be.visible").type("Coding")
        cy.get("input").eq(1).should("be.visible").invoke("val", "#8B0000").trigger("change")
        cy.get("button").should("be.visible").click();
      })
  
      // Chọn status
      const statusChooser = cy.get(".common-component__button-dropdown").eq(0).should("be.visible")
      statusChooser.should("be.visible").click()
      cy.get("button[data-id='Done']").click()
  
      // Chọn Priority
      const priorityChooser = cy.get(".common-component__button-dropdown").eq(1).should("be.visible")
      priorityChooser.should("be.visible").click()
      cy.get("button[data-id='Minor']").click()

      // 5.Lưu task đã chỉnh sửa.
      cy.get(".task-create__submit-btn").click()
    })
    cy.wait(2000);
    // Kiểm tra lại task có kết quả đúng chưa
    const resultTask = cy.get("[data-taskname='Hello world'][data-status='Done'][data-priority='Minor']");
    resultTask.should("be.visible").within(() => {
      // Kiểm tra title
      cy.get(".cc-task__title").contains("Hello world")
      // Kiểm tra tag Design
      cy.get(".cc-task__tag[data-testid='task-tag-Design']").should("be.visible")
      cy.get(".cc-task__tag[data-testid='task-tag-Coding']").should("be.visible")
      // Kiểm tra description
      cy.get(".cc-task__description").contains("Oh shit, here we go again")
    })
  })
  it("Xóa task", () => {
    const resultTask = cy.get("[data-taskname='Hello world'][data-status='Done'][data-priority='Minor']");
    resultTask.should("be.visible").within(() => {
      cy.get(".cc-task__more-options-wrapper").should("be.visible").within(() => {
        cy.get(".cc-task__more-options > button").click()
        cy.get("button[data-id='deleteTask']").click()
      })
    })
  })

  it("Thêm task nhưng không chọn status", () => {
    // 2.Chọn chức năng "Thêm task".
    const createTaskBtn = cy.get('.tasks-main-list-header__interact-container > button').eq(0).should("be.visible")
    createTaskBtn.click()

    cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
      // 3.Nhập tên task, tags, description, due_date và priority.
      // Tên task
      cy.get("input[name='task_name']").type("New task")

      // Tạo tag
      cy.get("button[data-testid='add-tag-btn']").should("be.visible").click()
      cy.get(".task-create-main__new-tag").should("be.visible").within(() => {
        cy.get("input").eq(0).should("be.visible").type("Design")
        cy.get("input").eq(1).should("be.visible").invoke("val", "#3C2C7C").trigger("change")
        cy.get("button").should("be.visible").click();
      })

      // Description
      cy.get("textarea[name='task_des']").type("This is new task")
  
      // Chọn Priority
      const priorityChooser = cy.get(".common-component__button-dropdown").eq(1).should("be.visible")
      priorityChooser.should("be.visible").click()
      cy.get("button[data-id='Critical']").click()

      // 4.Lưu task.
      cy.get(".task-create__submit-btn").click()

      // Hiển thị thông báo yêu cầu nhập status.
      cy.get(".tasks-create__error-notification").should("be.visible").within(() => {
        cy.get("p b").contains("Please choose task status!")
      })
    })
  })
  it("Thêm task nhưng không điền task_name", () => {
    // 2.Chọn chức năng "Thêm task".
    const createTaskBtn = cy.get('.tasks-main-list-header__interact-container > button').eq(0).should("be.visible")
    createTaskBtn.click()

    cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
      // 3.Nhập tags, description, status, due_date và priority.

      // Tạo tag
      cy.get("button[data-testid='add-tag-btn']").should("be.visible").click()
      cy.get(".task-create-main__new-tag").should("be.visible").within(() => {
        cy.get("input").eq(0).should("be.visible").type("Design")
        cy.get("input").eq(1).should("be.visible").invoke("val", "#3C2C7C").trigger("change")
        cy.get("button").should("be.visible").click();
      })

      // Description
      cy.get("textarea[name='task_des']").type("This is new task")

      // Chọn status
      const statusChooser = cy.get(".common-component__button-dropdown").eq(0).should("be.visible")
      statusChooser.should("be.visible").click()
      cy.get("button[data-id='Process']").click()
  
      // Chọn Priority
      const priorityChooser = cy.get(".common-component__button-dropdown").eq(1).should("be.visible")
      priorityChooser.should("be.visible").click()
      cy.get("button[data-id='Critical']").click()

      // 4.Lưu task.
      cy.get(".task-create__submit-btn").click()

      // Hiển thị thông báo yêu cầu nhập status.
      cy.get(".tasks-create__error-notification").should("be.visible").within(() => {
        cy.get("p b").contains("Please choose task name!")
      })
    })
  })
  it("Thêm task nhưng không chọn priority", () => {
    // 2.Chọn chức năng "Thêm task".
    const createTaskBtn = cy.get('.tasks-main-list-header__interact-container > button').eq(0).should("be.visible")
    createTaskBtn.click()

    cy.get(".common-component__tasks-configuration").should("be.visible").within(() => {
      // 3.Nhập task_name, tags, description, status, due_date.
      // Tên task
      cy.get("input[name='task_name']").type("New task")

      // Tạo tag
      cy.get("button[data-testid='add-tag-btn']").should("be.visible").click()
      cy.get(".task-create-main__new-tag").should("be.visible").within(() => {
        cy.get("input").eq(0).should("be.visible").type("Design")
        cy.get("input").eq(1).should("be.visible").invoke("val", "#3C2C7C").trigger("change")
        cy.get("button").should("be.visible").click();
      })

      // Description
      cy.get("textarea[name='task_des']").type("This is new task")

      // Chọn status
      const statusChooser = cy.get(".common-component__button-dropdown").eq(0).should("be.visible")
      statusChooser.should("be.visible").click()
      cy.get("button[data-id='Process']").click()

      // 4.Lưu task.
      cy.get(".task-create__submit-btn").click()

      // Hiển thị thông báo yêu cầu nhập status.
      cy.get(".tasks-create__error-notification").should("be.visible").within(() => {
        cy.get("p b").contains("Please choose task priority!")
      })
    })
  })
})