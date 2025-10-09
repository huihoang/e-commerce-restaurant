# BK Restaurant App

## Giới thiệu
Ứng dụng quản lý nhà hàng thông minh, cho phép khách hàng:
- Đặt bàn trước (Booking Table)
- Đặt món ăn trước khi đến (Pre-Order Food)
- Giúp nhà hàng tối ưu phục vụ, giảm thời gian chờ và nâng cao trải nghiệm khách hàng

Hệ thống bao gồm:
- **Frontend**: Web/Mobile App cho khách hàng đặt bàn và món
- **Backend**: API quản lý nhà hàng, thực đơn, lịch đặt và trạng thái đơn hàng
- **Admin Dashboard**: Quản lý bàn, xác nhận đặt chỗ, theo dõi đơn hàng


## Hình thức thương mại điện tử / Lĩnh vực - Ngành nghề
- **Lĩnh vực:** F&B (Food & Beverage)  
- **Hình thức:** Dịch vụ **đặt bàn** và **đặt món trực tuyến** (Online Booking)  
- Người dùng có thể xem thực đơn, chọn món, đặt chỗ và thanh toán online chỉ với vài thao tác đơn giản.

---

## Mô hình kinh doanh
- **Mô hình:** B2C (Business to Customer) – Cửa hàng/nhà hàng phục vụ khách hàng.  
- **Tác nhân tham gia:**
  - **Khách hàng:** Người đặt bàn, chọn món.  
  - **Cửa hàng / Quán ăn:** Cung cấp món ăn, chỗ ngồi.  
  - **Cổng thanh toán:** Hỗ trợ thanh toán online thứ 3.  

---

## Mô hình doanh thu
- **Doanh thu chính:** Tiền khách hàng thanh toán cho đồ ăn.

---

## Tính năng chính
- **Booking Table**: Chọn thời gian, số lượng khách và đặt bàn trước
- **Pre-Order Food**: Chọn món, số lượng và gửi đơn đặt trước khi đến
- **Thông báo trạng thái**: Cập nhật realtime khi bàn được xác nhận hoặc món sẵn sàng
- **Quản lý nhà hàng**: Admin xem, xác nhận, hủy hoặc chỉnh sửa đơn đặt
- **Quản lý người dùng**: Đăng ký, đăng nhập, xem lịch sử đặt bàn và món ăn

---

## Công nghệ
- **Frontend**: React / React Native, TailwindCSS
- **Backend**: Node.js (Express / NestJS), REST API
- **Database**: MongoDB / SQL Server
- **Realtime**: MQTT / Socket.io (tùy chọn)
- **Authentication**: JWT

---

## Cài đặt & sử dụng

### 1. Clone repo
```bash
git clone https://github.com/huihoang/e-commerce-restaurant.git
cd e-commerce-restaurant

# Chạy BE
cd BE
npm install
npm run dev

# Chạy FE
cd FE
npm install
npm start
```
