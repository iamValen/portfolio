package dev.valen.wall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

// We wire the sqlite datasource by hand in DbConfig so we can make the folder
// first, so the usual datasource autoconfig is switched off here.
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class WallApplication {
    public static void main(String[] args) {
        SpringApplication.run(WallApplication.class, args);
    }
}
