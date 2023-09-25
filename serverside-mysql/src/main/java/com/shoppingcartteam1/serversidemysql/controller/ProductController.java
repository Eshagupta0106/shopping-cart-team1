package com.shoppingcartteam1.serversidemysql.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.shoppingcartteam1.serversidemysql.repository.ProductRepository;
import com.shoppingcartteam1.serversidemysql.service.ProductService;
import com.shoppingcartteam1.serversidemysql.table.Product;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


@RestController
@CrossOrigin(origins = "*")
public class ProductController {

	
	 private final ProductService productService;
	 private final ProductRepository productRepository;
	    @Autowired
	    public ProductController(ProductRepository productRepository , ProductService productService) {
	        this.productService = productService;
	        this.productRepository = productRepository;
	    }
	    @ResponseBody
	    @GetMapping("/products/all")
	    public List<Product> getAllProducts() {
	    	return productService.getAllProducts();
	    }	
	    
		@ResponseBody
		@GetMapping("/products/{id}")
		public ResponseEntity<Product> getProductbyId(@PathVariable int id) {
		    Optional<Product> productOptional = productService.getProductById(id);
		    if (productOptional.isPresent()) {
		        Product product = productOptional.get();
		        return ResponseEntity.ok(product);
		    } else {
		        return ResponseEntity.notFound().build();
		    }
		}
		@ResponseBody
	    @GetMapping("/products")
	    public ResponseEntity<List<Product>> filterProducts(
	            @RequestParam(value = "category", defaultValue = "{}",required = false) String categoryParam,
	            @RequestParam(value = "availability",defaultValue = "All") String availability,
	            @RequestParam(value = "minPrice", defaultValue = "0") Integer minPrice,
	            @RequestParam(value = "maxPrice", defaultValue = "5000") Integer maxPrice,
	            @RequestParam(value = "minRating", defaultValue = "0") Double minRating) {
	   	
	    	String[] categories = categoryParam.split(",");
	    	 if("{}".equals(categoryParam) && "All".equals(availability)&& minPrice==0 && maxPrice == 5000 && (minRating == null||minRating==0)) {
	        	 List<Product> allProducts = productService.getAllProducts();
	 	            return ResponseEntity.ok(allProducts);
	        }
	        if ("All".equals(availability)) {
	            List<Product> filterProducts = productRepository.findByCategoryInAndPriceBetweenAndRatingGreaterThanEqual(
	                Arrays.asList(categories),
	                minPrice,
	                maxPrice,
	                minRating != null ? minRating : 0.0
	            );
	            return ResponseEntity.ok(filterProducts);
	        } else {
	            List<Product> filterProducts = productRepository.findByCategoryInAndAvailabilityAndPriceBetweenAndRatingGreaterThanEqual(
	                Arrays.asList(categories),
	                availability,
	                minPrice,
	                maxPrice,
	                minRating != null ? minRating : 0.0
	            );
	            return ResponseEntity.ok(filterProducts);
	        }
	       
	    }

}