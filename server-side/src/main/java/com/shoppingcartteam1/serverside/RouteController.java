package com.shoppingcartteam1.serverside;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5000")
public class RouteController {
	private final UserRepository userRepository;
	private final CartRepository cartRepository;
	private final ProductRepository productRepository;
	private final CartProductRepository cartProductRepository;

	@Autowired
	public RouteController(UserRepository userRepository, CartRepository cartRepository,ProductRepository productRepository,CartProductRepository cartProductRepository) {
		this.userRepository = userRepository;
		this.cartRepository = cartRepository;
		this.productRepository = productRepository;
		this.cartProductRepository = cartProductRepository;
	}

	@ResponseBody
	@PostMapping("/createUser")
	public ResponseEntity<String> createUser(@RequestBody User user) {
		try {
			Cart cart = new Cart();
			List<CartProduct> cartProducts = new ArrayList<CartProduct>();
			cart.setProducts(cartProducts);
			cart.setCartTotal(0);
			cart = cartRepository.save(cart);
			user.setCart(cart);
			user = userRepository.save(user);
			return ResponseEntity.ok("Created user successfully..!");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to create user: " + e.getMessage());
		}
	}

	@ResponseBody
	@GetMapping("/getUser")
	public User getUser(@RequestParam("email") String email) {
		return userRepository.findUser(email);
	}
}
