import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Heart, 
  Thermometer, 
  Droplet, 
  ShieldAlert, 
  Edit3,
  CalendarDays
} from 'lucide-react';
import { CycleSettings, DailyLog, DayFertilityStatus } from '../types';
import { getMonthDaysMatrix, parseISODate, formatISODate } from '../utils/cycleCalculations';

interface CalendarViewProps {
  settings: CycleSettings;
  logsMap: Record<string, DailyLog>;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onOpenLogModal: (dateStr?: string) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  settings,
  logsMap,
  selectedDate,
  onSelectDate,
  onOpenLogModal,
}) => {
  const initialDate = parseISODate(selectedDate || formatISODate(new Date()));
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [slideAnim, setSlideAnim] = useState<'left' | 'right' | null>(null);

  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const days = getMonthDaysMatrix(currentYear, currentMonth, settings, logsMap);

  const handlePrevMonth = () => {
    setSlideAnim('right');
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setTimeout(() => setSlideAnim(null), 250);
  };

  const handleNextMonth = () => {
    setSlideAnim('left');
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setTimeout(() => setSlideAnim(null), 250);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    onSelectDate(formatISODate(now));
  };

  // Touch swipe handling for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum swipe threshold of 45px and predominantly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped left -> Next month
        handleNextMonth();
      } else {
        // Swiped right -> Previous month
        handlePrevMonth();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Find currently selected day status
  const selectedDayStatus = days.find((d) => d.date === selectedDate) || 
    days.find((d) => d.isToday) || days[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Calendar Header Card */}
      <div 
        className="bg-white rounded-2xl border border-stone-200 shadow-sm p-3.5 sm:p-6"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-rose-50 rounded-xl text-rose-600 border border-rose-100 shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 capitalize">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Ciclo de {settings.cycleLengthDays} dias • Ovulação estimada: dia {settings.cycleLengthDays - settings.lutealPhaseDays}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pt-1 sm:pt-0">
            {/* Mobile gesture hint */}
            <span className="sm:hidden text-[10px] text-stone-400 font-medium flex items-center gap-1">
              <span>👈 Deslize para o mês 👉</span>
            </span>

            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <button
                id="calendar-prev-month"
                onClick={handlePrevMonth}
                className="p-2.5 sm:p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 active:scale-90 hover:text-stone-900 transition-all touch-manipulation min-w-[42px] min-h-[42px] flex items-center justify-center"
                title="Mês anterior (ou tecla ←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="calendar-today-btn"
                onClick={handleToday}
                className="px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 active:scale-95 rounded-xl transition-all touch-manipulation min-h-[42px] sm:min-h-[36px] flex items-center justify-center"
                title="Ir para hoje (ou tecla H)"
              >
                Hoje
              </button>
              <button
                id="calendar-next-month"
                onClick={handleNextMonth}
                className="p-2.5 sm:p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 active:scale-90 hover:text-stone-900 transition-all touch-manipulation min-w-[42px] min-h-[42px] flex items-center justify-center"
                title="Próximo mês (ou tecla →)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-3 sm:mt-4 text-center">
          {WEEK_DAYS.map((wd, i) => (
            <div
              key={wd}
              className={`text-[11px] sm:text-xs font-semibold py-1 ${
                i === 0 || i === 6 ? 'text-rose-500/80' : 'text-stone-500'
              }`}
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Month Grid with Slide Animation */}
        <div 
          className={`grid grid-cols-7 gap-1 sm:gap-2 mt-1 select-none ${
            slideAnim === 'left' ? 'animate-slide-left' : slideAnim === 'right' ? 'animate-slide-right' : ''
          }`}
        >
          {days.map((item) => {
            const isSelected = item.date === selectedDate;
            const isCurrentMonth = item.month === currentMonth;
            const log = item.log;

            return (
              <div
                key={item.date}
                id={`calendar-day-${item.date}`}
                onClick={() => onSelectDate(item.date)}
                className={`group relative min-h-[76px] sm:min-h-[92px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  item.riskColor.bg
                } ${item.riskColor.border} ${
                  isSelected ? 'ring-2 ring-stone-900 ring-offset-2 shadow-md' : 'hover:shadow-sm'
                } ${!isCurrentMonth ? 'opacity-40 grayscale-[20%]' : 'opacity-100'}`}
              >
                {/* Day Number and Cycle Day badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold rounded-full w-6 h-6 ${
                      item.isToday
                        ? 'bg-stone-900 text-white shadow-xs'
                        : isSelected
                        ? 'bg-rose-600 text-white'
                        : 'text-stone-800'
                    }`}
                  >
                    {item.dayNumber}
                  </span>

                  <span className="text-[10px] font-semibold text-stone-500">
                    D{item.dayOfCycle}
                  </span>
                </div>

                {/* Center Visual Phase Indicators */}
                <div className="my-1 flex flex-wrap items-center gap-1">
                  {item.phase === 'ovulation' && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded bg-rose-600 text-white shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span className="hidden sm:inline">Ovulação</span>
                    </span>
                  )}
                  {item.phase === 'fertile_window' && (
                    <span className="text-[9px] font-semibold text-purple-800 hidden sm:inline">
                      Fértil
                    </span>
                  )}
                  {item.phase === 'menstrual' && (
                    <span className="text-[9px] font-semibold text-red-700 hidden sm:inline">
                      Menstruação
                    </span>
                  )}
                  {item.phase === 'luteal_low_risk' && (
                    <span className="text-[9px] font-semibold text-emerald-800 hidden sm:inline">
                      Infértil
                    </span>
                  )}
                </div>

                {/* Bottom Badges for logged items */}
                <div className="flex items-center gap-1 text-[10px] text-stone-600 overflow-hidden">
                  {log?.intercourse && log.intercourse !== 'none' && (
                    <span 
                      title={`Relação sexual: ${log.intercourse === 'protected' ? 'Com camisinha' : 'Desprotegida'}`}
                      className="p-0.5 rounded bg-pink-100 text-pink-700"
                    >
                      <Heart className="w-2.5 h-2.5 fill-pink-600 text-pink-600" />
                    </span>
                  )}
                  {log?.bbt && (
                    <span 
                      title={`Temperatura Basal: ${log.bbt}°C`}
                      className="p-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px]"
                    >
                      {log.bbt}°
                    </span>
                  )}
                  {log?.mucus && (
                    <span 
                      title={`Muco: ${log.mucus}`}
                      className={`p-0.5 rounded ${log.mucus === 'egg_white' ? 'bg-purple-200 text-purple-900 font-bold' : 'bg-blue-100 text-blue-700'}`}
                    >
                      <Droplet className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {log?.flow && log.flow !== 'none' && (
                    <span 
                      title={`Fluxo: ${log.flow}`}
                      className="w-1.5 h-1.5 rounded-full bg-red-600"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
            Legenda de Fertilidade & Probabilidade Biológica
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50/80 border border-red-200">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
              <div>
                <strong className="text-red-950 block">Menstruação</strong>
                <span className="text-[11px] text-stone-500">Sangramento ativo</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <div>
                <strong className="text-emerald-950 block">Baixa Probabilidade</strong>
                <span className="text-[11px] text-stone-500">Fase Segura Natural</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/80 border border-amber-200">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <div>
                <strong className="text-amber-950 block">Margem Segurança</strong>
                <span className="text-[11px] text-stone-500">Variações hormonais</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50/80 border border-purple-200">
              <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0" />
              <div>
                <strong className="text-purple-950 block">Janela Fértil</strong>
                <span className="text-[11px] text-stone-500">Alto risco de gravidez</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50/80 border border-rose-300">
              <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0" />
              <div>
                <strong className="text-rose-950 block">Dia da Ovulação</strong>
                <span className="text-[11px] text-stone-500">Ápice da fertilidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Details Card */}
      {selectedDayStatus && (
        <div 
          id="selected-day-details-card"
          className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800">
                  Data: {selectedDayStatus.date}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Dia {selectedDayStatus.dayOfCycle} do ciclo
                </span>
                {selectedDayStatus.isToday && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-900 text-white">
                    Hoje
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-stone-900 mt-1">
                {selectedDayStatus.riskTitle}
              </h3>
            </div>

            <button
              id="selected-day-log-btn"
              onClick={() => onOpenLogModal(selectedDayStatus.date)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>{selectedDayStatus.hasLog ? 'Editar Registro' : 'Anotar Sintomas deste Dia'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs sm:text-sm text-stone-700">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
              <strong className="text-stone-900 block mb-1">Recomendação de Planejamento:</strong>
              <p className="leading-relaxed text-stone-600">
                {selectedDayStatus.recommendation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
              <strong className="text-stone-900 block mb-1">Fisiologia do Dia:</strong>
              <p className="leading-relaxed text-stone-600">
                {selectedDayStatus.biologicalExplanation}
              </p>
            </div>
          </div>

          {/* If there is a log for this day, show recorded details */}
          {selectedDayStatus.log && (
            <div className="mt-4 pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Dados Registrados para este dia:
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedDayStatus.log.flow && selectedDayStatus.log.flow !== 'none' && (
                  <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    Fluxo: <strong>{selectedDayStatus.log.flow}</strong>
                  </span>
                )}
                {selectedDayStatus.log.bbt && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                    Temperatura: <strong>{selectedDayStatus.log.bbt} °C</strong>
                  </span>
                )}
                {selectedDayStatus.log.mucus && (
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                    Muco Cervical: <strong>{selectedDayStatus.log.mucus}</strong>
                  </span>
                )}
                {selectedDayStatus.log.intercourse && selectedDayStatus.log.intercourse !== 'none' && (
                  <span className="px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 border border-pink-200">
                    Sexo: <strong>{selectedDayStatus.log.intercourse === 'protected' ? 'Com preservativo' : selectedDayStatus.log.intercourse === 'unprotected' ? 'Desprotegido' : 'Coito interrompido'}</strong>
                  </span>
                )}
                {selectedDayStatus.log.emergencyPill && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold">
                    ⚠️ Pílula do dia seguinte tomada
                  </span>
                )}
                {selectedDayStatus.log.symptoms && selectedDayStatus.log.symptoms.length > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                    Sintomas: {selectedDayStatus.log.symptoms.join(', ')}
                  </span>
                )}
                {selectedDayStatus.log.notes && (
                  <p className="w-full mt-2 text-stone-600 italic bg-stone-50 p-2 rounded-lg border border-stone-200">
                    "{selectedDayStatus.log.notes}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
