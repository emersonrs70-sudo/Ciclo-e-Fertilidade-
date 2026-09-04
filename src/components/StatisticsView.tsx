import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Activity, 
  Heart, 
  Thermometer, 
  Clock 
} from 'lucide-react';
import { CycleSettings, DailyLog, DayFertilityStatus } from '../types';
import { calculateCycleMetrics, getUpcomingKeyDates, parseISODate, formatISODate } from '../utils/cycleCalculations';

interface StatisticsViewProps {
  settings: CycleSettings;
  logsMap: Record<string, DailyLog>;
  todayStatus: DayFertilityStatus;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  settings,
  logsMap,
  todayStatus,
}) => {
  const metrics = calculateCycleMetrics(settings);
  const upcoming = getUpcomingKeyDates(settings);

  // Compute stats from logs
  const logsList: DailyLog[] = Object.values(logsMap);
  const totalLogsCount = logsList.length;
  
  // Symptoms count
  const symptomCounts: Record<string, number> = {};
  logsList.forEach((l) => {
    l.symptoms?.forEach((s) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });

  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Intercourse breakdown
  const protectedCount = logsList.filter((l) => l.intercourse === 'protected').length;
  const unprotectedCount = logsList.filter((l) => l.intercourse === 'unprotected').length;
  const withdrawalCount = logsList.filter((l) => l.intercourse === 'withdrawal').length;

  // Next 3 cycles forecast
  const cycleForecasts = [1, 2, 3].map((cycleIndex) => {
    const start = parseISODate(settings.lastPeriodStartDate);
    const periodStart = new Date(start);
    periodStart.setDate(periodStart.getDate() + metrics.avgLength * cycleIndex);

    const ovulationDate = new Date(periodStart);
    ovulationDate.setDate(ovulationDate.getDate() + metrics.ovulationCycleDay);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    return {
      cycleIndex,
      periodDateStr: formatISODate(periodStart),
      ovulationDateStr: formatISODate(ovulationDate),
      fertileRangeStr: `${formatISODate(fertileStart)} a ${formatISODate(fertileEnd)}`,
    };
  });

  // Cycle day progress percentage
  const currentDay = todayStatus.dayOfCycle;
  const totalDays = settings.cycleLengthDays;
  const progressPercent = Math.min(100, Math.round((currentDay / totalDays) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Cycle Timeline Visualizer */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>Mapa do Ciclo Atual (Dia {currentDay} de {totalDays})</span>
            </h3>
            <p className="text-xs text-stone-500">
              Visualização proporcional das fases hormonais e probabilidades
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-auto">
            {progressPercent}% do ciclo decorrido
          </span>
        </div>

        {/* Visual Bar */}
        <div className="mt-6">
          <div className="relative h-6 rounded-full overflow-hidden flex bg-stone-100 border border-stone-200">
            {/* Menstruação */}
            <div 
              style={{ width: `${(settings.periodLengthDays / totalDays) * 100}%` }}
              className="bg-red-400 h-full relative group"
              title={`Menstruação: Dias 1 a ${settings.periodLengthDays}`}
            />
            {/* Fase Folicular */}
            <div 
              style={{ width: `${(Math.max(0, metrics.ovulationCycleDay - 6 - settings.periodLengthDays) / totalDays) * 100}%` }}
              className="bg-emerald-300 h-full"
              title="Fase Folicular Pré-Fértil"
            />
            {/* Janela Fértil & Ovulação */}
            <div 
              style={{ width: `${(7 / totalDays) * 100}%` }}
              className="bg-purple-400 h-full relative"
              title="Janela Fértil (Alto Risco Gestacional)"
            />
            {/* Fase Lútea */}
            <div 
              style={{ width: `${(settings.lutealPhaseDays / totalDays) * 100}%` }}
              className="bg-emerald-400 h-full"
              title="Fase Lútea (Baixíssima Probabilidade)"
            />
          </div>

          {/* Current day cursor */}
          <div className="relative w-full h-8 mt-1">
            <div 
              style={{ left: `${progressPercent}%` }}
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all"
            >
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-stone-900" />
              <span className="text-[10px] font-bold bg-stone-900 text-white px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                Hoje (D{currentDay})
              </span>
            </div>
          </div>

          {/* Bar Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span>Menstruação (D1-{settings.periodLengthDays})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              <span>Pré-Ovulatória (Baixo Risco)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span>Janela Fértil (Alto Risco)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Fase Lútea (Infértil)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Forecast Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Next Ovulation */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Próxima Ovulação
            </span>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            {upcoming.nextOvulationDate}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Estimada para o dia {metrics.ovulationCycleDay} do ciclo. Liberação do óvulo.
          </p>
        </div>

        {/* Next Period */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Próxima Menstruação
            </span>
            <Calendar className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            {upcoming.nextPeriodDate}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Início estimado do próximo ciclo ({settings.cycleLengthDays} dias de duração).
          </p>
        </div>

        {/* Regularity & Standard Deviation */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Regularidade do Ciclo
            </span>
            <TrendingUp className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-lg font-bold text-stone-900">
            {metrics.regularity}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Variação típica de ±{metrics.stdDev} dias entre ciclos recentes.
          </p>
        </div>
      </div>

      {/* 3. 3-Month Cycle Projections */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-stone-600" />
          <span>Projeção dos Próximos 3 Ciclos</span>
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Planejamento prévio para viagens, eventos ou momentos com parceiro
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cycleForecasts.map((cf) => (
            <div 
              key={cf.cycleIndex}
              className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs"
            >
              <div className="font-bold text-stone-800 text-sm flex items-center justify-between">
                <span>Ciclo +{cf.cycleIndex}</span>
                <span className="text-[10px] text-stone-500 font-normal">Previsão</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Início Menstruação:</span>
                <strong className="text-red-700 font-mono text-xs">{cf.periodDateStr}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Ápice da Ovulação:</span>
                <strong className="text-purple-700 font-mono text-xs">{cf.ovulationDateStr}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Janela Fértil Total:</span>
                <span className="text-stone-700 font-mono text-[11px]">{cf.fertileRangeStr}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Logs Summary & Symptoms Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-base font-bold text-stone-900 mb-2">
            Sintomas Mais Frequentes
          </h3>
          {topSymptoms.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              Nenhum sintoma registrado ainda. Use o botão "Registrar Hoje" para acompanhar cólicas, humor e dores.
            </p>
          ) : (
            <div className="space-y-2.5 mt-3">
              {topSymptoms.map(([sym, count]) => (
                <div key={sym} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700">
                    <span>{sym}</span>
                    <span className="text-stone-500">{count} registro{count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div 
                      style={{ width: `${Math.min(100, (count / totalLogsCount) * 100)}%` }}
                      className="bg-rose-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6">
          <h3 className="text-base font-bold text-stone-900 mb-2">
            Atividade & Prevenção Registrada
          </h3>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-100">
              <span className="text-xl font-bold text-pink-700 block font-mono">{protectedCount}</span>
              <span className="text-[11px] text-pink-900">Com Camisinha</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xl font-bold text-stone-800 block font-mono">{withdrawalCount}</span>
              <span className="text-[11px] text-stone-600">Coito Interrompido</span>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
              <span className="text-xl font-bold text-red-700 block font-mono">{unprotectedCount}</span>
              <span className="text-[11px] text-red-900">Desprotegida</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200/70">
            <p>
              💡 <strong>Lembrete de Saúde:</strong> O uso consistente do preservativo reduz em mais de 98% a chance de gestação não planejada e é o único método protetor contra ISTs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
