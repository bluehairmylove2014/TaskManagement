# Hướng dẫn sử dụng Vercel

Vercel là một nền tảng hosting phía máy chủ (serverless) giúp bạn triển khai các ứng dụng web một cách nhanh chóng và dễ dàng. Vercel hỗ trợ nhiều framework phổ biến như Next.js, Gatsby, Hugo, Eleventy, Ember, Vue.js, Angular và tất nhiên là Create React App.

## Các bước để deploy Create React App lên Vercel thông qua Github

### Bước 1: Tạo một ứng dụng Create React App

Đầu tiên, bạn cần tạo một ứng dụng Create React App. Để làm điều này, mở terminal và chạy lệnh sau: `npx create-react-app my-app`

### Bước 2: Đẩy ứng dụng lên Github

Tiếp theo, bạn cần đẩy ứng dụng của mình lên Github. Đầu tiên, khởi tạo một kho lưu trữ Git mới trong thư mục của ứng dụng: `git init`
Sau đó, thêm tất cả các file vào kho lưu trữ: `git add .`

Commit các thay đổi: `git commit -m "Initial commit"`
Tiếp theo, tạo một kho lưu trữ mới trên Github và liên kết kho lưu trữ trên máy của bạn với kho lưu trữ trên Github: `git remote add origin https://github.com/yourusername/your-repo-name.git`

Cuối cùng, đẩy ứng dụng của bạn lên Github: `git push -u origin master`

### Bước 3: Triển khai ứng dụng lên Vercel

Đầu tiên, bạn cần tạo một tài khoản Vercel. Sau khi đã tạo tài khoản, đăng nhập và nhấp vào nút "Import Project".

Trong trang mới, chọn "Import Git Repository". Dán liên kết của kho lưu trữ Github vào ô và nhấp vào "Continue".

Trong trang tiếp theo, để tất cả các tùy chọn ở mặc định và nhấp vào "Deploy". Vercel sẽ tự động cài đặt tất cả các gói phụ thuộc, xây dựng ứng dụng của bạn và triển khai nó.
