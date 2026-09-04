import React, { useState, useEffect } from 'react';
import { X, Droplet, Thermometer, Heart, Shield, Activity, Sparkles, Check } from 'lucide-react';
import { CervicalMucus, DailyLog, FlowIntensity, IntercourseType, LHTestResult } from '../types';

interface DailyLogModalProps {
  isOpen: boolean;
  dateStr: string;
  existingLog?: DailyLog;
  onClose: () => void;
  onSave: (log: DailyLog) => void;
  onDelete?: (dateStr: string) => void;
}

const COMMON_SYMPTOMS = [
  'Cólicas',
  'Inchaço abdominal',
  'Sensibilidade nos seios',
  'Dor de cabeça',
  'Acne / Oleosidade',
  'Cansaço',
  'Dor nas costas',
  'Desejo por doces',
];

const COMMON_MOODS = [
  'Tranquila',
  'Animada / Alegre',
  'Irritada',
  'Sensível / Ansiosa',
  'Libido Alta',
  'Libido Baixa',
  'Sonolência',
];

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  dateStr,
  existingLog,
  onClose,
  onSave,
  onDelete,
}) => {
  const [flow, setFlow] = useState<FlowIntensity>('none');
  const [bbt, setBbt] = useState<string>('');
  const [mucus, setMucus] = useState<CervicalMucus>('dry');
  const [lhTest, setLhTest] = useState<LHTestResult>('none');
  const [intercourse, setIntercourse] = useState<IntercourseType>('none');
  const [emergencyPill, setEmergencyPill] = useState<boolean>(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // If dragged down by more than 70px from header, close modal
    if (deltaY > 70) {
      onClose();
    }
    touchStartY.current = null;
  };

  useEffect(() => {
    if (existingLog) {
      setFlow(existingLog.flow || 'none');
      setBbt(existingLog.bbt ? String(existingLog.bbt) : '');
      setMucus(existingLog.mucus || 'dry');
      setLhTest(existingLog.lhTest || 'none');
      setIntercourse(existingLog.intercourse || 'none');
      setEmergencyPill(Boolean(existingLog.emergencyPill));
      setSelectedSymptoms(existingLog.symptoms || []);
      setSelectedMoods(existingLog.moods || []);
      setNotes(existingLog.notes || '');
    } else {
      setFlow('none');
      setBbt('');
      setMucus('dry');
      setLhTest('none');
      setIntercourse('none');
      setEmergencyPill(false);
      setSelectedSymptoms([]);
      setSelectedMoods([]);
      setNotes('');
    }
  }, [existingLog, dateStr, isOpen]);

  if (!isOpen) return null;

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const toggleMood = (m: string) => {
    setSelectedMoods((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBbt = bbt ? parseFloat(bbt.replace(',', '.')) : undefined;

    const log: DailyLog = {
      date: dateStr,
      flow,
      bbt: isNaN(parsedBbt as number) ? undefined : parsedBbt,
      mucus,
      lhTest,
      intercourse,
      emergencyPill,
      symptoms: selectedSymptoms,
      moods: selectedMoods,
      notes: notes.trim() || undefined,
    };

    onSave(log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="daily-log-modal-content"
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] pb-safe animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
      >
        {/* Mobile Pull-down handle to dismiss */}
        <div 
          className="sm:hidden pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Modal Header with touch dismiss support */}
        <div 
          className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 bg-rose-50/40 select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Registro Diário
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500">
              Data selecionada: <strong className="text-stone-800">{dateStr}</strong>
            </p>
          </div>
          <button
            id="close-daily-log-modal-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 flex-1 text-sm text-stone-800">
          {/* 1. Sangramento / Fluxo */}
          <div>
            <label className="font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Droplet className="w-4 h-4 text-red-600" />
              <span>Fluxo Menstrual</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(
                [
                  { value: 'none', label: 'Nenhum' },
                  { value: 'spotting', label: 'Escape / Spotting' },
                  { value: 'light', label: 'Leve' },
                  { value: 'medium', label: 'Moderado' },
                  { value: 'heavy', label: 'Intenso' },
                ] as const
              ).map((f) => (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => setFlow(f.value)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                    flow === f.value
                      ? 'bg-red-600 text-white border-red-600 font-bold shadow-xs'
                      : 'bg-stone-50 hover:bg-red-50/50 text-stone-700 border-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Marcadores Sintotérmicos: Muco Cervical & TCB */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Marcadores Sintotérmicos de Alta Precisão</span>
            </h3>

            {/* Muco Cervical */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Consistência do Muco Cervical
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'dry', label: 'Seco / Ausente', desc: 'Infértil' },
                  { value: 'sticky', label: 'Pegajoso / Espesso', desc: 'Baixa fertilidade' },
                  { value: 'creamy', label: 'Cremoso / Branco', desc: 'Transição' },
                  { value: 'egg_white', label: 'Clara de Ovo', desc: 'Ápice Fértil' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setMucus(item.value as CervicalMucus)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      mucus === item.value
                        ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                        : 'bg-white hover:bg-purple-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className={`text-[10px] ${mucus === item.value ? 'text-purple-100' : 'text-stone-400'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Temperatura Corporal Basal (TCB) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5 mb-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Temperatura Basal (°C)</span>
                </label>
                <div className="relative">
                  <input
                    id="bbt-input"
                    type="text"
                    placeholder="Ex: 36.45"
                    value={bbt}
                    onChange={(e) => setBbt(e.target.value)}
                    className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-stone-400">°C</span>
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Medida com termômetro basal ao acordar
                </span>
              </div>

              {/* Teste LH */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Teste de Ovulação na Urina (LH)
                </label>
                <select
                  id="lh-select"
                  value={lhTest}
                  onChange={(e) => setLhTest(e.target.value as LHTestResult)}
                  className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="none">Não realizado</option>
                  <option value="negative">Negativo (Sem pico de LH)</option>
                  <option value="positive">Positivo (Pico de LH detectado)</option>
                </select>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  Positivo indica ovulação em 24 a 36 horas
                </span>
              </div>
            </div>
          </div>

          {/* 3. Atividade Sexual & Contracepção */}
          <div>
            <label className="font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-pink-600" />
              <span>Atividade Sexual & Prevenção</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 'none', label: 'Nenhuma' },
                { value: 'protected', label: 'Com Preservativo' },
                { value: 'unprotected', label: 'Desprotegida' },
                { value: 'withdrawal', label: 'Coito Interrompido' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setIntercourse(item.value as IntercourseType)}
                  className={`p-2 text-xs font-medium rounded-xl border transition-all text-center ${
                    intercourse === item.value
                      ? 'bg-pink-600 text-white border-pink-600 font-bold shadow-xs'
                      : 'bg-stone-50 hover:bg-pink-50/50 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Pílula do dia seguinte toggle */}
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                <div>
                  <span className="text-xs font-bold text-rose-950 block">
                    Tomou Pílula do Dia Seguinte hoje?
                  </span>
                  <span className="text-[11px] text-rose-800">
                    Sinaliza contracepção hormonal de emergência no algoritmo
                  </span>
                </div>
              </div>
              <input
                id="emergency-pill-toggle"
                type="checkbox"
                checked={emergencyPill}
                onChange={(e) => setEmergencyPill(e.target.checked)}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Sintomas Físicos */}
          <div>
            <label className="font-bold text-stone-900 flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Sintomas Corporais</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 font-medium'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? `✓ ${sym}` : sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Humor */}
          <div>
            <label className="font-bold text-stone-900 block mb-2">
              Humor & Sensações
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_MOODS.map((mood) => {
                const isSelected = selectedMoods.includes(mood);
                return (
                  <button
                    type="button"
                    key={mood}
                    onClick={() => toggleMood(mood)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 font-medium'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-rose-50'
                    }`}
                  >
                    {isSelected ? `✓ ${mood}` : mood}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Notas Livres */}
          <div>
            <label className="font-bold text-stone-900 block mb-1.5">
              Observações Adicionais
            </label>
            <textarea
              id="daily-notes-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: dormi mal, tomei remédio, estresse no trabalho..."
              className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            {existingLog && onDelete ? (
              <button
                type="button"
                id="delete-daily-log-btn"
                onClick={() => {
                  if (confirm('Tem certeza que deseja apagar os registros deste dia?')) {
                    onDelete(dateStr);
                    onClose();
                  }
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-2 min-h-[44px] flex items-center"
              >
                Limpar registro
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="cancel-log-btn"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl min-h-[44px] flex items-center justify-center active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                id="save-daily-log-btn"
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-sm shadow-rose-200 flex items-center gap-1.5 min-h-[44px] transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Registro</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
