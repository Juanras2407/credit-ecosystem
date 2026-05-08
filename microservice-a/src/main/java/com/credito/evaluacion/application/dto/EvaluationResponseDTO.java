package com.credito.evaluacion.application.dto;

import com.credito.evaluacion.domain.model.CreditEvaluation;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public record EvaluationResponseDTO(
        Long id,
        String cedula,
        Double amount,
        Integer termYears,
        Double salary,

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime evaluationDate,

        String status,
        Integer score,
        Double totalMonthlyDebt,
        Double monthlyPaymentRequested
) {
    public static EvaluationResponseDTO from(CreditEvaluation e) {
        return new EvaluationResponseDTO(
                e.id,
                e.cedula,
                e.amount,
                e.termYears,
                e.salary,
                e.evaluationDate,
                e.status,
                e.score,
                e.totalMonthlyDebt,
                e.monthlyPaymentRequested
        );
    }
}
