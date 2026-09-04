import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Thermometer, 
  Droplet, 
  Heart, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { DailyLog, MenstrualFlow, CervicalMucus, LHTestResult, IntercourseType } from '../types';

interface DailyLogModalProps {
  isOpen: boolean;
  dateStr: string;
  existingLog?: DailyLog;
  onClose: () => void;
  onSave: (log: DailyLog) => void;
  onDelete: (dateStr: string) => void;
}

const SYMPTOM_OPTIONS = [
  'Cólicas menstruais',
  'Sensibilidade nos seios',
  'Inchaço abdominal',
  'Dor de cabeça',
  'Cansaço / Fadiga',
  'Acne',
  'Aumento da libido',
  'Mudanças de humor',
];

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  dateStr,
  existingLog,
  onClose,
  onSave,
  onDelete,
}) => {
  const [flow, setFlow] = useState<MenstrualFlow>('none');
  const [bbt, setBbt] = useState<string>('');
  const [mucus, setMucus] = useState<CervicalMucus>('dry');
  const [lhTest, setLhTest] = useState<LHTestResult>('none');
  const [intercourse, setIntercourse] = useState<IntercourseType>('none');
  const [emergencyPill, setEmergencyPill] = useState<boolean>(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (existingLog) {
      setFlow(existingLog.flow || 'none');
      setBbt(existingLog.bbt ? String(existingLog.bbt) : '');
      setMucus(existingLog.mucus || 'dry');
      setLhTest(existingLog.lhTest || 'none');
      setIntercourse(existingLog.intercourse || 'none');
      setEmergencyPill(!!existingLog.emergencyPill);
      setSymptoms(existingLog.symptoms || []);
      setNotes(existingLog.notes || '');
    } else {
      setFlow('none');
      setBbt('');
      setMucus('dry');
      setLhTest('none');
      setIntercourse('none');
      setEmergencyPill(false);
      setSymptoms([]);
      setNotes('');
    }
  }, [existingLog, dateStr, isOpen]);

  if (!isOpen) return null;

  const handleToggleSymptom = (sym: string) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBbt = bbt ? parseFloat(bbt.replace(',', '.')) : undefined;

    const newLog: DailyLog = {
      date: dateStr,
      flow,
      bbt: parsedBbt,
      mucus,
      lhTest,
      intercourse,
      emergencyPill,
      symptoms,
      moods: [],
      notes,
    };

    onSave(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-rose-100 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Registrar Sintomas
              </h2>
              <p className="text-xs text-stone-500">Data: {dateStr}</p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Flow Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Fluxo Menstrual
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'none', label: 'Nenhum' },
                { id: 'spotting', label: 'Escape' },
                { id: 'light', label: 'Leve' },
                { id: 'medium', label: 'Médio' },
                { id: 'heavy', label: 'Intenso' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFlow(item.id as MenstrualFlow)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    flow === item.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* BBT Basal Temperature */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-500" />
              Temperatura Basal (°C)
            </label>
            <input
              type="text"
              placeholder="Ex: 36.45"
              value={bbt}
              onChange={(e) => setBbt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          {/* Cervical Mucus */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-teal-500" />
              Muco Cervical
            </label>
            <select
              value={mucus}
              onChange={(e) => setMucus(e.target.value as CervicalMucus)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            >
              <option value="dry">Seco / Ausente (Infértil)</option>
              <option value="sticky">Pegajoso / Espesso</option>
              <option value="creamy">Cremoso (Transição)</option>
              <option value="egg_white">Clara de Ovo (Máxima Fertilidade)</option>
              <option value="watery">Aquoso / Fluido</option>
            </select>
          </div>

          {/* LH Test */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Teste de Ovulação (LH)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Não Feito' },
                { id: 'negative', label: 'Negativo' },
                { id: 'positive', label: 'Positivo (Pico)' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setLhTest(item.id as LHTestResult)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    lhTest === item.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Intercourse */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Relação Sexual
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Nenhuma' },
                { id: 'protected', label: 'Com Preservativo' },
                { id: 'unprotected', label: 'Desprotegida' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setIntercourse(item.id as IntercourseType)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    intercourse === item.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              Sintomas e Sensações
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isSelected = symptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => handleToggleSymptom(sym)}
                    className={`p-2 rounded-xl text-xs text-left font-medium border transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block">
              Anotações Pessoais
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Dormi tarde, esqueci de medir a temperatura no mesmo horário..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
            {existingLog ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(dateStr);
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Excluir anotações desta data"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                <span>Salvar Registro</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
