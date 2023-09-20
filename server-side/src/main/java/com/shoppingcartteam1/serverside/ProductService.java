package com.shoppingcartteam1.serverside;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class ProductService {

    private final MongoTemplate mongoTemplate;

    @Autowired
    public ProductService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Product> searchProducts(String searchText) {

        /*
         * if (searchText.endsWith("s")) {
         * // Remove the "s" to get the singular form
         * searchText = searchText.substring(0, searchText.length() - 1);
         * }
         */
        Pattern categoryPattern = Pattern.compile("\\b" + searchText + "\\w*\\b", Pattern.CASE_INSENSITIVE);

        Criteria categoryCriteria = Criteria.where("category").regex(categoryPattern);

        Query categoryQuery = new Query(categoryCriteria);

        List<Product> categoryResults = mongoTemplate.find(categoryQuery, Product.class);

        TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matchingAny(searchText);

        Query textQuery = TextQuery.queryText(textCriteria);

        List<Product> textSearchResults = mongoTemplate.find(textQuery, Product.class);

        Set<Integer> productIds = new HashSet<>();
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
}
