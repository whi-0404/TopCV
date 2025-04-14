package com.TopCV.entity;
import com.TopCV.dto.AccountType;
import com.TopCV.dto.request.UserCreationRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private Long id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String phone;
    private String address;
    private String password;
    private AccountType accountType;

    public UserCreationRequest toDto()
    {
        return new UserCreationRequest(this.id,this.name,this.email,this.phone,this.address,this.password,this.accountType);
    }
}
