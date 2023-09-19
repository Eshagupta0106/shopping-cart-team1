package com.shoppingcartteam1.serverside.mongodbrepository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.shoppingcartteam1.serverside.mongodbcollection.CartProduct;
import org.bson.types.ObjectId;

public interface CartProductRepository extends MongoRepository<CartProduct, ObjectId> {
}
