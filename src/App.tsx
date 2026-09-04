/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RiskBanner } from './components/RiskBanner';
import { CalendarView } from './components/CalendarView';
import { StatisticsView } from './components/StatisticsView';
import { RemindersView } from './components/RemindersView';
import { TipsAndQAView } from './components/TipsAndQAView';
import { DailyLogModal } from './components/DailyLogModal';
import { CycleSettingsModal } from './components/CycleSettingsModal';
import { OnboardingTour } from './components/OnboardingTour';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ShortcutsAndGesturesModal } from './components/ShortcutsAndGesturesModal';
import { CycleSettings, DailyLog, ReminderItem } from './types';
import { formatISODate, getDayFertilityStatus, parseISODate } from './utils/cycleCalculations';

// Initial default settings
const getInitialSettings = (): CycleSettings => {
  const saved = localStorage.getItem('ciclo_settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }

  // Calculate default DUM ~12 days prior to today
  const today = new Date();
  const defaultDum = new Date(today);
  defaultDum.setDate(defaultDum.getDate() - 12);

  return {
    lastPeriodStartDate: formatISODate(defaultDum),
    cycleLengthDays: 28,
    periodLengthDays: 5,
    lutealPhaseDays: 14,
    cycleHistory: [28, 27, 29, 28],
    userGoal: 'prevent_pregnancy',
  };
};

const getInitialLogs = (): Record<string, DailyLog> => {
  const saved = localStorage.getItem('ciclo_logs');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }

  // Initial seed logs for realistic demonstration
  const today = new Date();
  const dMinus2 = new Date(today);
  dMinus2.setDate(dMinus2.getDate() - 2);
  const dMinus1 = new Date(today);
  dMinus1.setDate(dMinus1.getDate() - 1);

  const key2 = formatISODate(dMinus2);
  const key1 = formatISODate(dMinus1);

  return {
    [key2]: {
      date: key2,
      flow: 'none',
      bbt: 36.4,
      mucus: 'creamy',
      lhTest: 'negative',
      intercourse: 'protected',
      emergencyPill: false,
      symptoms: ['Sensibilidade nos seios'],
      moods: ['Tranquila'],
      notes: 'Temperatura basal aferida às 07:00',
    },
    [key1]: {
      date: key1,
      flow: 'none',
      bbt: 36.45,
      mucus: 'egg_white',
      lhTest: 'positive',
      intercourse: 'protected',
      emergencyPill: false,
      symptoms: ['Sensibilidade nos seios', 'Inchaço abdominal'],
      moods: ['Animada / Alegre', 'Libido Alta'],
      notes: 'Muco bem fluido e elástico notado pela manhã',
    },
  };
};

const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-bbt',
    title: 'Aferir Temperatura Corporal Basal',
    description: 'Medir com termômetro de 2 casas decimais logo ao despertar, antes de se levantar.',
    time: '07:00',
    enabled: true,
    type: 'bbt',
    completedToday: false,
  },
  {
    id: 'rem-symptoms',
    title: 'Registro Diário de Sintomas & Muco',
    description: 'Anotar a textura do muco cervical, sintomas corporais e se houve relação.',
    time: '21:30',
    enabled: true,
    type: 'symptoms',
    completedToday: false,
  },
  {
    id: 'rem-period',
    title: 'Alerta Antecipado de Menstruação',
    description: 'Aviso 2 dias antes do início previsto do seu próximo ciclo para se preparar.',
    time: '09:00',
    enabled: true,
    type: 'period_soon',
    completedToday: false,
  },
  {
    id: 'rem-fertile',
    title: 'Entrada na Janela Fértil (Margem de Risco)',
    description: 'Lembrete preventivo: dias de alto risco de gravidez exigem preservativo rigoroso.',
    time: '08:30',
    enabled: true,
    type: 'fertile_window',
    completedToday: false,
  },
];

