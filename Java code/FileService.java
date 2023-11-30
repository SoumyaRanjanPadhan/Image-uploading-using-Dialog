package com.code.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.code.Entity.FileInformation;
import com.code.Entity.User;
import com.code.repository.FileRepo;
import com.code.repository.UserRepo;

@Service
public class FileService {
	
	@Autowired
    private FileRepo fileRepo;
	
	@Autowired
	private UserService userService;

    public String uploadFile(MultipartFile file, String objectType, int objectId, int userId) {
    	try {
            
            if (file.isEmpty()) {
                return "File is empty";
            }

            User user=userService.getUserById(userId);
            FileInformation fileDetails = new FileInformation();
            fileDetails.setFileName(file.getOriginalFilename());
            fileDetails.setFileType(file.getContentType());

            
            String uploadDir = "E:/images/";
            String filePath = uploadDir + file.getOriginalFilename();
            fileDetails.setFilePath(filePath);

            
            fileDetails.setObjectType(objectType);
            fileDetails.setObjectId(objectId);

            
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(file.getInputStream(), uploadPath.resolve(file.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
            user.setFiles(fileDetails);
            
            fileRepo.save(fileDetails);

            return "File uploaded successfully!";
        } catch (IOException e) {
            e.printStackTrace();
            return "File upload failed";
        }

   }
}
