package com.shoppingcartteam1.serverside;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.shoppingcartteam1.serverside.User;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
//	@Query(value = "{}", fields = "{ '_id': 1, 'firstName': 1,'lastName': 1, 'email': 1, 'password': 1 }")
//    List<User> findAllWithIds();

	@Query(value = "{'email': ?0}", fields = "{'firstName': 1,'lastName': 1, 'email': 1, 'password': 1}")
	User findUser(String email);
	
	@Query(value = "{'email': ?0}", fields = "{ 'email': 1, 'cart' : 1}")
	User findUserCart(String email);
}
