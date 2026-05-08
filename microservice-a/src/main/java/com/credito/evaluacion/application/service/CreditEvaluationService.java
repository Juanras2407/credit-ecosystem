package com.credito.evaluacion.application.service;

import com.credito.evaluacion.application.dto.EvaluationRequestDTO;
import com.credito.evaluacion.application.dto.EvaluationResponseDTO;
import com.credito.evaluacion.domain.model.CreditEvaluation;
import com.credito.evaluacion.domain.port.RiskServicePort;
import com.credito.evaluacion.shared.validation.CedulaValidator;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.panache.common.Sort;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class CreditEvaluationService {

    @Inject
    RiskServicePort riskServicePort;

    public Uni<EvaluationResponseDTO> evaluate(EvaluationRequestDTO request) {
        CedulaValidator.validate(request.cedula());

        double monthlyPaymentRequested = request.amount() / (request.termYears() * 12.0);

        return Uni.combine().all()
                .unis(
                        riskServicePort.getScore(request.cedula()),
                        riskServicePort.getTotalMonthlyDebt(request.cedula())
                )
                .asTuple()
                .onItem().transformToUni(tuple -> {
                    int score = tuple.getItem1();
                    double deudaMensual = tuple.getItem2();
                    boolean approved = score > 70
                            && (deudaMensual + monthlyPaymentRequested) < request.salary() * 0.40;

                    CreditEvaluation evaluation = buildEvaluation(
                            request, score, deudaMensual, monthlyPaymentRequested, approved);

                    return Panache.withTransaction(evaluation::persist)
                            .map(e -> EvaluationResponseDTO.from((CreditEvaluation) e));
                });
    }

    public Uni<List<EvaluationResponseDTO>> findAll() {
        return Panache.withSession(() ->
                CreditEvaluation.listAll(Sort.by("evaluationDate").descending())
        ).map(list -> list.stream().map(e -> EvaluationResponseDTO.from((CreditEvaluation) e)).toList());
    }

    private CreditEvaluation buildEvaluation(
            EvaluationRequestDTO req, int score, double deuda, double cuota, boolean approved) {
        CreditEvaluation e = new CreditEvaluation();
        e.cedula = req.cedula();
        e.amount = req.amount();
        e.termYears = req.termYears();
        e.salary = req.salary();
        e.evaluationDate = LocalDateTime.now();
        e.status = approved ? "APROBADO" : "RECHAZADO";
        e.score = score;
        e.totalMonthlyDebt = deuda;
        e.monthlyPaymentRequested = cuota;
        return e;
    }
}
