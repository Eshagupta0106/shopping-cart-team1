package com.shoppingcartteam1.serverside;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface UserRepository extends MongoRepository<User, Integer> {
	@Query(value = "{}", fields = "{ '_id': 1, 'firstName': 1,'lastName': 1, 'email': 1, 'password': 1 }")
    List<User> findAllWithIds();
}
