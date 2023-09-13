package com.shoppingcartteam1.serverside;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.shoppingcartteam1.serverside.Product;


public interface ProductRepository extends MongoRepository<Product, Integer> {

}
