import type { EvaluationResponse } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  result: EvaluationResponse;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(value);
}

export function ResultCard({ result }: Props) {
  const capacity = result.salary * 0.4;
  const usedCapacity = result.totalMonthlyDebt + result.monthlyPaymentRequested;
  const pct = Math.min((usedCapacity / capacity) * 100, 100);

  return (
    <div className="card animate-slide-up border-l-4 border-l-primary-500 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Resultado de Evaluación</h3>
        <StatusBadge status={result.status} size="lg" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Metric label="Score Crediticio" value={`${result.score}/100`} highlight={result.score > 70} />
        <Metric label="Cuota Mensual Solicitada" value={formatCurrency(result.monthlyPaymentRequested)} />
        <Metric label="Deuda Mensual Existente" value={formatCurrency(result.totalMonthlyDebt)} />
        <Metric label="Capacidad de Pago (40% salario)" value={formatCurrency(capacity)} />
      </div>

      <div>
        <div className="flex justify-between text-sm text-slate-600 mb-1.5">
          <span>Compromiso de ingreso</span>
          <span className={`font-semibold ${pct > 100 ? 'text-danger-600' : 'text-success-600'}`}>
            {pct.toFixed(1)}%
          </span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pct > 100 ? 'bg-danger-500' : 'bg-success-500'}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">Límite regulatorio: 40% del salario</p>
      </div>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-success-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}
