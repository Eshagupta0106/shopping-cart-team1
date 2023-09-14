package com.shoppingcartteam1.serverside;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@Controller
public class RouteController {
    private final ProductRepository productRepository;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public RouteController(ProductRepository productRepository,
            MongoTemplate mongoTemplate) {
        this.productRepository = productRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @ResponseBody
    @GetMapping("/products/all")
    public List<Product> getProducts() {
        return productRepository.findAll();
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
            @RequestParam(value = "minRating", required = false) Double minRating) {

        String[] categories = categoryParam.split(",");

        Criteria availabilityCriteria;
        if ("All".equals(availability)) {
            availabilityCriteria = Criteria.where("availability").in("In Stock", "Out of Stock");
        } else {
            availabilityCriteria = Criteria.where("availability").is(availability);
        }

        Query query = new Query()
                .addCriteria(availabilityCriteria)
                .addCriteria(Criteria.where("price").gte(minPrice).lte(maxPrice));
       /*  if (categories.length == 0 && "All".equals(availability) && minPrice == 0 && maxPrice == 5000
                && minRating == 0) {
            System.out.println("Default filters working");
            List<Product> filterProducts = mongoTemplate.findAll(Product.class);
            System.out.println(filterProducts);
            return ResponseEntity.ok(filterProducts);
        }*/

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
