package com.emotiondiary.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  @Value("${app.jwt-secret}")
  String secret;

  @Value("${app.jwt-expiration-ms}")
  long expiration;

  private SecretKey key() {
    return Keys.hmacShaKeyFor(
      secret.getBytes(StandardCharsets.UTF_8)
    );
  }

  public String generate(Long userId, String email) {
    return Jwts.builder()
      .subject(String.valueOf(userId))
      .claim("email", email)
      .issuedAt(new Date())
      .expiration(
        new Date(System.currentTimeMillis() + expiration)
      )
      .signWith(key())
      .compact();
  }

  public Claims parse(String token) {
    return Jwts.parser()
      .verifyWith(key())
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }
}
