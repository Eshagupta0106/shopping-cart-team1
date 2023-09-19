package com.shoppingcartteam1.serverside.mongodbrepository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.shoppingcartteam1.serverside.mongodbcollection.Cart;

import org.bson.types.ObjectId;

public interface CartRepository extends MongoRepository<Cart, ObjectId> {
}
