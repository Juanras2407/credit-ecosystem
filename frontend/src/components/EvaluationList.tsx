import { useEffect, useState, useCallback } from 'react';
import type { EvaluationResponse } from '../types';
import { creditService } from '../services/creditService';
import { StatusBadge } from './StatusBadge';
import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  refreshTrigger: number;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

function formatCurrency(v: number): string {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(v);
}

export function EvaluationList({ refreshTrigger }: Props) {
  const [evaluations, setEvaluations] = useState<EvaluationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await creditService.getAll();
      setEvaluations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" label="Cargando historial..." />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="p-4 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-sm">
        <strong>Error al cargar historial:</strong> {error}
        <button
          onClick={load}
          className="ml-3 underline hover:no-underline focus:outline-none"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <svg className="mx-auto h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="font-medium">Sin evaluaciones registradas</p>
        <p className="text-sm mt-1">Las evaluaciones aparecerán aquí una vez procesadas.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto animate-fade-in">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {['Cédula', 'Monto', 'Plazo', 'Salario', 'Score', 'Estado', 'Fecha'].map(h => (
              <th key={h} className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 first:pl-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {evaluations.map(ev => (
            <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-3.5 px-2 first:pl-0 font-mono text-slate-700">{ev.cedula}</td>
              <td className="py-3.5 px-2 font-medium">{formatCurrency(ev.amount)}</td>
              <td className="py-3.5 px-2 text-slate-600">{ev.termYears} año{ev.termYears !== 1 ? 's' : ''}</td>
              <td className="py-3.5 px-2 text-slate-600">{formatCurrency(ev.salary)}</td>
              <td className="py-3.5 px-2">
                <span className={`font-bold ${ev.score > 70 ? 'text-success-600' : 'text-danger-600'}`}>
                  {ev.score}
                </span>
              </td>
              <td className="py-3.5 px-2">
                <StatusBadge status={ev.status} />
              </td>
              <td className="py-3.5 px-2 text-slate-500 whitespace-nowrap">{formatDate(ev.evaluationDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
