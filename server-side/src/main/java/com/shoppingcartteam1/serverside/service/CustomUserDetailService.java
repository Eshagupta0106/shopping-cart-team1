package com.shoppingcartteam1.serverside.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.shoppingcartteam1.serverside.mongodbcollection.User;
import com.shoppingcartteam1.serverside.mongodbrepository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

	@Autowired
	private UserRepository usersRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		System.out.print(username);
		System.out.println(usersRepository);
		User user = usersRepository.findUser(username);
		if (user == null) {
			throw new UsernameNotFoundException("User not found with email: " + username);
		}
		return user;
	}
}