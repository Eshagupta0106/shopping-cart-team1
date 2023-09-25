package com.shoppingcartteam1.serversidemysql.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.shoppingcartteam1.serversidemysql.service.ProductService;
import com.shoppingcartteam1.serversidemysql.table.Product;

@RestController
@CrossOrigin(origins = "*")
public class SearchController {
	private final ProductService productService;
    @Autowired
    public SearchController(ProductService productService) {
        this.productService = productService;
    }
    @ResponseBody
    @GetMapping("/search")
    public List<Product> search(@RequestParam String query) {
        return productService.searchProducts(query);
    }
}
