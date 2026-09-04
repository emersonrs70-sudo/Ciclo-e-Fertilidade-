import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
  Legend,
} from 'recharts';
import {
  Activity,
  Calendar,
  Plus,
  Trash2,
  HelpCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { CycleSettings } from '../types';
import { calculateCycleStats } from '../utils/cycleCalculations';

interface CycleHistoryChartProps {
  settings: CycleSettings;
  onUpdateHistory?: (newHistory: number[]) => void;
}

export const CycleHistoryChart: React.FC<CycleHistoryChartProps> = ({
  settings,
  onUpdateHistory,
}) => {
  const [chartType, setChartType] = useState<'bars' | 'trend' | 'phases'>('bars');
  const [newCycleInput, setNewCycleInput] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);

  const stats = calculateCycleStats(settings);

  const handleAddCycle = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newCycleInput, 10);
    if (isNaN(val) || val < 18 || val > 55) {
      setInputError('A duração deve estar entre 18 e 55 dias.');
      return;
    }
    setInputError(null);
    const updated = [...(settings.cycleHistory || [28, 27, 29, 28]), val];
    if (onUpdateHistory) {
      onUpdateHistory(updated);
    }
    setNewCycleInput('');
  };

  const handleRemoveCycle = (indexToRemove: number) => {
    if ((settings.cycleHistory || []).length <= 2) {
      alert('Mantenha pelo menos 2 ciclos para cálculo de estatísticas e regularidade.');
      return;
    }
    const updated = settings.cycleHistory.filter((_, idx) => idx !== indexToRemove);
    if (onUpdateHistory) {
      onUpdateHistory(updated);
    }
  };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-stone-700/60 text-xs min-w-[210px] space-y-1.5 z-50">
          <div className="flex items-center justify-between border-b border-stone-700/60 pb-1.5 font-bold">
            <span className="text-rose-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {label}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              data.isRegular ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {data.statusText}
            </span>
          </div>
          <div className="flex justify-between text-stone-300">
            <span>Duração Total:</span>
            <span className="font-bold text-white text-sm">{data.lengthDays} dias</span>
          </div>
          <div className="flex justify-between text-stone-400">
            <span>Desvio da média:</span>
            <span className={`font-semibold ${data.deviationFromAverage >= 0 ? 'text-rose-300' : 'text-cyan-300'}`}>
              {data.deviationFromAverage > 0 ? `+${data.deviationFromAverage}` : data.deviationFromAverage} dias
            </span>
          </div>
          <div className="flex justify-between text-stone-400">
            <span>Menstruação:</span>
            <span className="text-stone-200">{data.periodDays} dias</span>
          </div>
          <div className="flex justify-between text-stone-400">
            <span>Ovulação estimada:</span>
            <span className="text-stone-200">Dia {data.ovulationDay} do ciclo</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="cycle-history-recharts-container" className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Top Header with Regularity Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                Histórico & Regularidade dos Ciclos
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Gráficos analíticos construídos com Recharts sobre a constância hormonal e estabilidade menstrual.
              </p>
            </div>
          </div>
        </div>

        {/* Regularity Score Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-rose-50 to-orange-50/50 border border-rose-200/70 px-4 py-2.5 rounded-xl self-start sm:self-auto">
          <Award className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-600">Índice de Regularidade:</span>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">
                {stats.regularityLevel}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-stone-900">{stats.regularityScore}%</span>
              <span className="text-[11px] text-stone-500">constância média</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: Average, Std Dev, Min/Max */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/70">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Duração Média
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-stone-900">{stats.averageLength}</span>
            <span className="text-xs font-medium text-stone-500">dias</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Padrão clínico normal
          </span>
        </div>

        <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/70">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Variação Máxima
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-stone-900">{stats.cycleVariation}</span>
            <span className="text-xs font-medium text-stone-500">dias</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Min: {stats.minCycle}d • Max: {stats.maxCycle}d
          </span>
        </div>

        <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/70">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Desvio Padrão
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-stone-900">±{stats.stdDev}</span>
            <span className="text-xs font-medium text-stone-500">dias</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Oscilação média observada
          </span>
        </div>

        <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/70">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Ciclos Analisados
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-stone-900">{(settings.cycleHistory || []).length}</span>
            <span className="text-xs font-medium text-stone-500">meses</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Base do algoritmo preditivo
          </span>
        </div>
      </div>

      {/* Chart View Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
          <button
            type="button"
            onClick={() => setChartType('bars')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              chartType === 'bars'
                ? 'bg-white text-rose-600 shadow-xs font-bold'
                : 'hover:text-stone-900'
            }`}
          >
            Barras & Média
          </button>
          <button
            type="button"
            onClick={() => setChartType('trend')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              chartType === 'trend'
                ? 'bg-white text-rose-600 shadow-xs font-bold'
                : 'hover:text-stone-900'
            }`}
          >
            Linha de Tendência
          </button>
          <button
            type="button"
            onClick={() => setChartType('phases')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              chartType === 'phases'
                ? 'bg-white text-rose-600 shadow-xs font-bold'
                : 'hover:text-stone-900'
            }`}
          >
            Fases Biológicas
          </button>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
            Duração do Ciclo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-rose-400 border-b border-dashed border-rose-500 inline-block"></span>
            Média ({stats.averageLength}d)
          </span>
        </div>
      </div>

      {/* Recharts Main Graph Container */}
      <div className="w-full h-[290px] sm:h-[340px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bars' ? (
            <BarChart
              data={stats.chartData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="cycleLabel"
                stroke="#78716c"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <YAxis
                domain={[18, (dataMax: number) => Math.max(36, dataMax + 2)]}
                stroke="#78716c"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit=" d"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={stats.averageLength}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Média: ${stats.averageLength}d`,
                  fill: '#e11d48',
                  fontSize: 11,
                  position: 'insideTopRight',
                  fontWeight: 600,
                }}
              />
              <ReferenceLine
                y={28}
                stroke="#cbd5e1"
                strokeDasharray="2 2"
                label={{ value: 'Referência (28d)', fill: '#94a3b8', fontSize: 10, position: 'insideBottomLeft' }}
              />
              <Bar
                dataKey="lengthDays"
                name="Duração em Dias"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              >
                {stats.chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isRegular ? '#f43f5e' : '#fb7185'}
                    className="transition-colors hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          ) : chartType === 'trend' ? (
            <LineChart
              data={stats.chartData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="cycleLabel"
                stroke="#78716c"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <YAxis
                domain={[18, (dataMax: number) => Math.max(36, dataMax + 2)]}
                stroke="#78716c"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                unit=" d"
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={stats.averageLength}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{ value: `Média (${stats.averageLength}d)`, fill: '#e11d48', fontSize: 11, position: 'insideTopRight' }}
              />
              <Line
                type="monotone"
                dataKey="lengthDays"
                name="Duração"
                stroke="#e11d48"
                strokeWidth={3}
                dot={{ r: 6, fill: '#e11d48', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 8, fill: '#be123c' }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={stats.chartData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="cycleLabel" stroke="#78716c" fontSize={12} tickLine={false} />
              <YAxis domain={[0, (dataMax: number) => Math.max(36, dataMax + 2)]} stroke="#78716c" fontSize={12} unit=" d" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="periodDays" name="Menstruação (dias)" stackId="a" fill="#fda4af" radius={[0, 0, 0, 0]} />
              <Bar dataKey="ovulationDay" name="Janela Pré-Ovulatória" stackId="a" fill="#fed7aa" radius={[0, 0, 0, 0]} />
              <Bar dataKey="lengthDays" name="Fase Lútea & Total" stackId="a" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Explanation Banner & Clinical Interpretation */}
      <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200/60 text-xs text-stone-700 space-y-2">
        <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
          <Activity className="w-4 h-4 text-rose-600" />
          <span>Interpretação Clínica de Regularidade (Critérios FIGO)</span>
        </div>
        <p className="leading-relaxed">
          {stats.regularityDescription}
        </p>
        <div className="pt-1 flex flex-wrap gap-2 text-[11px] text-stone-500">
          <span className="bg-white px-2.5 py-1 rounded-md border border-rose-200/50 font-medium">
            Média: <strong className="text-stone-800">{stats.averageLength} dias</strong>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-rose-200/50 font-medium">
            Desvio: <strong className="text-stone-800">±{stats.stdDev} dias</strong>
          </span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-rose-200/50 font-medium">
            Intervalo seguro: <strong className="text-stone-800">21 a 35 dias</strong>
          </span>
        </div>
      </div>

      {/* History editor / management table */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-stone-500" />
          Gerenciar Histórico de Ciclos
        </h3>
        
        {/* Quick add form */}
        <form onSubmit={handleAddCycle} className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative">
            <input
              id="new-cycle-input"
              type="number"
              min="18"
              max="55"
              placeholder="Ex: 28"
              value={newCycleInput}
              onChange={(e) => {
                setNewCycleInput(e.target.value);
                setInputError(null);
              }}
              className="w-32 px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden"
            />
            <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">dias</span>
          </div>

          <button
            id="btn-add-cycle-history"
            type="submit"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Ciclo</span>
          </button>

          {inputError && (
            <span className="text-xs text-rose-600 font-medium w-full">{inputError}</span>
          )}
        </form>

        {/* Existing cycle pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {(settings.cycleHistory || []).map((len, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-2 bg-stone-100 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 transition"
            >
              <span>{idx === (settings.cycleHistory || []).length - 1 ? 'Ciclo Atual' : `Ciclo ${idx + 1}`}: <strong>{len}d</strong></span>
              {onUpdateHistory && (
                <button
                  type="button"
                  title="Remover ciclo"
                  onClick={() => handleRemoveCycle(idx)}
                  className="text-stone-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
