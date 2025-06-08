package com.TopCV.mapper;

import com.TopCV.dto.request.UserCreationRequest;
import com.TopCV.dto.request.UserUpdateRequest;
import com.TopCV.dto.response.UserDashboardResponse;
import com.TopCV.dto.response.UserResponse;
import com.TopCV.entity.User;
import com.TopCV.enums.Role;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-06T16:18:23+0700",
    comments = "version: 1.6.2, compiler: javac, environment: Java 23 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.password( request.getPassword() );
        user.email( request.getEmail() );
        user.fullname( request.getFullname() );
        if ( request.getRole() != null ) {
            user.role( Enum.valueOf( Role.class, request.getRole() ) );
        }

        return user.build();
    }

    @Override
    public UserResponse toResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.isEmailVerified( user.isEmailVerified() );
        userResponse.id( user.getId() );
        userResponse.userName( user.getUserName() );
        userResponse.email( user.getEmail() );
        userResponse.fullname( user.getFullname() );
        userResponse.phone( user.getPhone() );
        userResponse.address( user.getAddress() );
        userResponse.avt( user.getAvt() );
        userResponse.createdAt( user.getCreatedAt() );
        userResponse.updatedAt( user.getUpdatedAt() );
        userResponse.dob( user.getDob() );
        userResponse.role( user.getRole() );

        return userResponse.build();
    }

    @Override
    public void updateUser(User user, UserUpdateRequest request) {
        if ( request == null ) {
            return;
        }

        if ( request.getUserName() != null ) {
            user.setUserName( request.getUserName() );
        }
        if ( request.getPhone() != null ) {
            user.setPhone( request.getPhone() );
        }
        if ( request.getAddress() != null ) {
            user.setAddress( request.getAddress() );
        }
        if ( request.getAvt() != null ) {
            user.setAvt( request.getAvt() );
        }
        if ( request.getDob() != null ) {
            user.setDob( request.getDob() );
        }
    }

    @Override
    public UserDashboardResponse toDashBoardUser(User user) {
        if ( user == null ) {
            return null;
        }

        UserDashboardResponse.UserDashboardResponseBuilder userDashboardResponse = UserDashboardResponse.builder();

        userDashboardResponse.id( user.getId() );
        userDashboardResponse.fullname( user.getFullname() );
        userDashboardResponse.avt( user.getAvt() );
        userDashboardResponse.role( user.getRole() );

        return userDashboardResponse.build();
    }
}
