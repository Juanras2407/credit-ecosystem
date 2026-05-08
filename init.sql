CREATE TABLE IF NOT EXISTS credit_evaluations (
    id BIGSERIAL PRIMARY KEY,
    cedula VARCHAR(10) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    term_years INTEGER NOT NULL,
    salary DECIMAL(15, 2) NOT NULL,
    evaluation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    score INTEGER,
    total_monthly_debt DECIMAL(15, 2),
    monthly_payment_requested DECIMAL(15, 2)
);

CREATE INDEX IF NOT EXISTS idx_evaluations_cedula ON credit_evaluations(cedula);
CREATE INDEX IF NOT EXISTS idx_evaluations_date ON credit_evaluations(evaluation_date DESC);
