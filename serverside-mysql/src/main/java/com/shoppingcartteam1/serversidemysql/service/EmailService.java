package com.shoppingcartteam1.serversidemysql.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppingcartteam1.serversidemysql.configuration.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;

@Service
public class EmailService {

	@Autowired
	private JwtConfig jwtConfig;

	public String getEmailFromToken(String token) {
		try {
			System.out.println(token);
			Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(jwtConfig.getSecretKey()).build()
					.parseClaimsJws(token);
			Claims claims = claimsJws.getBody();
			return claims.getSubject();
		} catch (Exception e) {
			return null;
		}
	}

	public String getEmail(String authHeader) {
		String[] headerParts = authHeader.split(" ");
		String jwtToken = headerParts[1];
		System.out.println(jwtToken);
		return getEmailFromToken(jwtToken);
	}

}
