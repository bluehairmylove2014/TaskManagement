# Cách deploy dự án reactjs lên AWS S3 sử dụng GITLAB CI/CD

## Điều kiện tiên quyết:
1. Cần có tài khoản AWS
2. Node.js >= 14.0.0 và npm >= 5.6 được cài đặt trên hệ thống
3. Dĩ nhiên là cần có 1 tài khoản Gitlab và 1 dự án Reactjs trên đó rồi
4. Tên miền (Cái này optional thôi)

## Bước 1: Cấu hình AWS S3 bucket và deploy tĩnh
1. Tìm kiếm dịch vụ S3 trên thanh tìm kiếm
2. Bấm Create Bucket
3. Nhập tên cho bucket, nếu đã có tên miền thì bỏ tên miền vào ví dụ: `www.sunrise-continent.online` hoặc tên nào đó bất kì nếu chưa có tên miền
4. Chọn khu vực, mình sẽ ưu tiên chọn `Asia Pacific (Singapore) ap-southeast-1` vì nó gần
5. Bỏ tick `Block all public access` trong `Block Public Access settings for this bucket` để có thể truy cập bucket một cách public được
6. Cuối cùng là bấm `Create Bucket`

## Bước 2: Đẩy dữ liệu tĩnh lên bucket
1. Ta đã có bucket, hãy đẩy code lên bucket bằng cách bấm vào nút upload trong bucket và kéo thả TOÀN BỘ FILES trong folder build trong dự án reactjs của mình vào
2. Nếu chưa có folder build và không biết build thế nào. Mở vscode hay cmd lên, di chuyển vào thư mục gốc của dự án Reactjs và gõ `npm run build`. Sau quá trình build thành công bạn sẽ có 1 thư mục build ngoài thư mục gốc của dự án. Kéo toàn bộ files của nó vào và upload lên bucket đi nhé.
3. Bấm nút upload và chờ quá trình upload thành công thôi, không thành công là do nghiệp quật đó nhé

## Bước 3: Cập nhật policy cho bucket
1. Quay trở về bucket, chuyển qua tab `Properties` và kéo xuống chọn phần `Static website hosting và chọn Edit`
2. Trong mục `Static website hosting`, chọn enable
3. Trong Index document điền là `index.html` vì sau khi build sẽ có 1 file index.html nằm ngoài thư mục gốc của build, đó là file chính để chạy code, nói chung lý do như nào thì tự tìm hiểu nhé.
4. Cuối cùng chọn `Save changes` để lưu các thay đổi
5. Bây giờ kéo lại xuống dưới dùng của tab `Properties` trong phần `Static website hosting` có để 1 đường link, nó dẫn tới trang web mà mình đã deploy, giờ thử click vào nào.
6. Bùm, `403 Forbidden - Code: AccessDenied`. Vậy lý do là gì? Đơn giản là do ta chưa cấu hình policy cho cái bucket này để có thể truy cập tới các object của bucket, tức là bucket thì public đó nhưng object của nó thì không. Policy sinh ra để làm điều đó.
7. Quay về lại bucket và chuyển qua tab `Permission`. Trong `Bucket policy` chọn `Edit`
8. Ở đây bạn không có Policy và cũng chả biết code Policy làm sao, đừng lo, bấm `Policy generator` góc trên bên phải. Giao diện tạo policy sẽ hiện ra
9. Làm theo tôi:
`Select Type of Policy: S3 Bucket Policy`
`Principal:*`
`Actions: GetObject` ( Nếu muốn mạnh thì bấm All Action cũng được :> )
`Amazon Resource Name (ARN): arn:aws:s3:::hello-mydear/*` (Với arn:aws:s3:::hello-mydear là Bucket ARN trong tab Edit bucket policy)
10. Bấm `Add Statement và Generate Policy` để lấy Policy dưới dạng JSON, copy paste nó vô Policy trong tab `Edit bucket policy` rồi `Save Changes`
11. Quay trở lại Link website, bùm, bạn đã có thể truy cập thành công rồi hehe 

