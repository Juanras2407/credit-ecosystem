import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EvaluationForm } from '../components/EvaluationForm';
import { creditService } from '../services/creditService';

jest.mock('../services/creditService');

const mockedCreditService = creditService as jest.Mocked<typeof creditService>;

const mockResult = {
  id: 1,
  cedula: '1710034065',
  amount: 5000,
  termYears: 3,
  salary: 1200,
  evaluationDate: '2026-05-07T10:00:00',
  status: 'APROBADO' as const,
  score: 85,
  totalMonthlyDebt: 430,
  monthlyPaymentRequested: 138.89,
};

describe('EvaluationForm', () => {
  const onEvaluationComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<EvaluationForm onEvaluationComplete={onEvaluationComplete} />);

    expect(screen.getByLabelText(/número de cédula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monto solicitado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/plazo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salario mensual/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /solicitar evaluación/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<EvaluationForm onEvaluationComplete={onEvaluationComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /solicitar evaluación/i }));

    await waitFor(() => {
      expect(screen.getByText(/la cédula es obligatoria/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid cedula format', async () => {
    render(<EvaluationForm onEvaluationComplete={onEvaluationComplete} />);

    await userEvent.type(screen.getByLabelText(/número de cédula/i), '123');
    fireEvent.click(screen.getByRole('button', { name: /solicitar evaluación/i }));

    await waitFor(() => {
      expect(screen.getByText(/exactamente 10 dígitos/i)).toBeInTheDocument();
    });
  });

  it('submits the form and shows result on success', async () => {
    mockedCreditService.evaluate.mockResolvedValueOnce(mockResult);

    render(<EvaluationForm onEvaluationComplete={onEvaluationComplete} />);

    await userEvent.type(screen.getByLabelText(/número de cédula/i), '1710034065');
    await userEvent.type(screen.getByLabelText(/monto solicitado/i), '5000');
    await userEvent.type(screen.getByLabelText(/plazo/i), '3');
    await userEvent.type(screen.getByLabelText(/salario mensual/i), '1200');

    fireEvent.click(screen.getByRole('button', { name: /solicitar evaluación/i }));

    await waitFor(() => {
      expect(screen.getByText(/resultado de evaluación/i)).toBeInTheDocument();
      expect(screen.getByText('APROBADO')).toBeInTheDocument();
    });

    expect(onEvaluationComplete).toHaveBeenCalledTimes(1);
  });

  it('shows API error message on failure', async () => {
    mockedCreditService.evaluate.mockRejectedValueOnce(new Error('Cédula inválida'));

    render(<EvaluationForm onEvaluationComplete={onEvaluationComplete} />);

    await userEvent.type(screen.getByLabelText(/número de cédula/i), '1710034065');
    await userEvent.type(screen.getByLabelText(/monto solicitado/i), '5000');
    await userEvent.type(screen.getByLabelText(/plazo/i), '3');
    await userEvent.type(screen.getByLabelText(/salario mensual/i), '1200');

    fireEvent.click(screen.getByRole('button', { name: /solicitar evaluación/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/cédula inválida/i);
    });

    expect(onEvaluationComplete).not.toHaveBeenCalled();
  });

  it('disables submit button while loading', async () => {
    mockedCreditService.evaluate.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockResult), 500))
    );

    render(<EvaluationForm onEvaluationComplete={onEvaluationComplete} />);

    await userEvent.type(screen.getByLabelText(/número de cédula/i), '1710034065');
    await userEvent.type(screen.getByLabelText(/monto solicitado/i), '5000');
    await userEvent.type(screen.getByLabelText(/plazo/i), '3');
    await userEvent.type(screen.getByLabelText(/salario mensual/i), '1200');

    fireEvent.click(screen.getByRole('button', { name: /solicitar evaluación/i }));

    expect(screen.getByRole('button', { name: /consultando/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText(/resultado de evaluación/i)).toBeInTheDocument();
    });
  });
});
