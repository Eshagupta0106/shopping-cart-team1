package com.shoppingcartteam1.serverside.controller;

import org.springframework.web.bind.annotation.RestController;
import com.shoppingcartteam1.serverside.mongodbcollection.Product;
import com.shoppingcartteam1.serverside.mongodbrepository.CartProductRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.CartRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.ProductRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.UserRepository;
import com.shoppingcartteam1.serverside.service.ProductService;
import com.shoppingcartteam1.serverside.service.ProductService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class RouteController {
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	CartProductRepository cartProductRepository;
	
    private final MongoTemplate mongoTemplate;
	private final ProductService productService;

    @Autowired
    public RouteController(MongoTemplate mongoTemplate,ProductService productService) {
        this.mongoTemplate = mongoTemplate;
		this.productService = productService;
    }

	@GetMapping(value = { "/", "/{path:[^\\.]*}" })
	public String redirectToAngularRoute() {
		return "index";
	}

	@RequestMapping(value = { "/cart/**" })
	public String forward() {
		return "index";
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
			List<Product> filterProducts = mongoTemplate.findAll(Product.class);
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

		return ResponseEntity.ok(filterProducts);

	}
}