import { useState } from 'react';
import type { EvaluationResponse } from '../types';
import { creditService } from '../services/creditService';
import { LoadingSpinner } from './LoadingSpinner';
import { ResultCard } from './ResultCard';

interface Props {
  onEvaluationComplete: () => void;
}

interface FormState {
  cedula: string;
  amount: string;
  termYears: string;
  salary: string;
}

interface FormErrors {
  cedula?: string;
  amount?: string;
  termYears?: string;
  salary?: string;
}

function validateClient(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.cedula) {
    errors.cedula = 'La cédula es obligatoria';
  } else if (!/^\d{10}$/.test(form.cedula)) {
    errors.cedula = 'La cédula debe tener exactamente 10 dígitos numéricos';
  }

  const amount = parseFloat(form.amount);
  if (!form.amount || isNaN(amount) || amount <= 0) {
    errors.amount = 'Ingrese un monto válido mayor a cero';
  }

  const term = parseInt(form.termYears);
  if (!form.termYears || isNaN(term) || term < 1 || term > 30) {
    errors.termYears = 'El plazo debe estar entre 1 y 30 años';
  }

  const salary = parseFloat(form.salary);
  if (!form.salary || isNaN(salary) || salary <= 0) {
    errors.salary = 'Ingrese un salario válido mayor a cero';
  }

  return errors;
}

export function EvaluationForm({ onEvaluationComplete }: Props) {
  const [form, setForm] = useState<FormState>({ cedula: '', amount: '', termYears: '', salary: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setResult(null);

    const validationErrors = validateClient(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await creditService.evaluate({
        cedula: form.cedula,
        amount: parseFloat(form.amount),
        termYears: parseInt(form.termYears),
        salary: parseFloat(form.salary),
      });
      setResult(response);
      onEvaluationComplete();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error inesperado al procesar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Número de Cédula"
              name="cedula"
              type="text"
              placeholder="Ej: 1710034065"
              maxLength={10}
              value={form.cedula}
              error={errors.cedula}
              onChange={handleChange}
              hint="10 dígitos según Módulo 10 Ecuador"
            />
          </div>
          <Field
            label="Monto Solicitado (USD)"
            name="amount"
            type="number"
            placeholder="Ej: 5000"
            min="0"
            step="0.01"
            value={form.amount}
            error={errors.amount}
            onChange={handleChange}
          />
          <Field
            label="Plazo (años)"
            name="termYears"
            type="number"
            placeholder="Ej: 3"
            min="1"
            max="30"
            value={form.termYears}
            error={errors.termYears}
            onChange={handleChange}
          />
          <div className="sm:col-span-2">
            <Field
              label="Salario Mensual (USD)"
              name="salary"
              type="number"
              placeholder="Ej: 1200"
              min="0"
              step="0.01"
              value={form.salary}
              error={errors.salary}
              onChange={handleChange}
            />
          </div>
        </div>

        {apiError && (
          <div
            role="alert"
            className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-sm"
          >
            <strong>Error:</strong> {apiError}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-6">
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <LoadingSpinner size="sm" label="Evaluando..." className="text-white" />
              <span>Consultando Buró de Crédito...</span>
            </span>
          ) : (
            'Solicitar Evaluación de Crédito'
          )}
        </button>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  max?: string;
  step?: string;
  maxLength?: number;
}

function Field({ label, name, hint, error, ...inputProps }: FieldProps) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        name={name}
        className={`input-field ${error ? 'error' : ''}`}
        {...inputProps}
      />
      {hint && !error && (
        <p className="text-xs text-slate-400 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-danger-600 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
