package com.credito.riesgo.grpc;

import io.quarkus.grpc.GrpcService;
import io.smallrye.mutiny.Uni;

import java.time.Duration;
import java.util.List;
import java.util.Random;

@GrpcService
public class RiskGrpcServiceImpl extends MutinyRiskServiceGrpc.RiskServiceImplBase {

    private static final Random RANDOM = new Random();

    @Override
    public Uni<ScoreResponse> getScore(ScoreRequest request) {
        return Uni.createFrom()
                .item(() -> ScoreResponse.newBuilder().setScore(RANDOM.nextInt(101)).build())
                .onItem().delayIt().by(Duration.ofSeconds(2));
    }

    @Override
    public Uni<DebtsResponse> getDebts(DebtsRequest request) {
        return Uni.createFrom()
                .item(this::buildMockDebtsResponse)
                .onItem().delayIt().by(Duration.ofMillis(1500));
    }

    private DebtsResponse buildMockDebtsResponse() {
        List<Debt> debts = List.of(
                Debt.newBuilder()
                        .setDescription("Tarjeta de crédito Banco del Pichincha")
                        .setAmount(2500.00)
                        .setMonthlyPayment(150.00)
                        .build(),
                Debt.newBuilder()
                        .setDescription("Préstamo vehicular Produbanco")
                        .setAmount(8000.00)
                        .setMonthlyPayment(280.00)
                        .build()
        );

        double totalMonthly = debts.stream()
                .mapToDouble(Debt::getMonthlyPayment)
                .sum();

        return DebtsResponse.newBuilder()
                .addAllDebts(debts)
                .setTotalMonthlyPayment(totalMonthly)
                .build();
    }
}
