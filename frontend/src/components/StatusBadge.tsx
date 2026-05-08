import type { EvaluationStatus } from '../types';

interface Props {
  status: EvaluationStatus;
  size?: 'sm' | 'lg';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const isApproved = status === 'APROBADO';

  const base =
    size === 'lg'
      ? 'inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-base'
      : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs';

  const colors = isApproved
    ? 'bg-success-50 text-success-700 ring-1 ring-success-500/30'
    : 'bg-danger-50 text-danger-700 ring-1 ring-danger-500/30';

  return (
    <span className={`${base} ${colors}`}>
      <span className={`${size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2'} rounded-full ${isApproved ? 'bg-success-500' : 'bg-danger-500'}`} />
      {status}
    </span>
  );
}
