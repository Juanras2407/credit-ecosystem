export interface EvaluationRequest {
  cedula: string;
  amount: number;
  termYears: number;
  salary: number;
}

export interface EvaluationResponse {
  id: number;
  cedula: string;
  amount: number;
  termYears: number;
  salary: number;
  evaluationDate: string;
  status: 'APROBADO' | 'RECHAZADO';
  score: number;
  totalMonthlyDebt: number;
  monthlyPaymentRequested: number;
}

export interface ApiError {
  error: string;
  type?: string;
}

export type EvaluationStatus = 'APROBADO' | 'RECHAZADO';
