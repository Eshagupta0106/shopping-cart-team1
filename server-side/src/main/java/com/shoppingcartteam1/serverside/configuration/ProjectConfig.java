package com.shoppingcartteam1.serverside.configuration;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;


@Configuration
public class ProjectConfig {

	@Bean
	public Cloudinary getCloudinary() {
		Map<String,String> config = new HashMap<>();
		config.put("cloud_name", "dqfcaqrjr");
		config.put("api_key", "468297993566776");
		config.put("api_secret", "ALubpthlRkoFsdbrXw6vdaU0zWY");
		return new Cloudinary(config);
	}
}
