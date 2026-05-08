import type { EvaluationRequest, EvaluationResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Error de servidor' }));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const creditService = {
  async evaluate(request: EvaluationRequest): Promise<EvaluationResponse> {
    const res = await fetch(`${API_BASE_URL}/v1/credit-evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<EvaluationResponse>(res);
  },

  async getAll(): Promise<EvaluationResponse[]> {
    const res = await fetch(`${API_BASE_URL}/v1/credit-evaluations`);
    return handleResponse<EvaluationResponse[]>(res);
  },
};
