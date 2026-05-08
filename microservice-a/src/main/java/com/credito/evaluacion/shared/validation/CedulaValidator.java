package com.credito.evaluacion.shared.validation;

import com.credito.evaluacion.shared.exception.ValidationException;

public class CedulaValidator {

    private static final int[] PESOS = {2, 1, 2, 1, 2, 1, 2, 1, 2};

    public static void validate(String cedula) {
        if (cedula == null || cedula.isBlank()) {
            throw new ValidationException("La cédula no puede estar vacía");
        }

        if (cedula.length() != 10) {
            throw new ValidationException("La cédula debe tener exactamente 10 dígitos");
        }

        if (!cedula.matches("\\d{10}")) {
            throw new ValidationException("La cédula debe contener únicamente dígitos numéricos");
        }

        int province = Integer.parseInt(cedula.substring(0, 2));
        if (province < 1 || province > 24) {
            throw new ValidationException("Código de provincia inválido (debe ser entre 01 y 24)");
        }

        int thirdDigit = Character.getNumericValue(cedula.charAt(2));
        if (thirdDigit >= 6) {
            throw new ValidationException("Tercer dígito inválido para persona natural (debe ser menor a 6)");
        }

        int sum = 0;
        for (int i = 0; i < 9; i++) {
            int digit = Character.getNumericValue(cedula.charAt(i));
            int product = digit * PESOS[i];
            sum += product >= 10 ? product - 9 : product;
        }

        int expectedVerifier = (10 - (sum % 10)) % 10;
        int actualVerifier = Character.getNumericValue(cedula.charAt(9));

        if (expectedVerifier != actualVerifier) {
            throw new ValidationException(
                "Cédula inválida: dígito verificador incorrecto (esperado: " + expectedVerifier + ")");
        }
    }
}
