package com.shoppingcartteam1.serverside;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;

import com.shoppingcartteam1.serverside.service.CustomUserDetailService;

@SpringBootTest
class ServerSideApplicationTests {
    @Test
    public void testLoadUserByUsername() {
    	CustomUserDetailService customUserDetailService = new CustomUserDetailService();
    	UserDetails userDetail = customUserDetailService.loadUserByUsername("gtirumala024@gmail.com");
//    	UserDetails userDetail2 = customUserDetailService.loadUserByUsername("greeshma@gmail.com");
    	assertEquals(userDetail.getUsername(),"gtirumala024@gmail.com");
//    	assertEquals(userDetail2,"1234");
    }
}
