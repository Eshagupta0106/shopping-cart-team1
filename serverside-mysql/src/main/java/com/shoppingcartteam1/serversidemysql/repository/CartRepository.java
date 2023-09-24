package com.shoppingcartteam1.serversidemysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppingcartteam1.serversidemysql.table.Cart;

public interface CartRepository extends JpaRepository<Cart, Integer>{
}
