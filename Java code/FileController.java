package com.code.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.code.Entity.FileInformation;
import com.code.Entity.User;
import com.code.service.FileService;
import com.code.service.UserService;
@CrossOrigin
@RestController
@RequestMapping("/file")
public class FileController {

	@Autowired
    private FileService fileService;

	@Autowired
	private UserService userService;
	
    @PostMapping("/{userId}/upload")
    public String uploadFile(@PathVariable("userId") int userId,
    		                 @RequestParam("file") MultipartFile file,
                             @RequestParam("objectType") String objectType,
                             @RequestParam("objectId") int objectId) {
        return fileService.uploadFile(file, objectType, objectId,userId);
    }
    
    @GetMapping("/{userId}/image")
    public ResponseEntity<Resource> imageByUserId(@PathVariable int userId) {
        
        User user = userService.getUserById(userId);

        
        FileInformation fileInformation = user.getFiles();
        
        if(fileInformation==null) {
        	return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        
        String filePath = "E:/images/" + fileInformation.getFileName();   

        
        Resource resource = new FileSystemResource(filePath);

        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) 
                .body(resource);
  }
}
