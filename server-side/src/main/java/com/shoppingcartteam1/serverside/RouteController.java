package com.shoppingcartteam1.serverside;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;

@RestController
@CrossOrigin(origins = "http://localhost:5000")
public class RouteController {
	private final UserRepository userRepository;
	private final CartRepository cartRepository;
	private final ProductRepository productRepository;
	private final CartProductRepository cartProductRepository;
	private final MongoTemplate mongoTemplate;
	private final ProductService productService;

	@Autowired
	public RouteController(UserRepository userRepository, CartRepository cartRepository,
			ProductRepository productRepository, CartProductRepository cartProductRepository,
			MongoTemplate mongoTemplate, ProductService productService) {
		this.userRepository = userRepository;
		this.cartRepository = cartRepository;
		this.productRepository = productRepository;
		this.cartProductRepository = cartProductRepository;
		this.mongoTemplate = mongoTemplate;
		this.productService = productService;

	}

	@ResponseBody
	@PostMapping("/createUser")
	public ResponseEntity<String> createUser(@RequestBody User user, HttpServletResponse response) {
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

	@ResponseBody
	@GetMapping("/products/all")
	public List<Product> getProducts() {
		return productRepository.findAll();
	}

	@ResponseBody
	@GetMapping("/search")
	public ResponseEntity<List<Product>> searchProducts(@RequestParam("query") String query) {

		List<Product> products = productService.searchProducts(query);

		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	@ResponseBody
	@GetMapping("/products/{id}")
	public Product getProductbyId(@PathVariable int id) {
		return productRepository.findById(id).orElse(null);
	}

	@ResponseBody
	@GetMapping("/products")
	public ResponseEntity<List<Product>> filterProducts(
			@RequestParam(value = "category", defaultValue = "{}", required = false) String categoryParam,
			@RequestParam(value = "availability", defaultValue = "All") String availability,
			@RequestParam(value = "minPrice", defaultValue = "0") Integer minPrice,
			@RequestParam(value = "maxPrice", defaultValue = "5000") Integer maxPrice,
			@RequestParam(value = "minRating", defaultValue = "0", required = false) Double minRating) {

		String[] categories = categoryParam.split(",");

		Criteria availabilityCriteria;
		if ("All".equals(availability)) {
			availabilityCriteria = Criteria.where("availability").in("In Stock", "Out of Stock");
		} else {
			availabilityCriteria = Criteria.where("availability").is(availability);
		}

		Query query = new Query().addCriteria(availabilityCriteria)
				.addCriteria(Criteria.where("price").gte(minPrice).lte(maxPrice));

		if ("{}".equals(categoryParam) && "All".equals(availability) && minPrice == 0 && maxPrice == 5000
				&& minRating == 0) {
			System.out.println("Default filters working");
			List<Product> filterProducts = mongoTemplate.findAll(Product.class);
			System.out.println(filterProducts);
			return ResponseEntity.ok(filterProducts);
		}

		if (categories.length > 0) {

			Criteria categoryCriteria = Criteria.where("category").in((Object[]) categories);
			query.addCriteria(categoryCriteria);
		}

		if (minRating != null) {
			query.addCriteria(Criteria.where("rating").gte(minRating));
		}

		List<Product> filterProducts = mongoTemplate.find(query, Product.class);

		System.out.println(query);

		for (Product product : filterProducts) {
			System.out.println(product);
		}
		return ResponseEntity.ok(filterProducts);

	}
}
