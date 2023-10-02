package com.shoppingcartteam1.serversidemysql.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.shoppingcartteam1.serversidemysql.security.JwtAuthEntryPoint;
import com.shoppingcartteam1.serversidemysql.security.JwtAuthFilter;

@Configuration
public class SecurityConfig {

	@Autowired
	private JwtAuthEntryPoint point;
	@Autowired
	private JwtAuthFilter filter;
	@Autowired
	private UserDetailsService userDetailsService;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Bean
	  public SecurityFilterChain securityFilterChain(HttpSecurity http)
	    throws Exception {
	    http
	      .csrf(csrf -> csrf.disable())
	      .cors(cors -> cors.disable())
	      .authorizeHttpRequests(auth ->
	        auth
//	          .requestMatchers("/cart")
//	          .authenticated()
               .requestMatchers("/admin/update-product/").hasRole("ADMIN")
			   .requestMatchers("/admin/delete/").hasRole("ADMIN")
			   .requestMatchers("/admin/add").hasRole("ADMIN")
	          .requestMatchers("/**")
	          .permitAll()
	      )
	      .exceptionHandling(ex -> ex.authenticationEntryPoint(point))
	      .sessionManagement(session ->
	        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	      );
	    http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
	    return http.build();
	  }

	@Bean
	public DaoAuthenticationProvider doDaoAuthenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(userDetailsService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration builder) throws Exception {
		return builder.getAuthenticationManager();
	}

}
