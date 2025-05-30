package com.TopCV.repository;

import com.TopCV.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserName(String username);
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    Page<User> findByActiveTrue(Pageable pageable);


    @Modifying
    @Query("UPDATE User u SET u.password = :password, u.updatedAt = :updatedAt WHERE u.email = :email")
    void updatePasswordByEmail(@Param("email") String email,
                               @Param("password") String password,
                               @Param("updatedAt") LocalDateTime updatedAt);

    @Modifying
    @Query("UPDATE User u SET u.active = false, u.updatedAt = :updatedAt WHERE u.id = :userId")
    void deactivateUser(@Param("userId") String userId, @Param("updatedAt") LocalDateTime updatedAt);
}
