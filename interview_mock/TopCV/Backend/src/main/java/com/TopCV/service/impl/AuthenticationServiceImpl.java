package com.TopCV.service.impl;

import com.TopCV.dto.request.AuthenticationRequest;
import com.TopCV.dto.request.ForgotPasswordRequest;
import com.TopCV.dto.request.IntrospectRequest;
import com.TopCV.dto.request.ResetPasswordRequest;
import com.TopCV.dto.response.AuthenticationResponse;
import com.TopCV.dto.response.IntrospectResponse;
import com.TopCV.entity.InvalidatedToken;
import com.TopCV.entity.User;
import com.TopCV.enums.OtpType;
import com.TopCV.exception.AppException;
import com.TopCV.exception.ErrorCode;
import com.TopCV.repository.InvalidatedTokenRepository;
import com.TopCV.repository.UserRepository;
import com.TopCV.service.AuthenticationService;
import com.TopCV.service.redis.UserRedisService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    OtpServiceImpl otpService;
    private final UserRedisService userRedisService;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    protected static final int ACCESS_TOKEN_MINUTES = 600; // 15 minutes - stored in memory
    protected static final int REFRESH_TOKEN_DAYS = 7; // 7 days - stored in HTTP-only cookie
    protected static final int MAX_AGE_RT_COOKIE = REFRESH_TOKEN_DAYS * 24 * 60 * 60;

//    @NonFinal
//    @Value("${outbound.identity.client-id}")
//    protected String CLIENT_ID;
//
//    @NonFinal
//    @Value("${outbound.identity.client-secret}")
//    protected String CLIENT_SECRET;
//
//    @NonFinal
//    @Value("${outbound.identity.redirect-uri}")
//    protected String REDIRECT_URI;
//
//    @NonFinal
//    protected String GRANT_TYPE = "authorization_code";

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_DEACTIVATED);
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (!user.isEmailVerified()) {
            throw new AppException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        var accessToken = generateAccessToken(user);
        var refreshToken = generateRefreshToken(user);

        setRefreshTokenCookie(refreshToken, response);

        return AuthenticationResponse.builder()
                .token(accessToken)
                .build();
    }

    public AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
    try {
        // Get refresh token from HTTP-only cookie
        String refreshToken = getRefreshTokenFromCookie(request);
        if (refreshToken == null) {
            log.warn("Refresh token not found in cookie");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var signedJWT = verifyToken(refreshToken);
        var tokenId = signedJWT.getJWTClaimsSet().getJWTID();
        var email = signedJWT.getJWTClaimsSet().getSubject();

        // Add old refresh token to blacklist
        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(tokenId)
                .expiryTime(signedJWT.getJWTClaimsSet().getExpirationTime())
                .build();

        invalidatedTokenRepository.save(invalidatedToken);

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_DEACTIVATED);
        }

        // Generate new tokens
        var newAccessToken = generateAccessToken(user);
        var newRefreshToken = generateRefreshToken(user);

        // Set new refresh token in HTTP-only cookie
        setRefreshTokenCookie(newRefreshToken, response);

        // Return new access token in response body
        return AuthenticationResponse.builder()
                .token(newAccessToken) // Client will update this in memory
                .build();
    }
    catch (Exception e){
        throw new AppException(ErrorCode.UNAUTHENTICATED, e);
    }
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Invalidate access token if present
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    var signToken = SignedJWT.parse(authHeader.substring(7));
                    String jit = signToken.getJWTClaimsSet().getJWTID();
                    Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

                    InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                            .id(jit)
                            .expiryTime(expiryTime)
                            .build();
                    invalidatedTokenRepository.save(invalidatedToken);
                } catch (Exception e) {
                    log.warn("Error invalidating access token during logout", e);
                }
            }

            String refreshToken = getRefreshTokenFromCookie(request);
            if (refreshToken != null) {

                var refreshJWT = SignedJWT.parse(refreshToken);
                String tokenId = refreshJWT.getJWTClaimsSet().getJWTID();

                // add to blacklist
                InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                        .id(tokenId)
                        .expiryTime(refreshJWT.getJWTClaimsSet().getExpirationTime())
                        .build();
                invalidatedTokenRepository.save(invalidatedToken);

            }

            // Clear refresh token cookie
            clearRefreshTokenCookie(response);
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED, e);
        }
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        // Check if user exists
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if user is active
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_DEACTIVATED);
        }

        // Generate and send OTP for password reset
        otpService.generateAndSendOtp(request.getEmail(), OtpType.PASSWORD_RESET);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp());

        // Find user
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if user is active
        if (!user.isActive()) {
            throw new AppException(ErrorCode.USER_DEACTIVATED);
        }

        // Update password
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());

        userRepository.updatePasswordByEmail(request.getEmail(), encodedPassword, LocalDateTime.now());
    }

    private SignedJWT verifyToken(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();


            if (!expiryTime.after(new Date())) {
                throw new AppException(ErrorCode.EXPIRED_TOKEN);
            }

            if (!signedJWT.verify(verifier)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            return signedJWT;
        }
        catch (AppException e){
            throw e;
        }
        catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED, e);
        }
    }

    public IntrospectResponse introspect(IntrospectRequest request){
        var token = request.getToken();
        ErrorCode errorCode = null;
        boolean isvalid = true;
        try {
            verifyToken(token);
        } catch (AppException e) {
            isvalid = false;
            errorCode = e.getErrorCode();
        }

        return IntrospectResponse.builder()
                .valid(isvalid)
                .errorCode(errorCode)
                .build();
    }

    private String generateAccessToken(User user) {
        // header of token
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        // payload of token
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("TopCV.com")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(Duration.ofMinutes(ACCESS_TOKEN_MINUTES))))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("type", "access")
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create access token", e);
            throw new RuntimeException(e);
        }
    }

    private String generateRefreshToken(User user) {
        // header of token
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        // payload of token
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("TopCV.com")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(Duration.ofDays(REFRESH_TOKEN_DAYS))))
                .jwtID(UUID.randomUUID().toString())
                .claim("type", "refresh")
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create refresh token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (user.getRole() != null) {
            stringJoiner.add(user.getRole().name());
        }
        return stringJoiner.toString();
    }

    private void setRefreshTokenCookie(String refreshToken, HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(MAX_AGE_RT_COOKIE);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "Strict"); // Prevent CSRF

        response.addCookie(cookie);
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    private String getRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refresh_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
