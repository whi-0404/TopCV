package com.TopCV.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.TopCV.entity.User;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, Long> {
    public Optional<User> findByEmail(String email);
}
