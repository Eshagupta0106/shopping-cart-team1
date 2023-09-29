package com.shoppingcartteam1.serverside.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.stereotype.Service;

import com.shoppingcartteam1.serverside.mongodbcollection.Product;
import com.shoppingcartteam1.serverside.mongodbrepository.ProductRepository;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class ProductService {

	private final MongoTemplate mongoTemplate;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	public ProductService(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	public List<Product> searchProducts(String searchText) {
		Pattern categoryPattern = Pattern.compile("\\b" + searchText + "\\w*\\b", Pattern.CASE_INSENSITIVE);

		Criteria categoryCriteria = Criteria.where("category").regex(categoryPattern);

		Query categoryQuery = new Query(categoryCriteria);
		List<Product> categoryResults = mongoTemplate.find(categoryQuery, Product.class);

		TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matchingAny(searchText);

		Query textQuery = TextQuery.queryText(textCriteria);

		List<Product> textSearchResults = mongoTemplate.find(textQuery, Product.class);

		Set<String> productIds = new HashSet<>();
		List<Product> combinedResults = new ArrayList<>();

		for (Product product : categoryResults) {
			if (productIds.add(product.getId())) {
				combinedResults.add(product);
			}
		}

		for (Product product : textSearchResults) {
			if (productIds.add(product.getId())) {
				combinedResults.add(product);
			}
		}

		return combinedResults;

	}

	public Optional<Product> findById(String id) {

		return productRepository.findById(id);
	}

}
