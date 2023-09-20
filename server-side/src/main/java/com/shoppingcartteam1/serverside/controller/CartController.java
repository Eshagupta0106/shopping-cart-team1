package com.shoppingcartteam1.serverside.controller;

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
import com.shoppingcartteam1.serverside.configuration.JwtConfig;
import com.shoppingcartteam1.serverside.entity.CartProductDTO;
import com.shoppingcartteam1.serverside.mongodbcollection.Cart;
import com.shoppingcartteam1.serverside.mongodbcollection.CartProduct;
import com.shoppingcartteam1.serverside.mongodbcollection.Product;
import com.shoppingcartteam1.serverside.mongodbcollection.User;
import com.shoppingcartteam1.serverside.mongodbrepository.CartProductRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.CartRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.ProductRepository;
import com.shoppingcartteam1.serverside.mongodbrepository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "*")
public class CartController {
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	CartProductRepository cartProductRepository;
	@Autowired
	private JwtConfig jwtConfig;

	private String getEmailFromToken(String token) {
		try {
			Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(jwtConfig.getSecretKey()).build()
					.parseClaimsJws(token);

			Claims claims = claimsJws.getBody();
			return claims.getSubject();
		} catch (Exception e) {
			return null;
		}
	}

	private String getEmail(String authHeader) {
		String[] headerParts = authHeader.split(" ");
		String jwtToken = headerParts[1];
		return getEmailFromToken(jwtToken);
	}

	@GetMapping("/getCart")
	public ResponseEntity<List<CartProductDTO>> getCart(@RequestHeader("Authorization") String authorizationHeader) {
		List<CartProductDTO> products = new ArrayList<>();
		try {
			String currentUser = getEmail(authorizationHeader);
			User user = userRepository.findUserCart(currentUser);
			if (user != null) {
				Cart cart = user.getCart();
				if (cart != null) {
					List<CartProduct> cartProducts = cart.getProducts();
					if (cartProducts != null && cartProducts.size() > 0) {
						for (CartProduct cartProduct : cartProducts) {
							CartProductDTO cartProductDTO = new CartProductDTO();
							cartProductDTO.setProduct(cartProduct.getProduct());
							cartProductDTO.setQuantity(cartProduct.getQuantity());
							products.add(cartProductDTO);
						}
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
			String currentUser = getEmail(authorizationHeader);
			User user = userRepository.findUserCart((String) currentUser);
			Cart cart = user.getCart();
			List<CartProduct> cartProducts = cart.getProducts();
			Product product = productRepository.findById((Integer) productId).orElse(null);
			int flag = 0;
			if (cartProducts != null && cartProducts.size() > 0) {
				for (CartProduct cartProduct : cartProducts) {
					if (cartProduct != null && cartProduct.getProduct().getId() == (Integer) productId) {
						cartProduct.setQuantity(cartProduct.getQuantity() + (Integer) quantity);
						cartProductRepository.save(cartProduct);
						flag = 1;
						break;
					}
				}
			}
			if (flag == 0) {
				CartProduct cartProduct = new CartProduct();
				cartProduct.setProduct(product);
				cartProduct.setQuantity((Integer) quantity);
				cartProduct = cartProductRepository.save(cartProduct);
				cartProducts.add(cartProduct);
				cart.setProducts(cartProducts);
			}
			cart.setCartTotal(cart.getCartTotal() + (Integer) quantity);
			cart = cartRepository.save(cart);
			return ResponseEntity.ok("Successfully added product to cart..!");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to add product to cart: " + e.getMessage());
		}
	}

	@DeleteMapping("/deleteCartProduct")
	public void deleteCartProduct(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam("productId") int productId) {
		String currentUser = getEmail(authorizationHeader);
		User user = userRepository.findUserCart(currentUser);
		if (user != null) {
			Cart cart = user.getCart();
			if (cart != null) {
				List<CartProduct> cartProducts = cart.getProducts();
				if (cartProducts != null && cartProducts.size() > 0) {
					for (CartProduct cartProduct : cartProducts) {
						if (cartProduct != null && cartProduct.getProduct().getId() == productId) {
							cartProductRepository.delete(cartProduct);
							cartProducts.remove(cartProduct);
							cart.setProducts(cartProducts);
							cart.setCartTotal(cart.getCartTotal() - cartProduct.getQuantity());
							cart = cartRepository.save(cart);
							break;
						}
					}
				}
			}
		}
	}

	@PutMapping("/editCartProductQuantity")
	public void editCartProductQuantity(@RequestHeader("Authorization") String authorizationHeader,
			@RequestParam("productId") int productId, @RequestParam("action") String action) {
		String currentUser = getEmail(authorizationHeader);
		User user = userRepository.findUserCart(currentUser);
		if (user != null) {
			Cart cart = user.getCart();
			if (cart != null) {
				List<CartProduct> cartProducts = cart.getProducts();
				if (cartProducts != null && cartProducts.size() > 0) {
					for (CartProduct cartProduct : cartProducts) {
						if (cartProduct != null && cartProduct.getProduct().getId() == productId) {
							if (action.equals("increase")) {
								cartProduct.setQuantity(cartProduct.getQuantity() + 1);
								cart.setCartTotal(cart.getCartTotal() + 1);
							} else {
								cartProduct.setQuantity(cartProduct.getQuantity() - 1);
								cart.setCartTotal(cart.getCartTotal() - 1);
							}
							cartProductRepository.save(cartProduct);
							cartRepository.save(cart);
							break;
						}
					}
				}
			}
		}
	}
}
