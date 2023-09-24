package com.shoppingcartteam1.serversidemysql.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppingcartteam1.serversidemysql.table.CartItem;
public interface CartItemRepository extends JpaRepository<CartItem, Integer>{

}
