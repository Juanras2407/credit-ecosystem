package com.credito.evaluacion.infrastructure.rest;

import com.credito.evaluacion.application.dto.EvaluationRequestDTO;
import com.credito.evaluacion.application.dto.EvaluationResponseDTO;
import com.credito.evaluacion.application.service.CreditEvaluationService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/v1/credit-evaluations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CreditEvaluationResource {

    @Inject
    CreditEvaluationService service;

    @POST
    public Uni<Response> evaluate(@Valid EvaluationRequestDTO request) {
        return service.evaluate(request)
                .map(dto -> Response.status(Response.Status.CREATED).entity(dto).build());
    }

    @GET
    public Uni<List<EvaluationResponseDTO>> listAll() {
        return service.findAll();
    }
}
