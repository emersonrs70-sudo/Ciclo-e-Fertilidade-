import React from 'react';
import { 
  Calendar, 
  BarChart3, 
  Bell, 
  Sparkles, 
  Settings, 
  Plus, 
  HelpCircle,
  Keyboard,
  ShieldCheck
} from 'lucide-react';
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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-rose-100 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-rose-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight leading-none">
                Ciclo & Fertilidade
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                Dia {todayStatus.dayOfCycle} do ciclo
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              Monitoramento biológico, sintotérmico e planejamento
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl">
          <button
            id="nav-tab-calendar"
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendário</span>
          </button>

          <button
            id="nav-tab-statistics"
            onClick={() => setActiveTab('statistics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'statistics'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Estatísticas & Recharts</span>
          </button>

          <button
            id="nav-tab-reminders"
            onClick={() => setActiveTab('reminders')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'reminders'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Lembretes</span>
          </button>

          <button
            id="nav-tab-tips"
            onClick={() => setActiveTab('tips')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dicas & IA</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Log Button (Desktop) */}
          <button
            id="header-quick-log-btn"
            onClick={onOpenLogModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Registrar sintomas de hoje (F2)"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Hoje</span>
          </button>

          {/* Settings Button */}
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 hover:bg-stone-100 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Calibrar ciclo e parâmetros (F3)"
          >
            <Settings className="w-4 h-4 text-stone-600" />
            <span className="hidden lg:inline">Calibrar Ciclo</span>
          </button>

          {/* Tour Button */}
          <button
            id="header-tour-btn"
            onClick={onStartTour}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Tour guiado interativo (F4)"
          >
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span className="hidden lg:inline">Tour Guiado</span>
          </button>

          {/* Keyboard Shortcuts Button */}
          {onOpenShortcuts && (
            <button
              id="header-shortcuts-btn"
              onClick={onOpenShortcuts}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition cursor-pointer"
              title="Atalhos de teclado e gestos (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
