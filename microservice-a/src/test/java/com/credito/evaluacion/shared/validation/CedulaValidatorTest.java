package com.credito.evaluacion.shared.validation;

import com.credito.evaluacion.shared.exception.ValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CedulaValidatorTest {

    @Test
    void validCedulaPichincha() {
        assertThatCode(() -> CedulaValidator.validate("1710034065"))
                .doesNotThrowAnyException();
    }

    @Test
    void validCedulaAzuay() {
        assertThatCode(() -> CedulaValidator.validate("0102068525"))
                .doesNotThrowAnyException();
    }

    @Test
    void rejectsCedulaTooShort() {
        assertThatThrownBy(() -> CedulaValidator.validate("123456789"))
                .isInstanceOf(ValidationException.class);
    }

    @Test
    void rejectsNonNumericCharacters() {
        assertThatThrownBy(() -> CedulaValidator.validate("17100ABC65"))
                .isInstanceOf(ValidationException.class);
    }

    @Test
    void rejectsProvinceZero() {
        assertThatThrownBy(() -> CedulaValidator.validate("0012345678"))
                .isInstanceOf(ValidationException.class);
    }

    @Test
    void rejectsProvinceAbove24() {
        assertThatThrownBy(() -> CedulaValidator.validate("2512345678"))
                .isInstanceOf(ValidationException.class);
    }

    @Test
    void rejectsThirdDigitAboveFive() {
        assertThatThrownBy(() -> CedulaValidator.validate("1760034065"))
                .isInstanceOf(ValidationException.class);
    }

    @Test
    void rejectsWrongCheckDigit() {
        assertThatThrownBy(() -> CedulaValidator.validate("1710034060"))
                .isInstanceOf(ValidationException.class);
    }

    @Test
    void rejectsNull() {
        assertThatThrownBy(() -> CedulaValidator.validate(null))
                .isInstanceOf(ValidationException.class);
    }

    @ParameterizedTest
    @ValueSource(strings = {"0000000000", "1111111111", "9999999999"})
    void rejectsRepeatedDigits(String cedula) {
        assertThatThrownBy(() -> CedulaValidator.validate(cedula))
                .isInstanceOf(ValidationException.class);
    }
}
