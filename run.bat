CALL ./mvnw --file ./game-ui/pom.xml clean install
CALL ./mvnw --file ./web-server/pom.xml clean spring-boot:run