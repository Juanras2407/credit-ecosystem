FROM --platform=linux/amd64 maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B -q
COPY src ./src
RUN mvn package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/quarkus-app/ ./
EXPOSE 9000 8081
CMD ["java", "-jar", "quarkus-run.jar"]
