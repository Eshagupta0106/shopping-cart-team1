package com.shoppingcartteam1.serverside;
import org.springframework.data.mongodb.repository.MongoRepository;



public interface ProductRepository extends MongoRepository<Product, Integer> {


}
