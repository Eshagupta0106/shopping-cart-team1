package com.shoppingcartteam1.serverside;
import java.util.List;
import java.util.ArrayList;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Document(collection="carts")
public class Cart {
	@Id
	private ObjectId id;
	@DBRef
	private List<CartProduct> products;
	private int cartTotal;
	public ObjectId getId() {
		return id;
	}
	public void setId(ObjectId id) {
		this.id = id;
	}
	public List<CartProduct> getProducts() {
		return products;
	}
	public void setProducts(List<CartProduct> products) {
		this.products = products;
	}
	public int getCartTotal() {
		return cartTotal;
	}
	public void setCartTotal(int cartTotal) {
		this.cartTotal = cartTotal;
	}
}
