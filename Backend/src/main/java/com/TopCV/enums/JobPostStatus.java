package com.TopCV.enums;

public enum JobPostStatus {
    PENDING, //Chờ admin duyệt tin mới
    ACTIVE, //Tin đang hiển thị, nhận ứng tuyển
    CLOSED, //Employer đóng tin (đã tuyển đủ)
    EXPIRED, //Hết deadline tự động
    REJECTED, //Admin từ chối tin (lần đầu)
    SUSPENDED //Admin tạm ngưng tin đang active
}
