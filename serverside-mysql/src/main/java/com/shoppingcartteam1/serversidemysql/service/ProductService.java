package com.shoppingcartteam1.serversidemysql.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppingcartteam1.serversidemysql.repository.ProductRepository;
import com.shoppingcartteam1.serversidemysql.table.Product;

@Service
public class ProductService {
	@Autowired
	private ProductRepository productRepository;

	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	public Optional<Product> getProductById(int id) {
		return productRepository.findById(id);
	}

	public List<Product> searchProducts(String searchText) {
		List<Product> results = new ArrayList<>();
		String[] searchTerms = searchText.toLowerCase().split("\\s+");
		Set<Product> productSet = new HashSet<>();
		for (String term : searchTerms) {
			if (term.endsWith("s")) {
				term = term.substring(0, term.length() - 1);
			}
			List<Product> termResults = productRepository.searchByCategory(term);
			productSet.addAll(termResults);
		}
		results.addAll(productSet);
		return results;
	}
}
