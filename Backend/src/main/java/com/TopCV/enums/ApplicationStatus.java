package com.TopCV.enums;

public enum ApplicationStatus {
    PENDING, //Chờ Employer review
    REVIEWING, //Employer đã xem
    SHORTLISTED, //Pass CV
    INTERVIEWED, //PV xong
    HIRED,
    REJECTED, //Chưa phù hợp
    WITHDRAWN // rút đơn (PENDING và REVIEWING)
}
