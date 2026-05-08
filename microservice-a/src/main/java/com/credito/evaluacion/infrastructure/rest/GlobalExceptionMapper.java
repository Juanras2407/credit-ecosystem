package com.credito.evaluacion.infrastructure.rest;

import com.credito.evaluacion.shared.exception.ValidationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

@Provider
public class GlobalExceptionMapper implements ExceptionMapper<ValidationException> {

    @Override
    public Response toResponse(ValidationException exception) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of(
                        "error", exception.getMessage(),
                        "type", "VALIDATION_ERROR"
                ))
                .build();
    }
}
