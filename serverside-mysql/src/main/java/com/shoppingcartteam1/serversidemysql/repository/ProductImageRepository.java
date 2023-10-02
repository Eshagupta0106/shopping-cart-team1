package com.shoppingcartteam1.serversidemysql.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppingcartteam1.serversidemysql.table.Product;
import com.shoppingcartteam1.serversidemysql.table.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
	
	 void deleteByProduct(Product product);

}
