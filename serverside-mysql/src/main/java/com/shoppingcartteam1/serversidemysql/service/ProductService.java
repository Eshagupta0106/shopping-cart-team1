package com.shoppingcartteam1.serversidemysql.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.shoppingcartteam1.serversidemysql.repository.ProductRepository;
import com.shoppingcartteam1.serversidemysql.table.Product;


@Service
public class ProductService {
@Autowired
private  ProductRepository productRepository;

public  List<Product> searchProducts(String query) {
	return productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query);
}

public List<Product> getAllProducts() {
    return productRepository.findAll();
}
public Optional<Product> getProductById(int id) {
    return productRepository.findById(id);
}
}
