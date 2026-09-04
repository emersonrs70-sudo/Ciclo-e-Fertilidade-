import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Target,
  ArrowDown,
  ArrowUp
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
    title: 'Monitor de Fertilidade & Diagnóstico Diário',
    badge: 'Painel Central',
    description: 'Este é o painel de status em tempo real da sua saúde reprodutiva. Ele calcula o nível biológico de probabilidade de gravidez do dia (Baixíssima Probabilidade, Janela Fértil, Pico Ovulatório ou Menstruação).',
    actionHint: 'As orientações e cores mudam dinamicamente conforme os dias e os sintomas registrados.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-log-button',
    targetId: 'header-quick-log-btn',
    title: 'Registro Rápido (+ Registrar Hoje)',
    badge: '1-Click Log',
    description: 'Neste botão você anota os dados vitais do dia: fluxo menstrual, temperatura corporal basal (TCB), muco cervical (método sintotérmico), relações sexuais e sintomas corporais.',
    actionHint: 'Quanto mais dados você registrar, maior a acurácia dos cálculos.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-settings',
    targetId: 'header-settings-btn',
    title: 'Calibração do Algoritmo do Ciclo',
    badge: 'Personalização',
    description: 'Ajuste os parâmetros biológicos do seu corpo: a data de início da última menstruação (DUM), duração média do ciclo e histórico de regularidade.',
    actionHint: 'Você pode recalibrar sempre que seu ciclo mudar ou após viagens/estresse.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-calendar-tab',
    targetId: 'nav-tab-calendar',
    title: 'Calendário Interativo & Diário',
    badge: 'Visão Mensal',
    description: 'Exibe a grade mensal completa codificada por cores de risco e fertilidade. Permite planejar viagens, visualizar ovulações e clicar em qualquer dia para inspeção.',
    actionHint: 'Clique ou deslize lateralmente (swipe) para navegar entre os meses.',
    tabToActivate: 'calendar',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-stats-tab',
    targetId: 'nav-tab-statistics',
    title: 'Estatísticas & Gráficos com Recharts',
    badge: 'Análise Avançada',
    description: 'Gráficos interativos construídos com a biblioteca Recharts: histórico de duração dos ciclos, linha de tendência com média histórica, fases biológicas e índice de regularidade FIGO.',
    actionHint: 'Alterne entre gráficos de barras, tendências e adicione novos ciclos históricos.',
    tabToActivate: 'statistics',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-reminders-tab',
    targetId: 'nav-tab-reminders',
    title: 'Lembretes Diários Inteligentes',
    badge: 'Notificações',
    description: 'Configure alarmes matinais para aferir a temperatura basal ao acordar e lembretes noturnos para inspecionar o muco cervical.',
    actionHint: 'Marque como concluído dia a dia para criar constância no monitoramento.',
    tabToActivate: 'reminders',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-tips-tab',
    targetId: 'nav-tab-tips',
    title: 'Dicas Fundamentais & Assistente com IA',
    badge: 'Saúde & Dúvidas',
    description: 'Acesse o guia sintotérmico baseado em literatura médica, FAQ com perguntas frequentes e o assistente de perguntas e respostas para tirar qualquer dúvida.',
    actionHint: 'Você pode reabrir este tour a qualquer momento no rodapé ou pelo menu.',
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
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1024, 
    height: typeof window !== 'undefined' ? window.innerHeight : 768 
  });

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
      // Ensure element actually has measurable dimensions
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          right: rect.right,
        });
        return;
      }
    }
    setTargetRect(null);
  }, [isOpen, currentStep, getEffectiveElement]);

  // If the step requests a specific tab, switch to it immediately
  useEffect(() => {
    if (isOpen && currentStep?.tabToActivate && activeTab !== currentStep.tabToActivate) {
      setActiveTab(currentStep.tabToActivate);
    }
  }, [isOpen, currentStepIndex, currentStep, activeTab, setActiveTab]);

  // Scroll to element and measure position with multiple passes to handle DOM rendering
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const measurePasses = [40, 140, 300];
    const timers: NodeJS.Timeout[] = [];

    measurePasses.forEach((delay) => {
      const timer = setTimeout(() => {
        const el = getEffectiveElement(currentStep.targetId);
        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
        }
        updateRect();
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen, currentStepIndex, currentStep, activeTab, updateRect, getEffectiveElement]);

  // Handle window resize and scroll
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

  // Card placement computation with safe bounds and clear orientation
  const { tooltipStyle, isAboveTarget } = useMemo(() => {
    const cardWidth = Math.min(420, windowSize.width - 32);
    const padding = 16;

    if (!targetRect) {
      return {
        tooltipStyle: {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${cardWidth}px`,
        },
        isAboveTarget: false,
      };
    }

    const spaceBelow = windowSize.height - targetRect.bottom;
    const spaceAbove = targetRect.top;
    
    // Choose placing below if there is room for ~270px card, else above
    const placeBelow = spaceBelow >= 270 || spaceBelow > spaceAbove;

    let top: number;
    if (placeBelow) {
      top = targetRect.bottom + padding;
    } else {
      top = targetRect.top - 280 - padding;
    }

    // Keep inside screen bounds
    top = Math.max(16, Math.min(windowSize.height - 300, top));

    const targetCenterX = targetRect.left + targetRect.width / 2;
    let left = targetCenterX - cardWidth / 2;
    left = Math.max(16, Math.min(windowSize.width - cardWidth - 16, left));

    return {
      tooltipStyle: {
        top: `${top}px`,
        left: `${left}px`,
        width: `${cardWidth}px`,
      },
      isAboveTarget: !placeBelow,
    };
  }, [targetRect, windowSize]);

  if (!isOpen) return null;

  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const spotlightPadding = 6;
  const spotlightRadius = 16;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* 1. SVG Cutout Mask: darkens the whole screen EXCEPT the highlighted target element */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-40 transition-all duration-300">
        <defs>
          <mask id="tour-spotlight-mask">
            {/* White fills everything (makes entire overlay dark) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            
            {/* Black cuts out the spotlight hole so the actual element shines through 100% brightly */}
            {targetRect && (
              <rect
                x={targetRect.left - spotlightPadding}
                y={targetRect.top - spotlightPadding}
                width={targetRect.width + spotlightPadding * 2}
                height={targetRect.height + spotlightPadding * 2}
                rx={spotlightRadius}
                ry={spotlightRadius}
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Dark backdrop with cutout */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.70)"
          mask="url(#tour-spotlight-mask)"
          className="pointer-events-auto cursor-pointer"
          onClick={handleSkip}
        />
      </svg>

      {/* 2. Luminous Spotlight Frame & Glowing Highlight Box around the target element */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: `${targetRect.top - spotlightPadding}px`,
            left: `${targetRect.left - spotlightPadding}px`,
            width: `${targetRect.width + spotlightPadding * 2}px`,
            height: `${targetRect.height + spotlightPadding * 2}px`,
            borderRadius: `${spotlightRadius}px`,
          }}
          className="pointer-events-none z-50 border-2 border-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.35),0_0_35px_rgba(244,63,94,0.65)] transition-all duration-300 animate-pulse"
        >
          {/* Subtle outer ripple ping */}
          <div 
            style={{ borderRadius: `${spotlightRadius}px` }} 
            className="absolute -inset-1 border-2 border-rose-400 opacity-75 animate-ping pointer-events-none" 
          />

          {/* Glowing Beacon Pill pointing to the active feature */}
          <div className="absolute -top-3 left-3 sm:left-4 bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>Função em Destaque</span>
          </div>
        </div>
      )}

      {/* 3. Floating Explanatory Card */}
      <div 
        style={tooltipStyle}
        className="fixed z-50 bg-white rounded-3xl shadow-2xl border border-rose-100 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Title & Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-rose-100 text-rose-600 shrink-0">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  {currentStep.badge || `Passo ${currentStepIndex + 1} de ${TOUR_STEPS.length}`}
                </span>
                <span className="text-[10px] font-semibold text-stone-400">
                  {currentStepIndex + 1}/{TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 leading-snug mt-1">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            title="Fechar tour (Esc)"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Action Hint with indicator arrow */}
        {currentStep.actionHint && (
          <div className="bg-rose-50/70 rounded-xl p-3 text-[11px] text-stone-700 flex items-start gap-2 border border-rose-100">
            {isAboveTarget ? (
              <ArrowDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
            ) : (
              <ArrowUp className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
            )}
            <span className="leading-snug">
              <strong>Dica de uso:</strong> {currentStep.actionHint}
            </span>
          </div>
        )}

        {/* Progress Dots & Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStepIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentStepIndex ? 'w-6 bg-rose-600' : 'w-2 bg-stone-200 hover:bg-rose-300'
                }`}
                title={`Ir para passo ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 active:scale-95 transition cursor-pointer"
              >
                Anterior
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>{isLastStep ? 'Concluir Tour' : 'Próximo'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
