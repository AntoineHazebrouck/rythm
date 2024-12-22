CD src/main/resources/static/javascript
CALL npm install
CALL npm run build
CD ../../../../..
CALL mvn clean spring-boot:run