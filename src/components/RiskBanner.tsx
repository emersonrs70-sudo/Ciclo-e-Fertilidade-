import React from 'react';
import { 
  AlertCircle, 
  ShieldCheck, 
  Flame, 
  Calendar, 
  ArrowRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { DayFertilityStatus } from '../types';

interface RiskBannerProps {
  status: DayFertilityStatus;
  onOpenLogModal: () => void;
  onSelectToday: () => void;
  isCustomDateSelected: boolean;
}

export const RiskBanner: React.FC<RiskBannerProps> = ({
  status,
  onOpenLogModal,
  onSelectToday,
  isCustomDateSelected,
}) => {
  const getTheme = () => {
    switch (status.riskLevel) {
      case 'peak':
        return {
          bg: 'bg-rose-500 text-white border-rose-600',
          badge: 'bg-white/20 text-white',
          icon: <Flame className="w-6 h-6 text-white shrink-0 animate-pulse" />,
        };
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-orange-500 to-rose-500 text-white border-orange-600',
          badge: 'bg-white/20 text-white',
          icon: <Flame className="w-6 h-6 text-white shrink-0" />,
        };
      case 'medium':
        return {
          bg: 'bg-amber-50 text-amber-950 border-amber-300',
          badge: 'bg-amber-200/70 text-amber-900',
          icon: <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />,
        };
      case 'low':
        return {
          bg: 'bg-teal-50 text-teal-950 border-teal-300',
          badge: 'bg-teal-200/70 text-teal-900',
          icon: <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />,
        };
      case 'very_low':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-950 border-emerald-300',
          badge: 'bg-emerald-200/70 text-emerald-900',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />,
        };
    }
  };

  const theme = getTheme();
  const isLight = status.riskLevel === 'very_low' || status.riskLevel === 'low' || status.riskLevel === 'medium';

  return (
    <section 
      id="fertility-risk-banner" 
      className={`rounded-2xl border shadow-sm p-4 sm:p-6 transition-all duration-300 ${theme.bg}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Main information */}
        <div className="flex items-start gap-3.5">
          {theme.icon}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                {status.riskTitle}
              </h2>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${theme.badge}`}>
                Dia {status.dayOfCycle} do ciclo
              </span>
              {isCustomDateSelected && (
                <button
                  onClick={onSelectToday}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full underline cursor-pointer ${
                    isLight ? 'text-rose-700 hover:text-rose-900' : 'text-rose-100 hover:text-white'
                  }`}
                >
                  Voltar para Hoje
                </button>
              )}
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-3xl ${isLight ? 'text-stone-700' : 'text-white/90'}`}>
              {status.riskDescription}
            </p>

            <div className="pt-1.5 flex items-start gap-1.5 text-xs font-medium">
              <Info className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
              <p className={isLight ? 'text-stone-800' : 'text-white'}>
                <strong>Orientação Prática:</strong> {status.clinicalAdvice}
              </p>
            </div>
          </div>
        </div>

        {/* Quick action for selected date */}
        <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
          <button
            id="banner-log-action-btn"
            onClick={onOpenLogModal}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer ${
              isLight
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-white hover:bg-rose-50 text-rose-700'
            }`}
          >
            <span>{status.log ? 'Editar Sintomas' : '+ Registrar Sintomas'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
