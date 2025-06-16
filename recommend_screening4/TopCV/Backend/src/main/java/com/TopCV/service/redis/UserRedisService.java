package com.TopCV.service.redis;

import com.TopCV.dto.request.UserCreationRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String USER_REGISTRATION_KEY_PREFIX = "user:registration:";
    private static final String OTP_KEY_PREFIX = "otp:";
    private static final Duration REGISTRATION_TTL = Duration.ofMinutes(30); // 30 minutes
    private static final Duration OTP_TTL = Duration.ofMinutes(10); // 10 minutes

    public String saveTemporaryRegistration(UserCreationRequest userCreationRequest) {
        try {
            String keyRedisToken = generateRedisToken();
            String redisKey = USER_REGISTRATION_KEY_PREFIX + keyRedisToken;

            String userDataJson = objectMapper.writeValueAsString(userCreationRequest);

            redisTemplate.opsForValue().set(redisKey, userDataJson, REGISTRATION_TTL);

            log.info("Saved temporary registration data for token: {}", keyRedisToken);
            return keyRedisToken;

        } catch (JsonProcessingException e) {
            log.error("Error serializing user creation request", e);
            throw new RuntimeException("Failed to save registration data", e);
        }
    }

    public UserCreationRequest getTemporaryRegistration(String keyRedisToken) {
        try {
            String redisKey = USER_REGISTRATION_KEY_PREFIX + keyRedisToken;
            String userDataJson = (String) redisTemplate.opsForValue().get(redisKey);

            if (userDataJson == null) {
                log.warn("No registration data found for token: {}", keyRedisToken);
                return null;
            }

            return objectMapper.readValue(userDataJson, UserCreationRequest.class);

        } catch (JsonProcessingException e) {
            log.error("Error deserializing user creation request for token: {}", keyRedisToken, e);
            throw new RuntimeException("Failed to retrieve registration data", e);
        }
    }

    public void deleteTemporaryRegistration(String keyRedisToken) {
        String redisKey = USER_REGISTRATION_KEY_PREFIX + keyRedisToken;
        Boolean deleted = redisTemplate.delete(redisKey);

        if (deleted) {
            log.info("Deleted temporary registration data for token: {}", keyRedisToken);
        } else {
            log.warn("No registration data found to delete for token: {}", keyRedisToken);
        }
    }

    public void saveOtp(String email, String otp) {
        String redisKey = OTP_KEY_PREFIX + email;
        redisTemplate.opsForValue().set(redisKey, otp, OTP_TTL);
        log.info("Saved OTP for email: {}", email);
    }

    public String getOtp(String email) {
        String redisKey = OTP_KEY_PREFIX + email;
        return (String) redisTemplate.opsForValue().get(redisKey);
    }

    public void deleteOtp(String email) {
        String redisKey = OTP_KEY_PREFIX + email;
        Boolean deleted = redisTemplate.delete(redisKey);

        if (deleted) {
            log.info("Deleted OTP for email: {}", email);
        }
    }


    private String generateRedisToken() {
        return UUID.randomUUID().toString();
    }

}
