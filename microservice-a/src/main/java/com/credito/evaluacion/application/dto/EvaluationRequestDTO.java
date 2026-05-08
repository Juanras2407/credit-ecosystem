package com.credito.evaluacion.application.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record EvaluationRequestDTO(

        @NotBlank(message = "La cédula es obligatoria")
        @Size(min = 10, max = 10, message = "La cédula debe tener exactamente 10 dígitos")
        String cedula,

        @NotNull(message = "El monto solicitado es obligatorio")
        @Positive(message = "El monto debe ser mayor a cero")
        Double amount,

        @NotNull(message = "El plazo es obligatorio")
        @Min(value = 1, message = "El plazo mínimo es 1 año")
        @Max(value = 30, message = "El plazo máximo es 30 años")
        Integer termYears,

        @NotNull(message = "El salario es obligatorio")
        @Positive(message = "El salario debe ser mayor a cero")
        Double salary
) {}
