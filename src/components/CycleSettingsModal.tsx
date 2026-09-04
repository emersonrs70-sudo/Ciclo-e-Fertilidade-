import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Save, 
  Calendar, 
  Clock, 
  Target,
  Sparkles,
  Info
} from 'lucide-react';
import { CycleSettings, UserGoal } from '../types';

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
  const [userGoal, setUserGoal] = useState<UserGoal>(settings.userGoal);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      lastPeriodStartDate,
      cycleLengthDays: Number(cycleLengthDays),
      periodLengthDays: Number(periodLengthDays),
      lutealPhaseDays: Number(lutealPhaseDays),
      userGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-rose-100 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Calibrar Algoritmo do Ciclo
              </h2>
              <p className="text-xs text-stone-500">Ajuste os parâmetros fisiológicos básicos</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* User Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-600" />
              Objetivo Principal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'prevent_pregnancy', label: 'Evitar Gravidez' },
                { id: 'achieve_pregnancy', label: 'Engravidar' },
                { id: 'track_health', label: 'Saúde Geral' },
              ].map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => setUserGoal(g.id as UserGoal)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    userGoal === g.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* DUM Last Period Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-600" />
              Data da Última Menstruação (DUM - Dia 1)
            </label>
            <input
              type="date"
              value={lastPeriodStartDate}
              onChange={(e) => setLastPeriodStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Cycle Length */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" />
                Duração Média do Ciclo (dias)
              </label>
              <span className="text-sm font-bold text-rose-600">{cycleLengthDays} dias</span>
            </div>
            <input
              type="range"
              min="21"
              max="45"
              value={cycleLengthDays}
              onChange={(e) => setCycleLengthDays(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>21 dias</span>
              <span>28 dias (Padrão)</span>
              <span>45 dias</span>
            </div>
          </div>

          {/* Period Length */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700">
                Duração do Sangramento Menstrual (dias)
              </label>
              <span className="text-sm font-bold text-rose-600">{periodLengthDays} dias</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={periodLengthDays}
              onChange={(e) => setPeriodLengthDays(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Luteal Phase Length */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700">
                Fase Lútea Pós-Ovulatória (dias)
              </label>
              <span className="text-sm font-bold text-rose-600">{lutealPhaseDays} dias</span>
            </div>
            <input
              type="range"
              min="10"
              max="16"
              value={lutealPhaseDays}
              onChange={(e) => setLutealPhaseDays(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-stone-500">
              Geralmente constante em 14 dias para a maioria das mulheres.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Calibração</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
