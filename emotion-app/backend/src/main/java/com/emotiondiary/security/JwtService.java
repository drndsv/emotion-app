package com.emotiondiary.security;
import io.jsonwebtoken.*;import io.jsonwebtoken.security.Keys;import org.springframework.beans.factory.annotation.Value;import org.springframework.stereotype.Service;import javax.crypto.SecretKey;import java.nio.charset.StandardCharsets;import java.util.*;
@Service public class JwtService { @Value("${app.jwt-secret}") String secret; @Value("${app.jwt-expiration-ms}") long exp; private SecretKey key(){return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));}
public String generate(Long userId,String email){return Jwts.builder().subject(String.valueOf(userId)).claim("email",email).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+exp)).signWith(key()).compact();}
public Claims parse(String token){return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();}}
