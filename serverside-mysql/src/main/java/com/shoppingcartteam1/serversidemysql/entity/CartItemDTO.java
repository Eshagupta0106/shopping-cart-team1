package com.shoppingcartteam1.serversidemysql.entity;

import com.shoppingcartteam1.serversidemysql.table.Product;

public class CartItemDTO {
	private Product product;
	private int quantity;
	public CartItemDTO(Product product, int quantity) {
		super();
		this.product = product;
		this.quantity = quantity;
	}
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
