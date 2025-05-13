package com.example.demo.service.impl;

import com.example.demo.dto.JwtAuthResponse;
import com.example.demo.dto.LoginDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.entity.SeekerProfile;
import com.example.demo.entity.UserAccount;
import com.example.demo.entity.UserType;
import com.example.demo.entity.OtpEntity;
import com.example.demo.entity.Company;
import com.example.demo.entity.CompanyImage;
import com.example.demo.repository.SeekerProfileRepository;
import com.example.demo.repository.UserAccountRepository;
import com.example.demo.repository.UserTypeRepository;
import com.example.demo.repository.OtpRepository;
import com.example.demo.repository.CompanyRepository;
import com.example.demo.repository.CompanyImageRepository;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.service.AuthService;
import com.example.demo.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.BadCredentialsException;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository userAccountRepository;
    private final UserTypeRepository userTypeRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final CompanyRepository companyRepository;
    private final CompanyImageRepository companyImageRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                          UserAccountRepository userAccountRepository,
                          UserTypeRepository userTypeRepository,
                          SeekerProfileRepository seekerProfileRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider,
                          OtpRepository otpRepository,
                          EmailService emailService,
                          CompanyRepository companyRepository,
                          CompanyImageRepository companyImageRepository) {
        this.authenticationManager = authenticationManager;
        this.userAccountRepository = userAccountRepository;
        this.userTypeRepository = userTypeRepository;
        this.seekerProfileRepository = seekerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.companyRepository = companyRepository;
        this.companyImageRepository = companyImageRepository;
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDto.getEmail(),
                            loginDto.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(authentication);

            // Get user info
            UserAccount userAccount = userAccountRepository.findByEmail(loginDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
            
            // Update last login time
            userAccount.setLastLoginDate(LocalDateTime.now());
            userAccountRepository.save(userAccount);

            return new JwtAuthResponse(
                    token,
                    userAccount.getUserId(),
                    userAccount.getEmail(),
                    userAccount.getUserType().getUserTypeName()
            );
            
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }
    }

    @Override
    @Transactional
    public String register(RegisterDto registerDto) {
        // Check if email exists
        if (userAccountRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống");
        }

        // Get user type
        UserType userType = userTypeRepository.findById(registerDto.getUserTypeId())
                .orElseThrow(() -> new RuntimeException("Loại người dùng không hợp lệ"));

        // Create user account
        UserAccount userAccount = new UserAccount();
        userAccount.setEmail(registerDto.getEmail());
        userAccount.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        userAccount.setUserType(userType);
        userAccount.setDateOfBirth(registerDto.getDateOfBirth());
        userAccount.setGender(registerDto.getGender());
        userAccount.setContactNumber(registerDto.getContactNumber());
        userAccount.setIsActive(true);
        userAccount.setRegistrationDate(LocalDateTime.now());
        userAccount.setUserImage(registerDto.getUserImage());

        UserAccount savedUserAccount = userAccountRepository.save(userAccount);

        // Create profile based on user type
        if (userType.getUserTypeName().equalsIgnoreCase("seeker")) {
            if (registerDto.getFirstName() == null || registerDto.getLastName() == null) {
                throw new RuntimeException("Họ và tên là bắt buộc cho người tìm việc");
            }
            
            SeekerProfile seekerProfile = new SeekerProfile();
            seekerProfile.setUserAccount(savedUserAccount);
            seekerProfile.setFirstName(registerDto.getFirstName());
            seekerProfile.setLastName(registerDto.getLastName());
            seekerProfile.setEmailContact(registerDto.getEmail());
            
            seekerProfileRepository.save(seekerProfile);
        } else if (userType.getUserTypeName().equalsIgnoreCase("company")) {
            if (registerDto.getCompanyName() == null || registerDto.getCompanyEmail() == null) {
                throw new RuntimeException("Tên công ty và email công ty là bắt buộc cho nhà tuyển dụng");
            }

            Company company = new Company();
            company.setRegisteredByUser(savedUserAccount);
            company.setCompanyName(registerDto.getCompanyName());
            company.setProfileDescription(registerDto.getProfileDescription());
            company.setEstablishmentDate(registerDto.getEstablishmentDate());
            company.setCompanyWebsiteUrl(registerDto.getCompanyWebsiteUrl());
            company.setCompanyEmail(registerDto.getCompanyEmail());
            company.setCompanyLogoUrl(registerDto.getCompanyLogoUrl());
            company.setAddress(registerDto.getAddress());
            company.setCompanySize(registerDto.getCompanySize());
            company.setIndustry(registerDto.getIndustry());
            company.setTaxCode(registerDto.getTaxCode());
            
            Company savedCompany = companyRepository.save(company);

            // Save company images if provided
            if (registerDto.getCompanyImages() != null && !registerDto.getCompanyImages().isEmpty()) {
                for (RegisterDto.CompanyImageDto imageDto : registerDto.getCompanyImages()) {
                    CompanyImage companyImage = new CompanyImage();
                    companyImage.setCompany(savedCompany);
                    companyImage.setImageUrl(imageDto.getImageUrl());
                    companyImage.setCaption(imageDto.getCaption());
                    companyImageRepository.save(companyImage);
                }
            }
        }

        return "Đăng ký thành công";
    }

    @Override
    public String sendOtp(String email) {
        UserAccount userAccount = userAccountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save OTP to database
        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setUsed(false);
        otpRepository.save(otpEntity);

        // Send OTP via email
        emailService.sendOtpEmail(email, otp);

        return "Mã OTP đã được gửi đến email của bạn";
    }

    @Override
    public String changePassword(ChangePasswordRequest request) {
        // Validate OTP
        OtpEntity otpEntity = otpRepository.findByEmailAndOtpAndUsedFalse(request.getEmail(), request.getOtp())
                .orElseThrow(() -> new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn"));

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã OTP đã hết hạn");
        }

        // Get user and update password
        UserAccount userAccount = userAccountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        userAccount.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userAccountRepository.save(userAccount);

        // Mark OTP as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        return "Đổi mật khẩu thành công";
    }
} 