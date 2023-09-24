package com.shoppingcartteam1.serversidemysql.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shoppingcartteam1.serversidemysql.entity.CartItemDTO;
import com.shoppingcartteam1.serversidemysql.table.Cart;
import com.shoppingcartteam1.serversidemysql.table.CartItem;
import com.shoppingcartteam1.serversidemysql.table.Product;
import com.shoppingcartteam1.serversidemysql.table.User;
import com.shoppingcartteam1.serversidemysql.repository.CartItemRepository;
import com.shoppingcartteam1.serversidemysql.repository.CartRepository;
import com.shoppingcartteam1.serversidemysql.repository.ProductRepository;
import com.shoppingcartteam1.serversidemysql.repository.UserRepository;
import com.shoppingcartteam1.serversidemysql.service.EmailService;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private CartItemRepository cartItemRepository;
	@Autowired
	private EmailService emailService;

	@GetMapping("/getCart")
	public ResponseEntity<List<CartItemDTO>> getCart(@RequestHeader("Authorization") String authorizationHeader) {
		List<CartItemDTO> products = new ArrayList<>();
		try {
			String currentUser = emailService.getEmail(authorizationHeader);
			User user = userRepository.findByEmail(currentUser);
			if (user != null) {
				List<CartItem> cart = user.getCart().getCartItems();
				if (cart != null && cart.size() > 0) {
					for (CartItem cartProduct : cart) {
						CartItemDTO cartItemDTO = new CartItemDTO(cartProduct.getProduct(), cartProduct.getQuantity());
						products.add(cartItemDTO);
					}
				}
			}
			return ResponseEntity.ok(products);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(products);
		}
	}

	@PostMapping("/addCartProduct")
	public ResponseEntity<String> addCartProduct(@RequestHeader("Authorization") String authorizationHeader,
			@RequestBody String userCartProduct) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> objectMap = objectMapper.readValue(userCartProduct, Map.class);
			Object productId = objectMap.get("productId");
			Object quantity = objectMap.get("quantity");
			String currentUser = emailService.getEmail(authorizationHeader);
			User user = userRepository.findByEmail((String) currentUser);
			List<CartItem> cartItems = user.getCart().getCartItems();
			Product product = productRepository.findById((Integer) productId).orElse(null);
			int flag = 0;
			if (cartItems != null && cartItems.size() > 0) {
				for (CartItem cartItem : cartItems) {
					if (cartItem != null && cartItem.getProduct().getId() == (Integer) productId) {
						cartItem.setQuantity(cartItem.getQuantity() + (Integer) quantity);
						cartItemRepository.save(cartItem);
						flag = 1;
						break;
					}
				}
			}
			if (flag == 0) {
				Cart cart = user.getCart();
				CartItem cartItem = new CartItem();
				cartItem.setProduct(product);
				cartItem.setQuantity((Integer) quantity);
				cartItem.setCart_id(cart);
				cartItem = cartItemRepository.save(cartItem);
				cartItems.add(cartItem);
				cart.setCartItems(cartItems);
				cart = cartRepository.save(cart);
			}
			return ResponseEntity.ok("Successfully added product to cart..!");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to add product to cart: " + e.getMessage());
		}
	}

	@DeleteMapping("/deleteCartProduct")
	public void deleteCartProduct(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam("productId") int productId) {
		String currentUser = emailService.getEmail(authorizationHeader);
		User user = userRepository.findByEmail(currentUser);
		if (user != null) {
			Cart cart = user.getCart();
			List<CartItem> cartItems = cart.getCartItems();
			if (cartItems != null && cartItems.size() > 0) {
				for (CartItem cartProduct : cartItems) {
					if (cartProduct != null && cartProduct.getProduct().getId() == productId) {
						cartItemRepository.delete(cartProduct);
						cartItems.remove(cartProduct);
						cart.setCartItems(cartItems);
						cartRepository.save(cart);
						break;
					}
				}

			}
		}
	}

	@PutMapping("/editCartProductQuantity")
	public void editCartProductQuantity(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam("productId") int productId, @RequestParam("action") String action) {
		String currentUser = emailService.getEmail(authorizationHeader);
		User user = userRepository.findByEmail(currentUser);
		if (user != null) {
			Cart cart = user.getCart();
			List<CartItem> cartItems = cart.getCartItems();
			if (cartItems != null && cartItems.size() > 0) {
				for (CartItem cartProduct : cartItems) {
					if (cartProduct != null && cartProduct.getProduct().getId() == productId) {
						if (action.equals("increase")) {
							cartProduct.setQuantity(cartProduct.getQuantity() + 1);
						} else {
							cartProduct.setQuantity(cartProduct.getQuantity() - 1);
						}
						cartItemRepository.save(cartProduct);
						break;
					}

				}
			}
		}
	}
}
