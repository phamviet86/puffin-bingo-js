# Change Log

## Upcoming Tasks

- []
- [] tạo transfer để thêm danh sách chờ vào lớp (chỉ áp dụng với học viên) - ở page admin/classes hoặc manager/classes
  - source: có module_id + type học viên nhưng chưa có class_id (status: chưa xếp lớp)
  - target: có class_id + type học viên nhưng chưa có start_date (thiếu ngày)
  - add: add class_id - PUT
  - remove: remove class_id - PATCH
- [] tạo admin/users
  - add enrollment to class
  - add enrollment to waiting list (module_id)

## 2025-07-02

- [] fix responsive on ScheduleClassesColumns

## 2025-06-30

- [+] tạo manager/schedules
  - calendar với month data
  - create schedule button (form)
  - tạo classes table: summary số buổi học trong tháng + select để filter lớp trên bảng và calendar
  - transfer theo tuần để copy lịch
- [-] thêm enrollment_wait_date cho enrollments để biết học viên phải đợi bao lâu rồi
  - sử dụng luôn created_at
- [+] sửa lại enrollments-schema để hiển thị đủ dữ liệu trên info
  - course_name, module_name, desc, discount_notes
- [+] fix icon for classes page

## 2025-06-29

- [+] add LEFT JOIN to enrollments table (services)
- [+] add enrollments transfer for the class (enrollments-component)

## 2025-06-22

- [+] add modal-transfer component
- [+] add options list page
- [+] add options detail page
- [+] add prompt page-list
- [+] add prompt page-detail
- [+] add prompt tab
- [+] add provider-sample for page

## 2025-06-21

- [+] add base file

# DB NAME

- [+] options: tuỳ chọn
- [+] roles: vai trò
- [+] users: người dùng
- [+] user-roles: phân quyền
- [+] shifts: ca học
- [+] rooms: phòng học
- [+] syllabuses: giáo trình
- [+] modules: học phần
- [+] lectures: bài giảng
- [+] courses: khoá học
- [+] classes: lớp học
- [+] enrollments: đăng ký
- [+] schedules: lịch học
- [] attendances: điểm danh
- [] assessments: đánh giá
- [] tuitions: học phí
- [] invoices: hoá đơn

# Site Map

- [system]
  - [options]: tạo tuỳ chọn
  - [roles]: tạo các quyền
- [setting]
  - [rooms]: tạo phòng
  - shifts: tạo giờ học
  - day-offs: lịch nghỉ (chưa làm)
- [manager]
  - [users]: tạo người dùng
    - [user-roles]: thêm quyền cho người dùng
  - [syllabuses]: tạo giáo trình
    - [modules]: tạo các học phần
    - [lectures]: tạo bài giảng
  - [courses]: tạo các khoá học
    - [classes]: tạo các lớp trong khoá học -> học phí, thời gian học
  - [classes]: xem thông tin và sắp xếp nhân sự
    - [enrollments]: quản lý danh sách lớp (thêm, điều chỉnh, bớt...); thêm đăng ký từ danh sách chờ
  - [schedules]: tạo lịch học, copy lịch học
- [admin]
  - [users]: quản lý danh sách học viên (users không có vai trò)
    - [enrollments]: thêm vào danh sách chờ hoặc xếp lớp luôn
    - [tuitions]: chưa làm
    - [invoices]: chưa làm
  - [classes]: xem danh sách lớp - danh sách học viên
    - [enrollments]: thêm học viên vào lớp hoặc từ danh sách chờ
  - [enrollments]: xếp lớp - xem danh sách chờ -> chuyển đến user cần xếp lớp
    - [attendances]: thống kê số buổi - lịch sử học
    - [assessments]: thông tin đánh giá
  - [schedules]: xếp phòng - điểm danh
  - [attendances]: xếp học bù
  - [tuitions]: tạo thông báo học phí
  - [invoices]: thu tiền
- [teacher]
  - [syllabuses]: xem giáo trình
  - [classes]: xem danh sách lớp
    - [enrollments]: xem danh sách lớp
    - [schedules]: lịch sử lớp học
  - [schedules]: lịch làm việc - lesson plan
    - [attendances]: danh sách lớp
    - [assessments]: đánh giá học viên
- [teaching-assistant]
