package com.shoppingcartteam1.serverside;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.shoppingcartteam1.serverside.UserRepository;

@Controller
public class RouteController {
	private final UserRepository userRepository;

    @Autowired
    public RouteController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
}
