package com.shoppingcartteam1.serversidemysql.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConfig {
	@Value("${jwt.secretKey}")
	private String secretKey;

	public String getSecretKey() {
		return secretKey;
	}
}
