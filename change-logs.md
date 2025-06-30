# Change Log

## Upcoming Tasks

- []
- [] tạo transfer để thêm danh sách chờ vào lớp (chỉ áp dụng với học viên) - ở page admin/classes hoặc manager/classes
  - source: có module_id + type học viên nhưng chưa có class_id (status: chưa xếp lớp)
  - target: có class_id + type học viên nhưng chưa có start_date (thiếu ngày)
  - add: add class_id - PUT
  - remove: remove class_id - PATCH

## 2025-06-30

- [] tạo manager/schedules
  - calendar với month data
  - create schedule button (form)
  - tạo classes table: summary số buổi học trong tháng + select để filter lớp trên bảng và calendar
  - transfer theo tuần để copy lịch
- [] tạo admin/users
  - add enrollment to class
  - add enrollment to waiting list (module_id)
- [-] thêm enrollment_wait_date cho enrollments để biết học viên phải đợi bao lâu rồi
  - sử dụng luôn created_at
- [+] sửa lại enrollments-schema để hiển thị đủ dữ liệu trên info
  - course_name, module_name, desc, discount_notes

## 2025-06-29

- [+] add JOIN to enrollments table (services)
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
- [] schedules: lịch học
- [] attendances: điểm danh
- [] assessments: đánh giá
- [] tuitions: học phí
- [] invoices: hoá đơn
