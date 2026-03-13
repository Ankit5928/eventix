package com.bluepal.service;


import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface CloudinaryService {

    /**
     * Upload file to Cloudinary.
     * @param file the multipart file
     * @return map containing public_id, secure_url, etc.
     */
    Map upload(MultipartFile file) throws IOException;

    /**
     * Delete file from Cloudinary.
     * @param publicId public id of image
     * @return result map
     */
    Map destroy(String publicId) throws IOException;
}