package com.shoppingcartteam1.serverside;




//import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.data.mongodb.repository.Query;


public interface ProductRepository extends MongoRepository<Product, Integer> {

   /* @Query(value = "{'category':{$exists : true}}")
    String[] distinctCategories()*/;
    
}
