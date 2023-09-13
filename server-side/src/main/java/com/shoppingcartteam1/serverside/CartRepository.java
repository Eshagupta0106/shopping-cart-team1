package com.shoppingcartteam1.serverside;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.shoppingcartteam1.serverside.Cart;
import org.bson.types.ObjectId;

public interface CartRepository extends MongoRepository<Cart, ObjectId> {
}
