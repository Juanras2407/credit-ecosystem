import { useState } from 'react';
import { EvaluationForm } from './components/EvaluationForm';
import { EvaluationList } from './components/EvaluationList';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="h-9 w-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-slate-900">Sistema de Evaluación Crediticia</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <section className="lg:col-span-2">
            <div className="card">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Nueva Solicitud</h2>
                <p className="text-sm text-slate-500 mt-1">Complete los datos para evaluar la elegibilidad crediticia.</p>
              </div>
              <EvaluationForm onEvaluationComplete={() => setRefreshTrigger(n => n + 1)} />
            </div>
          </section>

          <section className="lg:col-span-3">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Historial de Evaluaciones</h2>
                  <p className="text-sm text-slate-500 mt-1">Todas las solicitudes procesadas.</p>
                </div>
                <button
                  onClick={() => setRefreshTrigger(n => n + 1)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Recargar"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <EvaluationList refreshTrigger={refreshTrigger} />
            </div>
          </section>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-100 mt-8">
        Sistema de Evaluación Crediticia
      </footer>
    </div>
  );
}
