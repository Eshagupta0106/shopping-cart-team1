package com.shoppingcartteam1.serversidemysql.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.Param;

import com.shoppingcartteam1.serversidemysql.table.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

	List<Product> findByCategoryInAndAvailabilityAndPriceBetweenAndRatingGreaterThanEqual(List<String> categories,
			String availability, Integer minPrice, Integer maxPrice, Double minRating);

	List<Product> findByCategoryInAndPriceBetweenAndRatingGreaterThanEqual(List<String> categories, Integer minPrice,
			Integer maxPrice, Double minRating);

	@Query("SELECT p FROM Product p WHERE LOWER(p.category) LIKE %:searchTerm%")
	List<Product> searchByCategory(@Param("searchTerm") String searchTerm);
}
