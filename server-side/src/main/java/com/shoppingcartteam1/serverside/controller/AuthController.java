package com.shoppingcartteam1.serverside.controller;

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
import com.shoppingcartteam1.serverside.entity.JwtRequest;
import com.shoppingcartteam1.serverside.entity.JwtResponse;
import com.shoppingcartteam1.serverside.mongodbcollection.Cart;
import com.shoppingcartteam1.serverside.mongodbcollection.CartProduct;
import com.shoppingcartteam1.serverside.mongodbcollection.User;
import com.shoppingcartteam1.serverside.mongodbrepository.CartRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.UserRepository;
import com.shoppingcartteam1.serverside.security.JwtHelperCls;

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
		JwtResponse response = new JwtResponse();
		response.setJwttoken(token);
		response.setEmail(userDetails.getUsername());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/signUp")
	public ResponseEntity<JwtResponse> createUser(@RequestBody User user) {
		Cart cart = new Cart();
		List<CartProduct> cartProducts = new ArrayList<CartProduct>();
		cart.setProducts(cartProducts);
		cart.setCartTotal(0);
		cart = cartRepository.save(cart);
		user.setCart(cart);
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		user = userRepository.save(user);
		String jwtToken = helper.generateToken(user.getEmail());
		JwtResponse response = new JwtResponse();
		response.setJwttoken(jwtToken);
		response.setEmail(user.getUsername());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/getUser")
	public User getUser(@RequestParam("email") String email) {
		return userRepository.findUser(email);
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
