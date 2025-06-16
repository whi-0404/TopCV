package com.TopCV;

import com.TopCV.configuration.PythonServiceConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(PythonServiceConfig.class)
public class TopCvApplication {

	public static void main(String[] args) {
		SpringApplication.run(TopCvApplication.class, args);
	}

}
