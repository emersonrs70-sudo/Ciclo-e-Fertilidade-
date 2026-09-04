import React from 'react';
import { Calendar, BarChart3, Bell, HelpCircle, Settings, Heart, Compass, Keyboard } from 'lucide-react';
import { CycleSettings, DayFertilityStatus } from '../types';

interface HeaderProps {
  activeTab: 'calendar' | 'statistics' | 'reminders' | 'tips';
  setActiveTab: (tab: 'calendar' | 'statistics' | 'reminders' | 'tips') => void;
  settings: CycleSettings;
  todayStatus: DayFertilityStatus;
  onOpenSettings: () => void;
  onOpenLogModal: () => void;
  onStartTour: () => void;
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  todayStatus,
  onOpenSettings,
  onOpenLogModal,
  onStartTour,
  onOpenShortcuts,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-30 transition-all pt-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center shadow-sm shadow-rose-200 shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/80" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg md:text-xl text-stone-900 tracking-tight">
                  Ciclo & Fertilidade
                </span>
                <span className="hidden sm:inline-flex text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Saúde Reprodutiva
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block">
                Monitoramento biológico, probabilidade gestacional e bem-estar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {onOpenShortcuts && (
              <button
                id="header-shortcuts-btn"
                onClick={onOpenShortcuts}
                className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 rounded-xl transition-all min-h-[38px] sm:min-h-auto touch-manipulation active:scale-95"
                title="Ver teclas de função (F1-F4) e gestos mobile (ou aperte ?)"
              >
                <Keyboard className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Teclas & Gestos</span>
              </button>
            )}

            <button
              id="header-tour-btn"
              onClick={onStartTour}
              className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-2xs hover:shadow-xs min-h-[38px] sm:min-h-auto touch-manipulation active:scale-95"
              title="Iniciar tutorial interativo das ferramentas do app (F4)"
            >
              <Compass className="w-3.5 h-3.5 text-rose-600 animate-spin-slow" />
              <span className="hidden sm:inline">Tour Guiado</span>
            </button>

            <div 
              onClick={onOpenLogModal}
              className="cursor-pointer hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors"
              title="Clique para registrar os dados de hoje"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${todayStatus.riskColor.dot} animate-pulse`} />
              <span className="text-xs text-stone-700 font-medium">
                Hoje: <strong className="text-stone-900">{todayStatus.riskBadge}</strong> (Dia {todayStatus.dayOfCycle})
              </span>
            </div>

            <button
              id="header-settings-btn"
              onClick={onOpenSettings}
              className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-rose-50 hover:text-rose-700 border border-stone-200 rounded-xl transition-colors min-h-[38px] sm:min-h-auto touch-manipulation active:scale-95"
              title="Ajustar dados do ciclo (F3)"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Calibrar Ciclo ({settings.cycleLengthDays}d)</span>
              <span className="hidden sm:inline md:hidden">Ciclo</span>
            </button>

            <button
              id="header-quick-log-btn"
              onClick={onOpenLogModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-sm shadow-rose-200 transition-all touch-manipulation active:scale-95"
              title="Registrar sintomas de hoje (F2)"
            >
              <span className="text-sm leading-none">+</span>
              <span>Registrar Hoje</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Visible on Tablet & Desktop; Mobile uses Ergonomic Bottom Nav) */}
        <div className="hidden md:flex items-center space-x-1 sm:space-x-2 border-t border-rose-50 py-2 overflow-x-auto no-scrollbar">
          <button
            id="nav-tab-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'calendar'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendário & Diário</span>
          </button>

          <button
            id="nav-tab-statistics"
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'statistics'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Estatísticas de Fertilidade</span>
          </button>

          <button
            id="nav-tab-reminders"
            onClick={() => setActiveTab('reminders')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'reminders'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Lembretes Diários</span>
          </button>

          <button
            id="nav-tab-tips"
            onClick={() => setActiveTab('tips')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'tips'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-rose-50/60'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Dicas & Tira-Dúvidas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
