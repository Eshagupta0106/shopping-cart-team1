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
public class AdminController {

	private final ProductService productService;
	private final ProductRepository productRepository;
	
	@Autowired
	CloudinaryImageService cloudinaryImageService;
	
	@Autowired
	ProductImageRepository productImageRepository;

	@Autowired
	public AdminController(ProductRepository productRepository, ProductService productService) {
		this.productService = productService;
		this.productRepository = productRepository;
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
	public void deleteProduct(@PathVariable int id) {
	    Optional<Product> productOptional = productRepository.findById(id);
	    if (productOptional.isPresent()) {
	        Product product = productOptional.get();
	        productRepository.deleteById(product.getId());
	    } 
	}
}