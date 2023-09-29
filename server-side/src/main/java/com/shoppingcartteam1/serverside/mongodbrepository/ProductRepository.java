package com.shoppingcartteam1.serverside.mongodbrepository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.shoppingcartteam1.serverside.mongodbcollection.Product;


public interface ProductRepository extends MongoRepository<Product, String> {

}
