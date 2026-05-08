package com.credito.riesgo.grpc;

import io.quarkus.grpc.GrpcClient;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

@QuarkusTest
class RiskGrpcServiceImplTest {

    @GrpcClient("risk-service")
    MutinyRiskServiceGrpc.MutinyRiskServiceStub client;

    @Test
    void getScore_shouldReturnValueBetween0And100() {
        ScoreResponse response = client
                .getScore(ScoreRequest.newBuilder().setCedula("1710034065").build())
                .await().atMost(Duration.ofSeconds(5));

        assertTrue(response.getScore() >= 0 && response.getScore() <= 100);
    }

    @Test
    void getDebts_shouldReturnPositiveTotalMonthlyPayment() {
        DebtsResponse response = client
                .getDebts(DebtsRequest.newBuilder().setCedula("1710034065").build())
                .await().atMost(Duration.ofSeconds(5));

        assertTrue(response.getTotalMonthlyPayment() > 0);
        assertFalse(response.getDebtsList().isEmpty());
    }
}
