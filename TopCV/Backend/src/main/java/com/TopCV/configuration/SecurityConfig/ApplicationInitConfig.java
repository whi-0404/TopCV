package com.TopCV.configuration.SecurityConfig;

import com.TopCV.entity.User;
import com.TopCV.enums.Role;
import com.TopCV.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUserName("admin").isEmpty()) {

                User user = User.builder()
                        .userName("admin")
                        .password(passwordEncoder.encode("12345678"))
                        .email("admin@gmail.com")
                        .emailVerified(true)
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with password: 12345678, please change it!");
            }
        };
    }
}
