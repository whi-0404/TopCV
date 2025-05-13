package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    
    @NotEmpty(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;
    
    @NotEmpty(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;
    
    @NotNull(message = "Loại người dùng không được để trống")
    private Long userTypeId;
    
    private LocalDate dateOfBirth;
    
    private String gender;
    
    private String contactNumber;
    
    private String userImage;
    
    // Thông tin cho người tìm việc (job seeker)
    private String firstName;
    
    private String lastName;
    
    // Thông tin công ty (cho nhà tuyển dụng)
    private String companyName;
    private String profileDescription;
    private LocalDate establishmentDate;
    private String companyWebsiteUrl;
    private String companyEmail;
    private String companyLogoUrl;
    private String address;
    private String companySize;
    private String industry;
    private String taxCode;
    private List<CompanyImageDto> companyImages;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyImageDto {
        private String imageUrl;
        private String caption;
    }
} 