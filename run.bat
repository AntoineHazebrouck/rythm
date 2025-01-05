CD src/main/resources/static/javascript
CALL npm install
CALL npm run build
CD ../../../../..
CALL ./mvnw clean spring-boot:run