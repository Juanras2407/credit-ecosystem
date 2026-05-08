package com.credito.evaluacion.infrastructure.grpc;

import com.credito.evaluacion.domain.port.RiskServicePort;
import com.credito.riesgo.grpc.DebtsRequest;
import com.credito.riesgo.grpc.MutinyRiskServiceGrpc;
import com.credito.riesgo.grpc.ScoreRequest;
import io.quarkus.grpc.GrpcClient;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RiskGrpcAdapter implements RiskServicePort {

    @GrpcClient("risk-service")
    MutinyRiskServiceGrpc.MutinyRiskServiceStub stub;

    @Override
    public Uni<Integer> getScore(String cedula) {
        return stub.getScore(ScoreRequest.newBuilder().setCedula(cedula).build())
                .map(response -> response.getScore());
    }

    @Override
    public Uni<Double> getTotalMonthlyDebt(String cedula) {
        return stub.getDebts(DebtsRequest.newBuilder().setCedula(cedula).build())
                .map(response -> response.getTotalMonthlyPayment());
    }
}