## Bước 4: Cấu hình IAM và Gitlab CI / CD  
Giờ ta có một vấn đề mới, nếu mỗi lần code xong, ta phải `npm run build` và kéo thả vô bucket thì lại quá tốn công sức, thời gian đó để dành cho việc kiếm người yêu còn tốt hơn. Do đó, một giải pháp cho việc đó là GITLAB CI / CD.
Nói nôm na thế này, mỗi khi bạn push code lên dự án trên gitlab, gitlab sẽ tự nhận diện được và đẩy chúng vào pipeline, giao cho gitlab runner xử lý các tác vụ cho đoạn code mới vừa push lên này, mà gitlab runner làm cái gì? Bạn sẽ là người hướng dẫn nó, tạo 1 file có tên chính xác là `.gitlab-ci.yml` và yêu cầu gitlab runner chạy `npm run build` xong đẩy artifact mới (hay dễ hiểu là code mới vừa build) lên lại AWS S3 1 cách tự động. Bạn không cần phải cấu hình thêm bất kì điều gì cả.
Giờ thì bắt đầu thôi!
1. Trước tiên ta cần tìm kiếm và sử dụng dịch vụ IAM (Identity and Access Management) trên AWS. Nói nôm na nó là một dịch vụ cho phép ta quản lý các truy cập tới dịch vụ khác của AWS một cách an toàn. Bạn cứ hiểu nó cho phép ta tạo các Users trên đó, mỗi User có một policy định nghĩa cho phép các quyền truy cập riêng, ở đây ta phải tạo một Users thông qua IAM có quyền truy cập tới S3 Bucket.
2. Ta tìm kiếm dịch vụ IAM trên thanh tìm kiếm của AWS, Trong phần `Access management` chọn `Users`
3. Chọn `add users`, điền username vd như `gitlab-ci-hellomydear` và `next`.
4. Trong `Permissions options` chọn `Attach policies directly`. Trong `Permissions policies` tìm kiếm `AmazonS3FullAccess`. Policy này cho phép ta toàn quyền truy cập tới S3 bucket. Chọn `next`
5. Nếu không tạo tags gì thì `create user`. Giờ bạn đã có một user cơ bản nhưng chưa đâu, bạn cần phải lấy được các access key và secret key. Chọn vào user đã tạo, chuyển qua tab `Security credentials`, kéo xuống `Access keys` và chọn `Create access key`.
6. Trong `Access key best practices & alternatives` tìm và chọn `Third-party service` vì mình đang sử dụng bên thứ 3 là gitlab. Tick vào `I understand the above recommendation and want to proceed to create an access key.` và chọn `next`
7. Thêm description và tạo key. Sau đó BẮT BUỘC LƯU LẠI `Access key` và `Secret access key`. Bạn có thể chuyển qua project gitlab, chọn setting -> CI/CD -> Variables -> Create Variable -> điền tên AWS_ACCESS_KEY_ID và value là key của bạn, làm tương tự với AWS_SECRET_ACCESS_KEY. Vậy là đã xong cấu hình IAM rồi, giờ ta sẽ chuyển qua cấu hình Gitlab CI/CD.
8. Tạo 1 file mới có tên CHÍNH XÁC là `.gitlab-ci.yml` trong thư mục GỐC của dự án. Điền nội dung cấu hình sau:
`build website:
  stage: build
  image: node:18
  variables:
    CI: "false"
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - build/

deploy to s3:
  stage: deploy
  image: 
    name: amazon/aws-cli
    entrypoint: [""]
  script:
    - aws --version
    - aws s3 rm s3://$S3_BUCKET --recursive
    - aws s3 cp build/ s3://$S3_BUCKET --recursive`

Trong đó, node:18 là chỉ định phiên bản của nodejs sử dụng, artifact ta cần đẩy lên nằm trong `build/`. Ta có 2 giai đoạn cơ bản (không test) gồm giai đoạn build và giai đoạn deploy to s3. trong giai đoạn deploy, ta `aws s3 rm s3://$S3_BUCKET --recursive` remove sạch sẽ, rồi copy lên bằng `aws s3 cp build/ s3://$S3_BUCKET --recursive`
9. Vậy còn `S3_BUCKET` là cái gì vậy, đó là tên của bucket trên s3 mà ta cần deploy lên, vậy làm sao để cái file này hiểu được, bên cạnh cách ta để thẳng biến vào file này, trên gitlab, truy cập setting -> CI / CD -> Variables -> add variable, nhập tên là S3_BUCKET với value là tên bucket của bạn. Thế là xong.

## Bước 5: Cài đặt và đăng nhập AWS CLI
Ta thao tác thông qua AWS CLI mà, dĩ nhiên phải cài đặt và đăng nhập chứ, nếu không AWS biết ta là ai mà cho đẩy code hehe

### Cài đặt AWS CLI Trên Windows

