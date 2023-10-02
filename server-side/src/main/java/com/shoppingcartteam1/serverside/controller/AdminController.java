package com.shoppingcartteam1.serverside.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shoppingcartteam1.serverside.mongodbcollection.Product;
import com.shoppingcartteam1.serverside.mongodbrepository.CartProductRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.ProductRepository;
import com.shoppingcartteam1.serverside.service.CloudinaryImageService;
import com.shoppingcartteam1.serverside.service.ProductService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.web.bind.annotation.RequestHeader;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Collection;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class AdminController {
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	CloudinaryImageService cloudinaryImageService;

	private final ProductService productService;

	@Autowired
	public AdminController(ProductService productService) {
		this.productService = productService;
	}

	@PostMapping(value = "admin/add")
	public ResponseEntity<?> addProduct(@RequestParam("image") MultipartFile[] images,
			@RequestParam("name") String name, @RequestParam("category") String category,
			@RequestParam("price") int price, @RequestParam("availability") String availability,
			@RequestParam("rating") double rating, @RequestParam("description") String description,@RequestHeader("Authorization") String authorizationHeader) throws IOException {
		List<String> imageList = new ArrayList<>();
		for (MultipartFile image : images) {
			if (!image.isEmpty()) {
				String data = cloudinaryImageService.upload(image);
				imageList.add(data);
			}
		}

		Product product = new Product();
		product.setName(name);
		product.setCategory(category);
		product.setPrice(price);
		product.setAvailability(availability);
		product.setRating(rating);
		product.setImage(imageList.toArray(new String[0]));
		product.setDescription(description);
		productRepository.save(product);

		return new ResponseEntity<>(product, HttpStatus.OK);

	}

	@PostMapping("admin/update-product/{id}")
	public ResponseEntity<?> updateProduct(@RequestParam(value = "image", required = false) MultipartFile[] images,
			@RequestParam("name") String name, @RequestParam("category") String category,
			@RequestParam("price") int price, @RequestParam("availability") String availability,
			@RequestParam("rating") double rating, @RequestParam("description") String description,@PathVariable("id") String id) throws IOException {
		System.out.println(name);
		System.out.println(id);
	    Optional<Product> existingProduct = productRepository.findById(id);

	    if (existingProduct.isPresent()) {
	        Product productToUpdate = existingProduct.get();
	      

			productToUpdate.setName(name);
			productToUpdate.setCategory(category);
			productToUpdate.setPrice(price);
			productToUpdate.setAvailability(availability);
			productToUpdate.setRating(rating);
			productToUpdate.setDescription(description);
			
			if (images != null && images.length > 0) {
				List<String> imageList = new ArrayList<>();
	            for (MultipartFile image : images) {
	                if (!image.isEmpty()) {
	                    String imageUrl = cloudinaryImageService.upload(image);
	                    imageList.add(imageUrl);
	                }
	            }
	           productToUpdate.setImage(imageList.toArray(new String[0]));
	        }

	        productRepository.save(productToUpdate);

	        return new ResponseEntity<>(productToUpdate, HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
	    }
	}
	
	
	@DeleteMapping("admin/delete/{id}")
	public void deleteHotel(@PathVariable String id, @RequestHeader("Authorization") String authorizationHeader) {
		Optional<Product> product = productService.findById(id);
		Product products = product.get();
		productRepository.deleteById(products.getId());
	}
	
	
}