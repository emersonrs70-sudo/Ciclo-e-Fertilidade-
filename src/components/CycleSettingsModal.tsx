import React, { useState } from 'react';
import { X, Settings, Calendar, RefreshCw, CheckCircle, Info, Plus, Trash2 } from 'lucide-react';
import { CycleSettings } from '../types';
import { calculateCycleMetrics } from '../utils/cycleCalculations';

interface CycleSettingsModalProps {
  isOpen: boolean;
  settings: CycleSettings;
  onClose: () => void;
  onSave: (newSettings: CycleSettings) => void;
}

export const CycleSettingsModal: React.FC<CycleSettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave,
}) => {
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState(settings.lastPeriodStartDate);
  const [cycleLengthDays, setCycleLengthDays] = useState(settings.cycleLengthDays);
  const [periodLengthDays, setPeriodLengthDays] = useState(settings.periodLengthDays);
  const [lutealPhaseDays, setLutealPhaseDays] = useState(settings.lutealPhaseDays);
  const [cycleHistory, setCycleHistory] = useState<number[]>(settings.cycleHistory || [28]);
  const [newPastCycleInput, setNewPastCycleInput] = useState('');
  const [userGoal, setUserGoal] = useState(settings.userGoal || 'prevent_pregnancy');

  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 70) {
      onClose();
    }
    touchStartY.current = null;
  };

  if (!isOpen) return null;

  const handleAddHistory = () => {
    const val = parseInt(newPastCycleInput, 10);
    if (!isNaN(val) && val >= 18 && val <= 60) {
      setCycleHistory([...cycleHistory, val]);
      setNewPastCycleInput('');
    }
  };

  const handleRemoveHistory = (index: number) => {
    setCycleHistory(cycleHistory.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      lastPeriodStartDate,
      cycleLengthDays: Math.max(20, Math.min(50, cycleLengthDays)),
      periodLengthDays: Math.max(2, Math.min(10, periodLengthDays)),
      lutealPhaseDays: Math.max(10, Math.min(16, lutealPhaseDays)),
      cycleHistory: cycleHistory.length > 0 ? cycleHistory : [cycleLengthDays],
      userGoal,
    });
    onClose();
  };

  // Preview metrics
  const previewMetrics = calculateCycleMetrics({
    ...settings,
    cycleLengthDays,
    cycleHistory: cycleHistory.length > 0 ? cycleHistory : [cycleLengthDays],
    lutealPhaseDays,
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="cycle-settings-modal-content"
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] pb-safe animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
      >
        {/* Mobile Pull-down handle */}
        <div 
          className="sm:hidden pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
        </div>

        <div 
          className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 bg-rose-50/40 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-700 shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Calibração do Ciclo
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Ajuste os parâmetros biológicos para previsões exatas
              </p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-sm text-stone-800">
          {/* Objetivo */}
          <div>
            <label className="font-bold text-stone-900 block mb-2">
              Seu Objetivo Principal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'prevent_pregnancy', label: 'Evitar Gravidez', desc: 'Foco em datas seguras' },
                { id: 'conceive', label: 'Planejar Gestação', desc: 'Foco no ápice fértil' },
                { id: 'track_health', label: 'Monitorar Saúde', desc: 'Acompanhamento geral' },
              ].map((goal) => (
                <button
                  type="button"
                  key={goal.id}
                  onClick={() => setUserGoal(goal.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    userGoal === goal.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 hover:bg-rose-50 text-stone-700 border-stone-200'
                  }`}
                >
                  <div className="font-bold text-xs">{goal.label}</div>
                  <div className={`text-[10px] ${userGoal === goal.id ? 'text-rose-100' : 'text-stone-400'}`}>
                    {goal.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DUM: Data da Última Menstruação */}
          <div>
            <label className="font-bold text-stone-900 flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>Data de Início da Última Menstruação (DUM)</span>
            </label>
            <input
              id="dum-input"
              type="date"
              required
              value={lastPeriodStartDate}
              onChange={(e) => setLastPeriodStartDate(e.target.value)}
              className="w-full px-3 py-2.5 text-base sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />
            <span className="text-[11px] text-stone-500 mt-1 block">
              O primeiro dia em que você notou sangramento vermelho vivo.
            </span>
          </div>

          {/* Sliders: Duração média do ciclo & menstruação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-800">
                  Duração Média do Ciclo
                </label>
                <span className="font-mono text-xs font-bold text-rose-600 px-2 py-0.5 bg-white rounded-md border border-rose-200">
                  {cycleLengthDays} dias
                </span>
              </div>
              <input
                type="range"
                min={21}
                max={45}
                value={cycleLengthDays}
                onChange={(e) => setCycleLengthDays(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <span className="text-[10px] text-stone-400 block">
                Padrão normal varia de 24 a 35 dias
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-800">
                  Duração do Sangramento
                </label>
                <span className="font-mono text-xs font-bold text-red-600 px-2 py-0.5 bg-white rounded-md border border-red-200">
                  {periodLengthDays} dias
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={9}
                value={periodLengthDays}
                onChange={(e) => setPeriodLengthDays(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <span className="text-[10px] text-stone-400 block">
                Normalmente dura entre 3 e 7 dias
              </span>
            </div>
          </div>

          {/* Histórico dos últimos ciclos para regularidade estatística */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900 block">
                Histórico de Ciclos Recentes (Para Análise de Regularidade)
              </label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${previewMetrics.regularityBadgeColor}`}>
                {previewMetrics.regularity}
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Insira a duração em dias dos seus últimos ciclos conhecidos (ex: 28, 27, 30). O algoritmo calcula o desvio padrão e ajusta a margem de segurança.
            </p>

            <div className="flex flex-wrap gap-2">
              {cycleHistory.map((len, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-mono font-medium shadow-2xs"
                >
                  <span>{len}d</span>
                  {cycleHistory.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHistory(idx)}
                      className="text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="past-cycle-input"
                type="number"
                min={18}
                max={60}
                placeholder="Ex: 29"
                value={newPastCycleInput}
                onChange={(e) => setNewPastCycleInput(e.target.value)}
                className="w-24 px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 bg-white font-mono"
              />
              <button
                type="button"
                id="add-cycle-history-btn"
                onClick={handleAddHistory}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Ciclo</span>
              </button>
            </div>
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-stone-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>
              Com base nestes dados, o dia da ovulação estimada será o <strong>Dia {previewMetrics.ovulationCycleDay}</strong> do ciclo, e a margem de segurança foi ajustada para ±{previewMetrics.safetyMarginBonus + 1} dias adicionais.
            </p>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
            <button
              type="button"
              id="cancel-settings-btn"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl min-h-[44px] flex items-center justify-center active:scale-95 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="save-settings-btn"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-sm shadow-rose-200 min-h-[44px] flex items-center justify-center transition-all"
            >
              Salvar Calibração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
