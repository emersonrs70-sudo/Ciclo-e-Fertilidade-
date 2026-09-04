import React from 'react';
import { 
  Calendar, 
  BarChart3, 
  Plus, 
  Bell, 
  Sparkles,
  Keyboard
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'calendar' | 'statistics' | 'reminders' | 'tips';
  setActiveTab: (tab: 'calendar' | 'statistics' | 'reminders' | 'tips') => void;
  onOpenLogModal: () => void;
  onOpenShortcutsModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogModal,
  onOpenShortcutsModal,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 px-3 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around relative">
        {/* Calendar */}
        <button
          id="mobile-tab-calendar"
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            activeTab === 'calendar' ? 'text-rose-600 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Calendário</span>
        </button>

        {/* Statistics & Recharts */}
        <button
          id="mobile-tab-statistics"
          onClick={() => setActiveTab('statistics')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            activeTab === 'statistics' ? 'text-rose-600 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Estatísticas</span>
        </button>

        {/* Elevated FAB: Log Symptoms */}
        <div className="relative -top-5">
          <button
            id="mobile-central-log-btn"
            onClick={onOpenLogModal}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-300 active:scale-95 transition cursor-pointer border-4 border-white"
            title="Registrar sintomas de hoje"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Reminders */}
        <button
          id="mobile-tab-reminders"
          onClick={() => setActiveTab('reminders')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            activeTab === 'reminders' ? 'text-rose-600 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px]">Lembretes</span>
        </button>

        {/* Tips & QA */}
        <button
          id="mobile-tab-tips"
          onClick={() => setActiveTab('tips')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition cursor-pointer ${
            activeTab === 'tips' ? 'text-rose-600 font-bold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Dicas & IA</span>
        </button>
      </div>
    </div>
  );
};
