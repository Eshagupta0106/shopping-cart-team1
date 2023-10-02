package com.shoppingcartteam1.serversidemysql.service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;


@Service
public class CloudinaryImageService {
	
	@Autowired
	private Cloudinary cloudinary;
	
	public String upload(MultipartFile file) throws IOException {
		 return cloudinary.uploader()
	                .upload(file.getBytes(),
	                        Map.of("public_id", UUID.randomUUID().toString()))
	                .get("url")
	                .toString();
	}

}
