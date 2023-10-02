package com.shoppingcartteam1.serversidemysql.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shoppingcartteam1.serversidemysql.repository.ProductImageRepository;
import com.shoppingcartteam1.serversidemysql.repository.ProductRepository;
import com.shoppingcartteam1.serversidemysql.service.CloudinaryImageService;
import com.shoppingcartteam1.serversidemysql.service.ProductService;
import com.shoppingcartteam1.serversidemysql.table.Product;
import com.shoppingcartteam1.serversidemysql.table.ProductImage;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RestController
@CrossOrigin(origins = "*")
public class ProductController {

	private final ProductService productService;
	private final ProductRepository productRepository;
	
	@Autowired
	CloudinaryImageService cloudinaryImageService;
	
	@Autowired
	ProductImageRepository productImageRepository;

	@Autowired
	public ProductController(ProductRepository productRepository, ProductService productService) {
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
			@RequestParam(value = "category", defaultValue = "{}", required = false) String categoryParam,
			@RequestParam(value = "availability", defaultValue = "All") String availability,
			@RequestParam(value = "minPrice", defaultValue = "0") Integer minPrice,
			@RequestParam(value = "maxPrice", defaultValue = "5000") Integer maxPrice,
			@RequestParam(value = "minRating", defaultValue = "0") Double minRating) {

		String[] categories = categoryParam.split(",");
		if ("{}".equals(categoryParam) && "All".equals(availability) && minPrice == 0 && maxPrice == 5000
				&& (minRating == null || minRating == 0)) {
			List<Product> allProducts = productService.getAllProducts();
			return ResponseEntity.ok(allProducts);
		}
		if ("All".equals(availability)) {
			List<Product> filterProducts = productRepository.findByCategoryInAndPriceBetweenAndRatingGreaterThanEqual(
					Arrays.asList(categories), minPrice, maxPrice, minRating != null ? minRating : 0.0);
			return ResponseEntity.ok(filterProducts);
		} else {
			List<Product> filterProducts = productRepository
					.findByCategoryInAndAvailabilityAndPriceBetweenAndRatingGreaterThanEqual(Arrays.asList(categories),
							availability, minPrice, maxPrice, minRating != null ? minRating : 0.0);
			return ResponseEntity.ok(filterProducts);
		}

	}

	@PostMapping("/admin/add")
	public ResponseEntity<?> addProduct(@RequestParam("image") MultipartFile[] images,
			@RequestParam("name") String name, @RequestParam("category") String category,
			@RequestParam("price") int price, @RequestParam("availability") String availability,
			@RequestParam("rating") double rating, @RequestParam("description") String description) throws IOException {

		Product product = new Product();
		product.setName(name);
		product.setCategory(category);
		product.setPrice(price);
		product.setAvailability(availability);
		product.setRating(rating);
		product.setDescription(description);

		
		  List<ProductImage> productImages = new ArrayList<>();
		    for (MultipartFile image : images) {
		        if (!image.isEmpty()) {
		            String imageUrl = cloudinaryImageService.upload(image);
		            ProductImage productImage = new ProductImage(imageUrl, product);
		            productImages.add(productImage);
		        }
		    }
		    product.setImage(productImages);
		    Product savedProduct = productRepository.save(product);


		return new ResponseEntity<>(savedProduct,HttpStatus.OK );
	}

	
	@PostMapping("/admin/update-product/{id}")
	@Transactional
	public ResponseEntity<?> updateProduct(
	    @PathVariable int id,
	    @RequestParam(value = "image", required = false) MultipartFile[] images,
	    @RequestParam("name") String name,
	    @RequestParam("category") String category,
	    @RequestParam("price") int price,
	    @RequestParam("availability") String availability,
	    @RequestParam("rating") double rating,
	    @RequestParam("description") String description) throws IOException {

		  Optional<Product> existingProductOptional = productRepository.findById(id);

		    if (existingProductOptional.isPresent()) {
		        Product existingProduct = existingProductOptional.get();

		        existingProduct.setName(name);
		        existingProduct.setCategory(category);
		        existingProduct.setPrice(price);
		        existingProduct.setAvailability(availability);
		        existingProduct.setRating(rating);
		        existingProduct.setDescription(description);

		        if (images != null && images.length > 0) {
		            productImageRepository.deleteByProduct(existingProduct);

		            List<ProductImage> productImages = new ArrayList<>();
		            for (MultipartFile image : images) {
		                if (!image.isEmpty()) {
		                    String imageUrl = cloudinaryImageService.upload(image);
		                    ProductImage productImage = new ProductImage(imageUrl, existingProduct);
		                    productImages.add(productImage);
		                }
		            }
		            existingProduct.setImage(productImages);
		        }

		        Product updatedProduct = productRepository.save(existingProduct);

		        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
	    }
	}
	
	@DeleteMapping("/admin/delete/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable int id) {
	    Optional<Product> productOptional = productRepository.findById(id);

	    if (productOptional.isPresent()) {
	        Product product = productOptional.get();
	        productRepository.delete(product);
	        return ResponseEntity.ok("Product deleted successfully.");
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
	    }
	}
}