package com.shoppingcartteam1.serverside.entity;

import com.shoppingcartteam1.serverside.mongodbcollection.Product;

public class CartProductDTO {
	private Product product;
	private int quantity;

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

}
