// src/main/java/com/cricmate/backend/HelloController.java
package com.cricmate.backend;


// built in classes for handling web requests we using
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// REST APIs, data not html
@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Backend is not running!";
    }
}
