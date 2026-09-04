import React from 'react';
import { Calendar, BarChart3, Bell, Sparkles, Plus, Keyboard } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'calendar' | 'statistics' | 'reminders' | 'tips';
  setActiveTab: (tab: 'calendar' | 'statistics' | 'reminders' | 'tips') => void;
  onOpenLogModal: () => void;
  onOpenShortcutsModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogModal,
  onOpenShortcutsModal,
}) => {
  return (
    <nav 
      id="mobile-bottom-navigation"
      aria-label="Navegação mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe transition-all select-none"
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {/* Tab 1: Calendário */}
        <button
          id="mobile-tab-calendar"
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-2xl transition-all active:scale-90 touch-manipulation ${
            activeTab === 'calendar'
              ? 'text-rose-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${
            activeTab === 'calendar' ? 'bg-rose-100/70 text-rose-600' : ''
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Calendário</span>
        </button>

        {/* Tab 2: Estatísticas */}
        <button
          id="mobile-tab-statistics"
          onClick={() => setActiveTab('statistics')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-2xl transition-all active:scale-90 touch-manipulation ${
            activeTab === 'statistics'
              ? 'text-rose-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${
            activeTab === 'statistics' ? 'bg-rose-100/70 text-rose-600' : ''
          }`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Estatísticas</span>
        </button>

        {/* Central Action: Quick Log (+ Registrar) */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            id="mobile-central-log-btn"
            onClick={onOpenLogModal}
            className="w-13 h-13 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-90 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 border-4 border-white transition-transform touch-manipulation"
            title="Registrar sintomas do dia"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[9px] font-bold text-rose-700 mt-0.5">Registrar</span>
        </div>

        {/* Tab 3: Lembretes */}
        <button
          id="mobile-tab-reminders"
          onClick={() => setActiveTab('reminders')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-2xl transition-all active:scale-90 touch-manipulation ${
            activeTab === 'reminders'
              ? 'text-rose-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${
            activeTab === 'reminders' ? 'bg-rose-100/70 text-rose-600' : ''
          }`}>
            <Bell className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Lembretes</span>
        </button>

        {/* Tab 4: Dicas & IA */}
        <button
          id="mobile-tab-tips"
          onClick={() => setActiveTab('tips')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1 rounded-2xl transition-all active:scale-90 touch-manipulation ${
            activeTab === 'tips'
              ? 'text-rose-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${
            activeTab === 'tips' ? 'bg-rose-100/70 text-rose-600' : ''
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Dicas & IA</span>
        </button>
      </div>
    </nav>
  );
};
