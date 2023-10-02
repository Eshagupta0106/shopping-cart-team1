package com.shoppingcartteam1.serverside.service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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

	private final Set<String> adminUsers = new HashSet<>();

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = usersRepository.findUser(username);
		if (user == null) {
			throw new UsernameNotFoundException("User not found with email: " + username);
		}
		List<User> users=usersRepository.findAll();
		GrantedAuthority authority;
		for (User u : users) {
			if(u.getRole().equals("ADMIN")) {
				adminUsers.add(u.getEmail());
			}
		}
		if (adminUsers.contains(username)) {
			authority = new SimpleGrantedAuthority("ROLE_ADMIN");
		}
		else {
			authority = new SimpleGrantedAuthority("ROLE_USER");
		}

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(authority)
        );
	}
}