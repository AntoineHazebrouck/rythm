CALL docker compose up --detach
CALL npm --prefix src/main/resources/static/javascript run build
CALL mvn clean spring-boot:run