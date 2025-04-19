package com.TopCV.repository;

import com.TopCV.entity.OTP;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OTPRespository extends MongoRepository<OTP,String> {
}
