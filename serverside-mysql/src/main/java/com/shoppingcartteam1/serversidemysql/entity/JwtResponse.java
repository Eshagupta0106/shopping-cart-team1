package com.shoppingcartteam1.serversidemysql.entity;

public class JwtResponse {
	private String jwttoken;
	private String email;

	public JwtResponse() {
		super();
	}

	@Override
	public String toString() {
		return "JwtResponse [jwttoken=" + jwttoken + ", email=" + email + "]";
	}

	public String getJwttoken() {
		return jwttoken;
	}

	public void setJwttoken(String jwttoken) {
		this.jwttoken = jwttoken;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}