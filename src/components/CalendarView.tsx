import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Droplet, 
  Thermometer, 
  Heart, 
  Sparkles,
  Plus,
  Info,
  Clock
} from 'lucide-react';
import { CycleSettings, DailyLog } from '../types';
import { formatISODate, parseISODate, getDayFertilityStatus } from '../utils/cycleCalculations';

interface CalendarViewProps {
  settings: CycleSettings;
  logsMap: Record<string, DailyLog>;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onOpenLogModal: (dateStr: string) => void;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  settings,
  logsMap,
  selectedDate,
  onSelectDate,
  onOpenLogModal,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  // Touch Swipe navigation state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextMonth();
    } else if (isRightSwipe) {
      handlePrevMonth();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(formatISODate(today));
  };

  // Calendar grid computation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days array
  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(new Date(year, month, day));
  }

  const selectedStatus = getDayFertilityStatus(parseISODate(selectedDate), settings, logsMap);

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-stone-900">
            {MONTH_NAMES[month]} {year}
          </h2>
          <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
            Navegue ou deslize lateralmente
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
          >
            Hoje
          </button>
          <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white transition cursor-pointer"
              title="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white transition cursor-pointer"
              title="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols on lg) */}
        <div 
          className="lg:col-span-2 bg-white rounded-2xl border border-rose-100 p-4 sm:p-6 shadow-xs select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-stone-400 pb-3 border-b border-stone-100">
            {WEEKDAYS.map((wd, i) => (
              <div key={wd} className={i === 0 || i === 6 ? 'text-rose-400' : ''}>
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-3">
            {calendarCells.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="h-16 sm:h-20" />;
              }

              const dateStr = formatISODate(date);
              const isSelected = dateStr === selectedDate;
              const status = getDayFertilityStatus(date, settings, logsMap);
              const log = logsMap[dateStr];

              // Color indicators
              let bgColor = 'bg-stone-50/70 hover:bg-rose-50/50';
              let borderColor = 'border-stone-100';
              let textColor = 'text-stone-700';

              if (status.isMenstruationDay) {
                bgColor = 'bg-rose-100/70 hover:bg-rose-200/70 text-rose-950';
                borderColor = 'border-rose-200';
              } else if (status.isOvulationDay) {
                bgColor = 'bg-rose-500 text-white hover:bg-rose-600 font-bold';
                borderColor = 'border-rose-600';
                textColor = 'text-white';
              } else if (status.isFertileDay) {
                bgColor = 'bg-orange-100/70 hover:bg-orange-200/70 text-orange-950';
                borderColor = 'border-orange-200';
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => onSelectDate(dateStr)}
                  className={`relative h-16 sm:h-20 rounded-xl p-1.5 flex flex-col justify-between border transition-all text-left cursor-pointer ${bgColor} ${borderColor} ${
                    isSelected ? 'ring-2 ring-rose-600 shadow-sm z-10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs sm:text-sm font-bold ${textColor}`}>
                      {date.getDate()}
                    </span>
                    {status.isToday && (
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    )}
                  </div>

                  {/* Day marker label */}
                  <div className="text-[9px] sm:text-[10px] leading-tight truncate font-semibold">
                    {status.isOvulationDay ? (
                      <span className="text-white">Ovulação</span>
                    ) : status.isMenstruationDay ? (
                      <span className="text-rose-700">Fluxo</span>
                    ) : status.isFertileDay ? (
                      <span className="text-orange-700">Fértil</span>
                    ) : (
                      <span className="text-stone-400">Dia {status.dayOfCycle}</span>
                    )}
                  </div>

                  {/* Mini logged icons */}
                  <div className="flex items-center gap-1 text-[10px] overflow-hidden">
                    {log?.bbt && (
                      <span className="text-rose-600 font-mono text-[9px] font-bold">
                        {log.bbt}°
                      </span>
                    )}
                    {log?.mucus === 'egg_white' && (
                      <span title="Muco Clara de Ovo" className="text-teal-600">💧</span>
                    )}
                    {log?.intercourse && log.intercourse !== 'none' && (
                      <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-5 mt-4 border-t border-stone-100 text-xs text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-rose-200"></span>
              Menstruação
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-orange-100 border border-orange-200"></span>
              Janela Fértil
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-500"></span>
              Ovulação (Pico)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-stone-50 border border-stone-200"></span>
              Fase Infértil / Segura
            </span>
          </div>
        </div>

        {/* Selected Date Inspector Card */}
        <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-rose-100/60 pb-3">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block">
              Detalhes da Data
            </span>
            <h3 className="text-lg font-extrabold text-stone-900 mt-0.5">
              {parseISODate(selectedDate).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
            <p className="text-xs text-stone-500">
              Dia {selectedStatus.dayOfCycle} do seu ciclo menstrual
            </p>
          </div>

          {/* Clinical summary of day */}
          <div className="bg-rose-50/40 rounded-xl p-3.5 border border-rose-100 text-xs space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-rose-600" />
              <span>Diagnóstico: {selectedStatus.riskTitle}</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              {selectedStatus.clinicalAdvice}
            </p>
          </div>

          {/* Logged data if available */}
          {selectedStatus.log ? (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-800">Sintomas Registrados:</h4>
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/70 space-y-1.5">
                {selectedStatus.log.flow !== 'none' && (
                  <p><strong>Fluxo:</strong> {selectedStatus.log.flow}</p>
                )}
                {selectedStatus.log.bbt && (
                  <p><strong>Temperatura Basal:</strong> {selectedStatus.log.bbt} °C</p>
                )}
                {selectedStatus.log.mucus && (
                  <p><strong>Muco Cervical:</strong> {selectedStatus.log.mucus}</p>
                )}
                {selectedStatus.log.intercourse !== 'none' && (
                  <p><strong>Relação Sexual:</strong> {selectedStatus.log.intercourse === 'protected' ? 'Com preservativo' : 'Desprotegida'}</p>
                )}
                {selectedStatus.log.symptoms.length > 0 && (
                  <p><strong>Sintomas:</strong> {selectedStatus.log.symptoms.join(', ')}</p>
                )}
                {selectedStatus.log.notes && (
                  <p className="italic text-stone-500">"{selectedStatus.log.notes}"</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic">
              Nenhum sintoma anotado para esta data ainda.
            </p>
          )}

          {/* Log button */}
          <button
            onClick={() => onOpenLogModal(selectedDate)}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{selectedStatus.log ? 'Editar Anotações' : 'Anotar Sintomas deste Dia'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
