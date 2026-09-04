import React from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Activity, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CycleSettings, DailyLog, DayFertilityStatus } from '../types';
import { calculateCycleStats, parseISODate, addDays, formatISODate } from '../utils/cycleCalculations';
import { CycleHistoryChart } from './CycleHistoryChart';

interface StatisticsViewProps {
  settings: CycleSettings;
  logsMap: Record<string, DailyLog>;
  todayStatus: DayFertilityStatus;
  onUpdateCycleHistory?: (newHistory: number[]) => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  settings,
  logsMap,
  todayStatus,
  onUpdateCycleHistory,
}) => {
  const stats = calculateCycleStats(settings);
  const dum = parseISODate(settings.lastPeriodStartDate);
  const cycleLen = settings.cycleLengthDays || 28;

  // Next 3 projected cycles
  const futureCycles = [1, 2, 3].map((cycleMultiplier) => {
    const nextStart = addDays(dum, cycleLen * cycleMultiplier);
    const nextOvulation = addDays(nextStart, cycleLen - (settings.lutealPhaseDays || 14));
    const nextFertileStart = addDays(nextOvulation, -5);
    const nextFertileEnd = addDays(nextOvulation, 1);

    return {
      index: cycleMultiplier,
      startDate: nextStart,
      fertileStart: nextFertileStart,
      fertileEnd: nextFertileEnd,
      ovulationDate: nextOvulation,
    };
  });

  return (
    <div className="space-y-6">
      {/* Primary Recharts Component */}
      <CycleHistoryChart
        settings={settings}
        onUpdateHistory={onUpdateCycleHistory}
      />

      {/* Current Cycle Timeline Progression */}
      <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100/60 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              Progresso do Ciclo Atual (Dia {todayStatus.dayOfCycle} de {cycleLen})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Fase biológica atual: <strong className="text-stone-800 capitalize">{todayStatus.phase}</strong>
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full self-start sm:self-auto">
            {Math.round((todayStatus.dayOfCycle / cycleLen) * 100)}% concluído
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, (todayStatus.dayOfCycle / cycleLen) * 100)}%` }}
              className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-stone-400">
            <span>DUM: Dia 1 ({settings.lastPeriodStartDate})</span>
            <span>Dia {todayStatus.dayOfCycle} (Hoje)</span>
            <span>Previsão: Dia {cycleLen}</span>
          </div>
        </div>
      </div>

      {/* Projections for Next 3 Cycles */}
      <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            Projeção Antecipada dos Próximos 3 Ciclos
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Estimativas baseadas na média histórica de {stats.averageLength} dias para planejamento de viagens e compromissos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {futureCycles.map((fc) => (
            <div
              key={fc.index}
              className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/80 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                <span className="text-xs font-bold text-stone-900">
                  Próximo Ciclo +{fc.index}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                  Previsto
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-500">Início da Menstruação:</span>
                  <strong className="text-stone-900">
                    {fc.startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Janela Fértil:</span>
                  <span className="text-orange-700 font-semibold">
                    {fc.fertileStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a{' '}
                    {fc.fertileEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Ovulação Estimada:</span>
                  <span className="text-rose-600 font-bold">
                    {fc.ovulationDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
