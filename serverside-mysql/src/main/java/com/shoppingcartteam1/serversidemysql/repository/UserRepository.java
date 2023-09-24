package com.shoppingcartteam1.serversidemysql.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppingcartteam1.serversidemysql.table.User;

public interface UserRepository extends JpaRepository<User, Integer>{
	<Optional>User findByEmail(String email);
}

