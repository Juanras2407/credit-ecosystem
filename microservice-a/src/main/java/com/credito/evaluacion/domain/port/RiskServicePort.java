package com.credito.evaluacion.domain.port;

import io.smallrye.mutiny.Uni;

public interface RiskServicePort {

    Uni<Integer> getScore(String cedula);

    Uni<Double> getTotalMonthlyDebt(String cedula);
}
