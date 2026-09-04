import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Compass,
  ArrowRight
} from 'lucide-react';

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  badge?: string;
  description: string;
  actionHint?: string;
  tabToActivate?: 'calendar' | 'statistics' | 'reminders' | 'tips';
  preferredPosition?: 'bottom' | 'top' | 'center';
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  activeTab: 'calendar' | 'statistics' | 'reminders' | 'tips';
  setActiveTab: (tab: 'calendar' | 'statistics' | 'reminders' | 'tips') => void;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-welcome',
    targetId: 'fertility-risk-banner',
    title: 'Monitor de Fertilidade & Risco Biológico',
    badge: 'Diagnóstico Diário',
    description: 'Este é o painel central da sua saúde reprodutiva. Ele calcula o nível de risco ou probabilidade de gravidez do dia em tempo real (Baixíssima Probabilidade, Margem de Segurança, Janela Fértil ou Menstruação).',
    actionHint: 'A cor e as orientações mudam automaticamente conforme o dia do seu ciclo e os sintomas registrados.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-log-button',
    targetId: 'header-quick-log-btn',
    title: 'Registro Diário Rápido (+ Registrar Hoje)',
    badge: '1-Click Log',
    description: 'Neste botão você anota as informações do seu dia: fluxo menstrual, temperatura corporal basal (TCB), textura do muco cervical (método sintotérmico), relações sexuais e sintomas corporais.',
    actionHint: 'Quanto mais dados você registrar, maior será a precisão das previsões do algoritmo.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-settings',
    targetId: 'header-settings-btn',
    title: 'Calibração do Algoritmo do Ciclo',
    badge: 'Personalização',
    description: 'Ajuste os parâmetros biológicos do seu corpo: a data de início da última menstruação (DUM), a duração média do seu ciclo e o histórico dos últimos meses.',
    actionHint: 'Você pode recalibrar seus parâmetros sempre que seu ciclo mudar.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-calendar-tab',
    targetId: 'nav-tab-calendar',
    title: 'Calendário Interativo & Diário',
    badge: 'Visão Mensal',
    description: 'Exibe a grade mensal completa codificada por cores de fertilidade. Você pode clicar em qualquer dia para ver a fisiologia daquela data ou planejar seus dias futuros.',
    actionHint: 'Clique em qualquer dia do mês para inspecionar e planejar suas relações com segurança.',
    tabToActivate: 'calendar',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-stats-tab',
    targetId: 'nav-tab-statistics',
    title: 'Estatísticas & Gráficos com Recharts',
    badge: 'Previsões Avançadas',
    description: 'Acompanhe o histórico de duração dos últimos ciclos em gráficos interativos com a biblioteca Recharts, medindo o índice de regularidade e projeções dos próximos 3 ciclos.',
    actionHint: 'Alterne entre gráficos de barras, tendência e fases biológicas.',
    tabToActivate: 'statistics',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-reminders-tab',
    targetId: 'nav-tab-reminders',
    title: 'Lembretes Diários Inteligentes',
    badge: 'Notificações',
    description: 'Configure alarmes matinais para medir a temperatura basal logo ao acordar e registrar o muco cervical à noite.',
    actionHint: 'Marque como concluído cada dia.',
    tabToActivate: 'reminders',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-tips-tab',
    targetId: 'nav-tab-tips',
    title: 'Dicas Fundamentais & Assistente com IA',
    badge: 'Central de Saúde',
    description: 'Tenha acesso a guias sintotérmicos baseados em literatura médica, um tira-dúvidas frequente (FAQ) e uma assistente virtual interativa.',
    actionHint: 'Você pode repetir este tutorial a qualquer momento!',
    tabToActivate: 'tips',
    preferredPosition: 'bottom',
  },
];

interface RectState {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onComplete,
  activeTab,
  setActiveTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<RectState | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const currentStep = TOUR_STEPS[currentStepIndex];

  const getEffectiveElement = useCallback((targetId: string) => {
    const mobileFallbacks: Record<string, string> = {
      'header-quick-log-btn': 'mobile-central-log-btn',
      'nav-tab-calendar': 'mobile-tab-calendar',
      'nav-tab-statistics': 'mobile-tab-statistics',
      'nav-tab-reminders': 'mobile-tab-reminders',
      'nav-tab-tips': 'mobile-tab-tips',
    };

    let el = document.getElementById(targetId);
    if (!el || el.offsetParent === null) {
      const fallbackId = mobileFallbacks[targetId];
      if (fallbackId) {
        const altEl = document.getElementById(fallbackId);
        if (altEl && altEl.offsetParent !== null) {
          el = altEl;
        }
      }
    }
    return el;
  }, []);

  const updateRect = useCallback(() => {
    if (!isOpen || !currentStep) return;

    const el = getEffectiveElement(currentStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      });
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep, getEffectiveElement]);

  useEffect(() => {
    if (isOpen && currentStep?.tabToActivate && activeTab !== currentStep.tabToActivate) {
      setActiveTab(currentStep.tabToActivate);
    }
  }, [isOpen, currentStepIndex, currentStep, activeTab, setActiveTab]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const timer = setTimeout(() => {
      const el = getEffectiveElement(currentStep.targetId);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
      updateRect();
    }, 120);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, currentStep, updateRect, getEffectiveElement]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResizeOrScroll = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateRect();
    };

    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isOpen, updateRect]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  // Tooltip placement calculated unconditionally
  const tooltipStyle = useMemo(() => {
    const cardWidth = Math.min(420, windowSize.width - 32);
    const padding = 12;

    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${cardWidth}px`,
      };
    }

    const spaceBelow = windowSize.height - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const showBelow = spaceBelow >= 260 || spaceBelow > spaceAbove;

    let top = showBelow 
      ? targetRect.bottom + padding 
      : targetRect.top - 280 - padding;

    top = Math.max(16, Math.min(windowSize.height - 310, top));

    const targetCenterX = targetRect.left + targetRect.width / 2;
    let left = targetCenterX - cardWidth / 2;
    left = Math.max(16, Math.min(windowSize.width - cardWidth - 16, left));

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
    };
  }, [targetRect, windowSize]);

  if (!isOpen) return null;

  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Dimmed backdrop */}
      <div 
        onClick={handleSkip}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-2xs transition-opacity duration-300"
      />

      {/* Floating Card */}
      <div 
        style={tooltipStyle}
        className="absolute z-50 bg-white rounded-3xl shadow-2xl border border-rose-100 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-100 text-rose-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {currentStep.badge || `Passo ${currentStepIndex + 1} de ${TOUR_STEPS.length}`}
              </span>
              <h3 className="text-sm font-bold text-stone-900 leading-snug">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          {currentStep.description}
        </p>

        {currentStep.actionHint && (
          <div className="bg-rose-50/60 rounded-xl p-2.5 text-[11px] text-stone-700 flex items-start gap-1.5 border border-rose-100">
            <Info className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <span>{currentStep.actionHint}</span>
          </div>
        )}

        {/* Progress & Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStepIndex ? 'w-5 bg-rose-600' : 'w-1.5 bg-stone-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
              >
                Anterior
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
            >
              <span>{isLastStep ? 'Concluir' : 'Próximo'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
