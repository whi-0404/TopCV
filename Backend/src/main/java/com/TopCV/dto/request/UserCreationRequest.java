package com.TopCV.dto.request;

import com.TopCV.dto.AccountType;
import com.TopCV.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationRequest {
    private Long id;
    @NotBlank(message = "Name cannot be blank")

    private String name;
    @NotBlank(message = "Email cannot be blank")
    @Pattern(
            regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Invalid email format"
    )
    private String email;

    private String phone;
    private String address;
    @NotBlank(message = "Password cannot be blank")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{7,15}$",
            message = "Password must be 7-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    private String password;
    private AccountType accountType;

    public User toEntity()
    {
        return new User(this.id,this.name,this.email,this.phone,this.address,this.password,this.accountType);
    }
}
