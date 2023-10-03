package com.shoppingcartteam1.serversidemysql.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shoppingcartteam1.serversidemysql.entity.JwtRequest;
import com.shoppingcartteam1.serversidemysql.entity.JwtResponse;
import com.shoppingcartteam1.serversidemysql.security.JwtHelperCls;
import com.shoppingcartteam1.serversidemysql.table.Cart;
import com.shoppingcartteam1.serversidemysql.table.CartItem;
import com.shoppingcartteam1.serversidemysql.table.User;
import com.shoppingcartteam1.serversidemysql.repository.CartRepository;
import com.shoppingcartteam1.serversidemysql.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collection;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private AuthenticationManager manager;

	@Autowired
	private JwtHelperCls helper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private CartRepository cartRepository;

	@PostMapping("/logIn")
	public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {
		this.doAuthenticate(request.getEmail(), request.getPassword());
		UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
		String token = this.helper.generateToken(userDetails.getUsername());
		Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
		JwtResponse response = new JwtResponse();
		response.setJwttoken(token);
		response.setEmail(userDetails.getUsername());
		SimpleGrantedAuthority adminAuthority = new SimpleGrantedAuthority("ROLE_ADMIN");
		if (authorities.contains(adminAuthority)) {
			response.setRole("ADMIN");
			}
		else {
			response.setRole("USER");
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/signUp")
	public ResponseEntity<JwtResponse> createUser(@RequestBody User user) {
		if (user.getRole() == null || user.getRole().isEmpty() || user.getRole().equals(null)) {
	        user.setRole("USER");
	    }
		List<User> users=userRepository.findAll();
		if (users.size()==0) {
			user.setRole("ADMIN");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		userRepository.save(user);
		Cart cart = new Cart();
		List<CartItem> cartItems = new ArrayList<>();
		cart.setCartItems(cartItems);
		cart.setUser(user);
		cartRepository.save(cart);
		String jwtToken = helper.generateToken(user.getEmail());
		JwtResponse response = new JwtResponse();
		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		response.setJwttoken(jwtToken);
		response.setEmail(user.getUsername());
		Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
		SimpleGrantedAuthority adminAuthority = new SimpleGrantedAuthority("ROLE_ADMIN");
		if (authorities.contains(adminAuthority)) {
			response.setRole("ADMIN");
			}
		else {
			response.setRole("USER");
		}
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/getUser")
	public String getUser(@RequestParam("email") String email) {
		if (userRepository.findByEmail(email) != null) {
			return "Found";
		} else {
			return "Not Found";
		}
	}

	private void doAuthenticate(String email, String password) {

		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
		try {
			manager.authenticate(authentication);
		} catch (BadCredentialsException e) {
			throw new BadCredentialsException(" Invalid Username or Password  !!");
		}
	}

	@ExceptionHandler(BadCredentialsException.class)
	public String exceptionHandler() {
		return "Credentials Invalid !!";
	}
}
