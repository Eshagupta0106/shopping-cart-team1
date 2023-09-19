package com.shoppingcartteam1.serverside.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class RouteController {

	@GetMapping(value = { "/", "/{path:[^\\.]*}" })
	public String redirectToAngularRoute() {
		return "index";
	}

	@RequestMapping(value = { "/cart/**" })
	public String forward() {
		return "index";
	}
}