1. Tải xuống bộ cài đặt AWS CLI cho Windows từ [trang web chính thức của AWS](https://awscli.amazonaws.com/AWSCLIV2.msi).

2. Mở tệp .msi vừa tải xuống và làm theo hướng dẫn để cài đặt.

### Cài đặt AWS CLI Trên macOS

1. Mở Terminal.

2. Chạy lệnh sau để cài đặt AWS CLI bằng Homebrew: `brew install awscli`

### Cài đặt AWS CLI Trên Linux

1. Mở Terminal.

2. Chạy các lệnh sau để tải xuống và cài đặt AWS CLI:
`curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"`
`unzip awscliv2.zip`
`sudo ./aws/install`

### Đăng nhập AWS CLI bằng Access Key và Secret Access Key

1. Mở Terminal hoặc Command Prompt.

2. Chạy lệnh sau để bắt đầu quá trình cấu hình AWS CLI: `aws configure`

3. Khi được yêu cầu, nhập Access Key và Secret Access Key của bạn. Bạn có thể lấy chúng từ trang quản lý tài khoản AWS của bạn. Hoặc vô gitlab, vào setting -> CI / CD -> Variables và lấy key bạn đã lưu ở bước trước
`AWS Access Key ID [None]: YOUR_ACCESS_KEY
AWS Secret Access Key [None]: YOUR_SECRET_ACCESS_KEY`

4. Đối với các lựa chọn Default region name và Default output format, bạn có thể nhập giá trị tùy chọn hoặc để trống để sử dụng các giá trị mặc định. (Default region name của tôi là ap-southeast-1 vì tôi chọn singapore ngay đầu lúc tạo bucket)

Sau khi hoàn tất, AWS CLI của bạn sẽ được cấu hình để sử dụng Access Key và Secret Access Key mà bạn đã cung cấp. Bạn giờ đây có thể sử dụng AWS CLI để tương tác với các dịch vụ AWS của mình.

Lưu ý: Đảm bảo rằng bạn bảo mật Access Key và Secret Access Key của mình. Không bao giờ chia sẻ chúng với người khác hoặc lưu trữ chúng trong mã nguồn công khai. 

## Bước cuối: Cấu hình Gitlab runner
Bạn biết đấy, đoạn code trong .gitlab-ci.yml do ai xử lý, gitlab tự động hả, mơ đi. Gitlab runner sinh ra để làm điều đó. Truy cập setting -> CI / CD -> Runners, sau đó copy lại giá trị `registration token` để chuẩn bị cấu hình runner.
Có 2 giải pháp, nếu bạn muốn sử dụng runner của người khác, bạn có thể dùng. Nhưng tôi trong bài này sẽ tự tạo runner chạy trên máy mình, có làm thì mới có ăn.

### Tải GitLab Runner

1. Truy cập vào trang [GitLab Runner downloads](https://gitlab-runner-downloads.s3.amazonaws.com/latest/index.html) và tải xuống phiên bản phù hợp với hệ điều hành Windows của bạn (ví dụ: gitlab-runner-windows-amd64.exe). Hoặc xem hướng dẫn cài đặt trên [How to install gitlab runner](https://docs.gitlab.com/runner/install/). Tôi dùng windows nên tôi download ở đây: [How to install gitlab runner on window](https://docs.gitlab.com/runner/install/windows.html).

2. Sau khi tải xuống, đổi tên tệp thành gitlab-runner.exe và di chuyển nó vào một thư mục trong PATH của bạn (ví dụ: `C:\GitLab-Runner\`).

### Đăng ký GitLab Runner

1. Mở PowerShell hoặc cmd DƯỚI QUYỀN ADMIN và chuyển đến thư mục chứa gitlab-runner.exe.

2. Chạy lệnh sau để đăng ký GitLab Runner: `gitlab-runner.exe register`

3. Khi được yêu cầu, cung cấp URL của GitLab instance của bạn, token đăng ký runner (có thể tìm thấy trong cài đặt CI/CD của dự án GitLab của bạn), mô tả cho runner, và các tags (nếu có). Ví dụ:
- Enter the GitLab instance URL: `gitlab.kyanon.digital`
- Enter the registration token: (Nãy tôi đã nói bạn lưu đó)
- Enter a description for the runner: (Tùy bạn)
- Enter tags for the runner (comma-separated): (Tùy bạn)
- Enter optional maintenance note for the runner: (Tùy bạn)
- Enter an executor: parallels, shell, ssh, virtualbox, docker+machine, custom, docker, docker-windows, instance, kubernetes, docker-autoscaler: `shell` (Tùy vào trình chạy lệnh trên máy bẹn)

4. Config thành công, bạn nhận được 1 file config.toml trong cùng thư mục nhằm cho phép bạn hiện chỉnh runner. Mở file đó bằng bất kì trình đọc file nào bạn có. Tại dòng shell = "pwsh", thay đổi thành shell = "powershell" vì tôi dùng window powershell trên máy. Còn bạn muốn dùng trình chạy lệnh khác thì bạn có thể thay thế.

### Cài đặt và chạy GitLab Runner

1. DƯỚI QUYỀN ADMIN, chạy lệnh sau để cài đặt GitLab Runner như một dịch vụ Windows: `gitlab-runner.exe install`

2. Chạy lệnh sau để khởi động dịch vụ GitLab Runner: `gitlab-runner.exe start`

Bây giờ, GitLab Runner của bạn đã được cấu hình để sử dụng Windows PowerShell như executor. Bạn có thể kiểm tra trạng thái của nó bằng cách chạy lệnh gitlab-runner.exe status.

Lưu ý: Đảm bảo rằng bạn có quyền quản trị khi thực hiện các bước này. Nếu không, bạn có thể cần chạy PowerShell như một quản trị viên. 


Xong, bạn đã hoàn thành tất cả các bước để cấu hình gitlab CI / CD để tự động đẩy code lên môi trường production mỗi khi push gode lên git. Cảm ơn đã them dõi, nếu muốn ủng hộ thì donate MOMO: 0337839146 hehe :>
