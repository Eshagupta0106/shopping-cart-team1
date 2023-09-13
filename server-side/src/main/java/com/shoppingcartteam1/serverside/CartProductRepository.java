package com.shoppingcartteam1.serverside;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.shoppingcartteam1.serverside.CartProduct;
import org.bson.types.ObjectId;

public interface CartProductRepository extends MongoRepository<CartProduct, ObjectId> {
}
