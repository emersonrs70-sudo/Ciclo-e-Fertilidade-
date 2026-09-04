import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, Droplets, Info, Sparkles, PlusCircle } from 'lucide-react';
import { DayFertilityStatus } from '../types';

interface RiskBannerProps {
  status: DayFertilityStatus;
  onOpenLogModal: () => void;
  onSelectToday?: () => void;
  isCustomDateSelected?: boolean;
}

export const RiskBanner: React.FC<RiskBannerProps> = ({
  status,
  onOpenLogModal,
  onSelectToday,
  isCustomDateSelected,
}) => {
  const getIcon = () => {
    switch (status.riskLevel) {
      case 'very_high':
        return <Sparkles className="w-6 h-6 text-rose-600 animate-bounce" />;
      case 'high':
        return <Flame className="w-6 h-6 text-purple-600" />;
      case 'moderate':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'menstrual_low':
        return <Droplets className="w-6 h-6 text-red-600" />;
      case 'low':
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
    }
  };

  const getThemeStyles = () => {
    switch (status.riskLevel) {
      case 'very_high':
        return {
          wrapper: 'bg-gradient-to-r from-rose-50 via-pink-50 to-rose-100/70 border-rose-300',
          badge: 'bg-rose-600 text-white',
          title: 'text-rose-950',
          tag: 'border-rose-300 text-rose-800 bg-rose-100/60',
        };
      case 'high':
        return {
          wrapper: 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 border-purple-300',
          badge: 'bg-purple-600 text-white',
          title: 'text-purple-950',
          tag: 'border-purple-300 text-purple-800 bg-purple-100/60',
        };
      case 'moderate':
        return {
          wrapper: 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border-amber-300',
          badge: 'bg-amber-600 text-white',
          title: 'text-amber-950',
          tag: 'border-amber-300 text-amber-800 bg-amber-100/60',
        };
      case 'menstrual_low':
        return {
          wrapper: 'bg-gradient-to-r from-red-50 via-rose-50 to-stone-50 border-red-200',
          badge: 'bg-red-600 text-white',
          title: 'text-red-950',
          tag: 'border-red-200 text-red-800 bg-red-100/60',
        };
      case 'low':
      default:
        return {
          wrapper: 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-emerald-300',
          badge: 'bg-emerald-700 text-white',
          title: 'text-emerald-950',
          tag: 'border-emerald-300 text-emerald-800 bg-emerald-100/60',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <section 
      id="fertility-risk-banner"
      className={`rounded-2xl border p-4 sm:p-6 transition-all shadow-sm ${styles.wrapper}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Indicator & Main Message */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-stone-100 shrink-0">
            {getIcon()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${styles.badge}`}>
                {status.riskBadge}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${styles.tag}`}>
                Dia {status.dayOfCycle} do ciclo
              </span>
              <span className="text-xs text-stone-600">
                {isCustomDateSelected ? `Data selecionada: ${status.date}` : `Hoje: ${status.date}`}
              </span>
              {isCustomDateSelected && onSelectToday && (
                <button
                  onClick={onSelectToday}
                  className="text-xs text-rose-600 hover:text-rose-800 underline ml-1 font-medium"
                >
                  Voltar para hoje
                </button>
              )}
            </div>

            <h1 className={`text-lg sm:text-xl font-bold tracking-tight ${styles.title}`}>
              {status.riskTitle}
            </h1>

            <p className="text-sm text-stone-700 mt-1 max-w-3xl leading-relaxed">
              {status.recommendation}
            </p>

            <div className="mt-2.5 flex items-start gap-2 text-xs text-stone-600 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl border border-stone-200/70">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-800">Mecanismo biológico:</strong> {status.biologicalExplanation}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick log action & Status metadata */}
        <div className="flex lg:flex-col sm:flex-row items-stretch sm:items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200/60">
          <button
            id="banner-log-action-btn"
            onClick={onOpenLogModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{status.hasLog ? 'Editar Registro do Dia' : 'Registrar Sintomas'}</span>
          </button>
          
          <div className="text-[11px] text-stone-500 text-center lg:text-right">
            {status.hasLog ? (
              <span className="text-emerald-700 font-medium">✓ Dados do dia registrados</span>
            ) : (
              <span>Nenhum sintoma anotado hoje</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
