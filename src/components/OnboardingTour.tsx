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
    description: 'Este é o painel central da sua saúde reprodutiva. Ele calcula o nível de risco ou probabilidade de gravidez do dia em tempo real (Baixíssima Probabilidade, Margem de Segurança, Janela Fértil ou Menstruação), indicando a recomendação prática e a explicação fisiológica exata.',
    actionHint: 'A cor e as orientações mudam automaticamente conforme o dia do seu ciclo e os sintomas registrados.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-log-button',
    targetId: 'header-quick-log-btn',
    title: 'Registro Diário Rápido (+ Registrar Hoje)',
    badge: '1-Click Log',
    description: 'Neste botão você anota as informações do seu dia: fluxo menstrual, temperatura corporal basal (TCB), textura do muco cervical (método sintotérmico), relações sexuais com ou sem preservativo, pílula de emergência e sintomas corporais.',
    actionHint: 'Quanto mais dados você registrar, maior será a precisão das previsões do algoritmo.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-settings',
    targetId: 'header-settings-btn',
    title: 'Calibração do Algoritmo do Ciclo',
    badge: 'Personalização',
    description: 'Ajuste os parâmetros biológicos do seu corpo: a data de início da última menstruação (DUM), a duração média do seu ciclo e o histórico dos últimos meses. O sistema calcula a margem de segurança e o desvio-padrão automaticamente.',
    actionHint: 'Você pode recalibrar seus parâmetros sempre que seu ciclo mudar.',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-calendar-tab',
    targetId: 'nav-tab-calendar',
    title: 'Calendário Interativo & Diário',
    badge: 'Visão Mensal',
    description: 'Exibe a grade mensal completa codificada por cores de fertilidade. Você pode clicar em qualquer dia para ver a fisiologia daquela data, consultar os registros passados ou prever dias futuros.',
    actionHint: 'Clique em qualquer dia do mês para inspecionar e planejar suas relações com segurança.',
    tabToActivate: 'calendar',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-stats-tab',
    targetId: 'nav-tab-statistics',
    title: 'Estatísticas & Projeções Futuras',
    badge: 'Previsões Avançadas',
    description: 'Aqui você acompanha a linha do tempo do seu ciclo atual, o cálculo de regularidade biológica e uma projeção antecipada dos próximos 3 ciclos para programar viagens, eventos e momentos a dois.',
    actionHint: 'Acesse esta aba para ver gráficos e os sintomas que mais se repetem ao longo do mês.',
    tabToActivate: 'statistics',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-reminders-tab',
    targetId: 'nav-tab-reminders',
    title: 'Lembretes Diários Inteligentes',
    badge: 'Notificações',
    description: 'Configure alarmes matinais para medir a temperatura basal logo ao acordar, registrar o muco cervical à noite e receber avisos preventivos dias antes da menstruação ou da entrada na janela fértil.',
    actionHint: 'Você pode ativar notificações diretas no seu navegador para não esquecer nenhuma medição.',
    tabToActivate: 'reminders',
    preferredPosition: 'bottom',
  },
  {
    id: 'step-tips-tab',
    targetId: 'nav-tab-tips',
    title: 'Dicas Fundamentais & Assistente com IA',
    badge: 'Central de Saúde',
    description: 'Tenha acesso a guias sintotérmicos baseados em literatura médica da OMS, um tira-dúvidas frequente (FAQ) e uma assistente virtual interativa com IA para esclarecer dúvidas personalizadas sobre seu ciclo a qualquer momento.',
    actionHint: 'Você pode repetir este tutorial a qualquer momento clicando no botão "Tour Guiado" no topo da página!',
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

  // Update target rect
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
      // Fallback if target element is not found on current page
      setTargetRect(null);
    }
  }, [isOpen, currentStep, getEffectiveElement]);

  // Activate tab if step requires it
  useEffect(() => {
    if (isOpen && currentStep?.tabToActivate && activeTab !== currentStep.tabToActivate) {
      setActiveTab(currentStep.tabToActivate);
    }
  }, [isOpen, currentStepIndex, currentStep, activeTab, setActiveTab]);

  // Scroll target element into view smoothly when step changes
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    // Small delay to allow tab transitions or layouts to settle
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

  // Handle window resize and scroll events
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

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

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

  // Calculate tooltip placement (unconditionally called hook)
  const tooltipStyle = useMemo(() => {
    const cardWidth = Math.min(420, windowSize.width - 32);
    const padding = 12;

    if (!targetRect) {
      // Center modal fallback
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${cardWidth}px`,
      };
    }

    // Determine vertical position:
    // If target is in the upper part of screen, put balloon below.
    // Otherwise put balloon above.
    const spaceBelow = windowSize.height - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const showBelow = spaceBelow >= 260 || spaceBelow > spaceAbove;

    let top = showBelow 
      ? targetRect.bottom + padding 
      : targetRect.top - 280 - padding;

    // Guard top bounds
    top = Math.max(16, Math.min(windowSize.height - 310, top));

    // Align horizontally centered with the target element, constrained by viewport
    const targetCenterX = targetRect.left + targetRect.width / 2;
    let left = targetCenterX - cardWidth / 2;

    // Keep within screen edges
    left = Math.max(16, Math.min(windowSize.width - cardWidth - 16, left));

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
    };
  }, [targetRect, windowSize]);

  if (!isOpen) return null;

  // SVG spotlight cutout dimensions with safe padding
  const spotlightBox = targetRect ? {
    x: Math.max(0, targetRect.left - 6),
    y: Math.max(0, targetRect.top - 6),
    width: targetRect.width + 12,
    height: targetRect.height + 12,
    rx: 16,
  } : null;

  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    <div 
      id="onboarding-tour-overlay"
      className="fixed inset-0 z-50 pointer-events-auto overflow-hidden animate-in fade-in duration-200 select-none"
    >
      {/* SVG Mask Backdrop for Spotlight Cutout */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="spotlight-mask">
            {/* White area is dimmed */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black area is cut out completely to reveal the target below */}
            {spotlightBox && (
              <rect
                x={spotlightBox.x}
                y={spotlightBox.y}
                width={spotlightBox.width}
                height={spotlightBox.height}
                rx={spotlightBox.rx}
                ry={spotlightBox.rx}
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Backdrop color with 80% opacity using mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.78)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Pulsing highlight border around focused spotlight */}
      {spotlightBox && (
        <div
          style={{
            position: 'absolute',
            left: `${spotlightBox.x}px`,
            top: `${spotlightBox.y}px`,
            width: `${spotlightBox.width}px`,
            height: `${spotlightBox.height}px`,
            borderRadius: `${spotlightBox.rx}px`,
          }}
          className="pointer-events-none ring-4 ring-rose-400/90 shadow-[0_0_25px_rgba(244,63,94,0.45)] transition-all duration-300 ease-out"
        />
      )}

      {/* Interactive Tooltip Balloon */}
      <div
        id="tour-tooltip-balloon"
        style={tooltipStyle}
        className="absolute bg-white text-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-rose-200/80 transition-all duration-300 ease-out flex flex-col pointer-events-auto"
      >
        {/* Balloon Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black">
              {currentStepIndex + 1}
            </span>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Passo {currentStepIndex + 1} de {TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {currentStep.badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {currentStep.badge}
              </span>
            )}
            <button
              id="tour-close-btn"
              onClick={handleSkip}
              title="Pular tour"
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug mb-2 flex items-center gap-2">
          <span>{currentStep.title}</span>
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
          {currentStep.description}
        </p>

        {currentStep.actionHint && (
          <div className="mb-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{currentStep.actionHint}</span>
          </div>
        )}

        {/* Step Progress Dots / Indicators (1; 2; 3; ...) */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-auto">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                title={`Ir para o passo ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-rose-600'
                    : idx < currentStepIndex
                    ? 'w-2 bg-rose-300'
                    : 'w-2 bg-stone-200 hover:bg-stone-300'
                }`}
              />
            ))}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                id="tour-prev-btn"
                onClick={handlePrev}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            <button
              type="button"
              id="tour-next-btn"
              onClick={handleNext}
              className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-sm shadow-rose-200 transition-all flex items-center gap-1.5"
            >
              <span>{isLastStep ? 'Concluir' : 'Próximo'}</span>
              {isLastStep ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom helper text */}
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-stone-400">
          <span>Use as setas do teclado (← / →) ou Enter</span>
          <button
            onClick={handleSkip}
            className="hover:text-stone-600 underline font-medium"
          >
            Pular tutorial
          </button>
        </div>
      </div>
    </div>
  );
};