export default function App() {
  const [settings, setSettings] = useState<CycleSettings>(getInitialSettings);
  const [logsMap, setLogsMap] = useState<Record<string, DailyLog>>(getInitialLogs);
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('ciclo_reminders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_REMINDERS;
  });

  const [activeTab, setActiveTab] = useState<'calendar' | 'statistics' | 'reminders' | 'tips'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>(formatISODate(new Date()));
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalDate, setLogModalDate] = useState<string>(formatISODate(new Date()));
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Date constants
  const todayDate = new Date();
  const todayDateStr = formatISODate(todayDate);

  // Auto-launch tour on first access
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('has_completed_onboarding_tour');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Keyboard navigation & Function keys (F1 - F4, 1-4, H, ?, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        (document.activeElement?.tagName || '').toUpperCase()
      );

      // Escape key closes modals
      if (e.key === 'Escape') {
        if (isTourOpen) setIsTourOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isLogModalOpen) setIsLogModalOpen(false);
        if (isSettingsModalOpen) setIsSettingsModalOpen(false);
        return;
      }

      // F1: Dicas e IA
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveTab('tips');
        return;
      }

      // F2: Registrar Hoje
      if (e.key === 'F2') {
        e.preventDefault();
        handleOpenLogModal(todayDateStr);
        return;
      }

      // F3: Calibrar Ciclo
      if (e.key === 'F3') {
        e.preventDefault();
        setIsSettingsModalOpen(true);
        return;
      }

      // F4: Iniciar Tour
      if (e.key === 'F4') {
        e.preventDefault();
        setIsTourOpen(true);
        return;
      }

      // If user is currently typing in an input or textarea, don't trigger alpha shortcuts
      if (isInputActive) return;

      if (e.key === '1') {
        setActiveTab('calendar');
      } else if (e.key === '2') {
        setActiveTab('statistics');
      } else if (e.key === '3') {
        setActiveTab('reminders');
      } else if (e.key === '4') {
        setActiveTab('tips');
      } else if (e.key.toLowerCase() === 'h') {
        setSelectedDate(todayDateStr);
      } else if (e.key === '?') {
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, isShortcutsOpen, isLogModalOpen, isSettingsModalOpen, todayDateStr]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('ciclo_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ciclo_logs', JSON.stringify(logsMap));
  }, [logsMap]);

  useEffect(() => {
    localStorage.setItem('ciclo_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Calculations
  const todayStatus = getDayFertilityStatus(todayDate, settings, logsMap);

  const isCustomDateSelected = selectedDate !== todayDateStr;
  const currentDisplayedStatus = isCustomDateSelected
    ? getDayFertilityStatus(parseISODate(selectedDate), settings, logsMap)
    : todayStatus;

  // Handlers
  const handleStartTour = () => {
    setIsTourOpen(true);
  };

  const handleCloseTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('has_completed_onboarding_tour', 'true');
  };

  const handleCompleteTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('has_completed_onboarding_tour', 'true');
  };

  const handleSaveLog = (log: DailyLog) => {
    setLogsMap((prev) => ({
      ...prev,
      [log.date]: log,
    }));
  };

  const handleDeleteLog = (dateStr: string) => {
    setLogsMap((prev) => {
      const next = { ...prev };
      delete next[dateStr];
      return next;
    });
  };

  const handleOpenLogModal = (dateStr?: string) => {
    setLogModalDate(dateStr || selectedDate || todayDateStr);
    setIsLogModalOpen(true);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleUpdateReminderTime = (id: string, newTime: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, time: newTime } : r))
    );
  };

  const handleToggleCompleteToday = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completedToday: !r.completedToday } : r))
    );
  };

  return (
    <div className="min-h-screen bg-rose-50/25 flex flex-col font-sans text-stone-800">
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        todayStatus={todayStatus}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenLogModal={() => handleOpenLogModal(todayDateStr)}
        onStartTour={handleStartTour}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-28 md:pb-12">
        {/* Dynamic Status / Risk Banner for selected or current date */}
        <RiskBanner
          status={currentDisplayedStatus}
          onOpenLogModal={() => handleOpenLogModal(currentDisplayedStatus.date)}
          onSelectToday={() => setSelectedDate(todayDateStr)}
          isCustomDateSelected={isCustomDateSelected}
        />

        {/* Tab Views */}
        {activeTab === 'calendar' && (
          <CalendarView
            settings={settings}
            logsMap={logsMap}
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
            onOpenLogModal={handleOpenLogModal}
          />
        )}

        {activeTab === 'statistics' && (
          <StatisticsView
            settings={settings}
            logsMap={logsMap}
            todayStatus={todayStatus}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersView
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onUpdateReminderTime={handleUpdateReminderTime}
            onToggleCompleteToday={handleToggleCompleteToday}
          />
        )}

        {activeTab === 'tips' && (
          <TipsAndQAView
            settings={settings}
            todayStatus={todayStatus}
            onStartTour={handleStartTour}
          />
        )}
      </main>

      {/* Footer (with safe padding for mobile navigation) */}
      <footer className="border-t border-rose-100 bg-white/70 py-6 mb-16 md:mb-0 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <p className="font-medium text-stone-700">
              Monitor de Ciclo & Fertilidade • Planejamento e Saúde Reprodutiva
            </p>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <button
              id="footer-tour-btn"
              onClick={handleStartTour}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline flex items-center gap-1 cursor-pointer"
            >
              <span>Rever Tour do App</span>
            </button>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <button
              id="footer-shortcuts-btn"
              onClick={() => setIsShortcutsOpen(true)}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline flex items-center gap-1 cursor-pointer"
            >
              <span>Teclas & Gestos</span>
            </button>
          </div>
          <p className="text-[11px] text-stone-400 max-w-2xl mx-auto">
            Aviso de responsabilidade: Este sistema tem finalidade educacional e de monitoramento pessoal. Métodos baseados em calendário e bioindicadores possuem margem de falha intrínseca e não protegem contra Infecções Sexualmente Transmissíveis (ISTs).
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Phone & Handheld devices) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => handleOpenLogModal(todayDateStr)}
        onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
      />

      {/* Interactive Onboarding Tour */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={handleCloseTour}
        onComplete={handleCompleteTour}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Function Keys & Mobile Gestures Modal */}
      <ShortcutsAndGesturesModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Modals */}
      <DailyLogModal
        isOpen={isLogModalOpen}
        dateStr={logModalDate}
        existingLog={logsMap[logModalDate]}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveLog}
        onDelete={handleDeleteLog}
      />

      <CycleSettingsModal
        isOpen={isSettingsModalOpen}
        settings={settings}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}
