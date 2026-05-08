package com.credito.evaluacion.domain.model;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "credit_evaluations")
public class CreditEvaluation extends PanacheEntity {

    @Column(name = "cedula", nullable = false, length = 10)
    public String cedula;

    @Column(name = "amount", nullable = false)
    public Double amount;

    @Column(name = "term_years", nullable = false)
    public Integer termYears;

    @Column(name = "salary", nullable = false)
    public Double salary;

    @Column(name = "evaluation_date", nullable = false)
    public LocalDateTime evaluationDate;

    @Column(name = "status", nullable = false, length = 20)
    public String status;

    @Column(name = "score")
    public Integer score;

    @Column(name = "total_monthly_debt")
    public Double totalMonthlyDebt;

    @Column(name = "monthly_payment_requested")
    public Double monthlyPaymentRequested;
}
