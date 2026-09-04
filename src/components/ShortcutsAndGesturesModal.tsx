import React from 'react';
import { 
  X, 
  Keyboard, 
  Smartphone, 
  Hand, 
  ArrowLeftRight, 
  ArrowDown, 
  CheckCircle2, 
  Sparkles,
  Command,
  Touchpad
} from 'lucide-react';

interface ShortcutsAndGesturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsAndGesturesModal: React.FC<ShortcutsAndGesturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="shortcuts-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div 
        id="shortcuts-modal-content"
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] pb-safe animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-rose-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Teclas de Função & Gestos Mobile
              </h2>
              <p className="text-xs text-stone-500">
                Navegação rápida, atalhos de teclado e gestos de toque
              </p>
            </div>
          </div>
          <button
            id="close-shortcuts-modal-btn"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-sm text-stone-700">
          {/* Section 1: Teclas de Função (F1 - F4) */}
          <div>
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Command className="w-4 h-4 text-rose-600" />
              <span>Teclas de Função (F1 a F4)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-xs text-stone-700 font-medium">Ajuda, Dicas & IA</span>
                <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-stone-800 rounded-lg border border-stone-300 shadow-2xs">
                  F1
                </kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-xs text-stone-700 font-medium">+ Registrar Sintomas Hoje</span>
                <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-rose-600 text-white rounded-lg border border-rose-700 shadow-2xs">
                  F2
                </kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-xs text-stone-700 font-medium">Calibrar Ciclo (Configurações)</span>
                <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-stone-800 rounded-lg border border-stone-300 shadow-2xs">
                  F3
                </kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-xs text-stone-700 font-medium">Tour Guiado Interativo</span>
                <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-stone-800 rounded-lg border border-stone-300 shadow-2xs">
                  F4
                </kbd>
              </div>
            </div>
          </div>

          {/* Section 2: Gestos Mobile (Touchscreen) */}
          <div>
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-rose-600" />
              <span>Gestos Táteis em Dispositivos Mobile</span>
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                <div className="p-2 bg-white rounded-lg text-rose-600 shadow-2xs shrink-0 mt-0.5">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Deslizar Lateral no Calendário (Swipe Left / Right)
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    Deslize o dedo para a <strong>esquerda</strong> para avançar para o próximo mês, ou para a <strong>direita</strong> para voltar ao mês anterior.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                <div className="p-2 bg-white rounded-lg text-rose-600 shadow-2xs shrink-0 mt-0.5">
                  <ArrowDown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Arrastar para Baixo para Fechar (Bottom Sheet Dismiss)
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    Nos modais de registro e calibração, puxe a barra cinza superior para baixo para fechar rapidamente sem precisar alcançar o botão de fechar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                <div className="p-2 bg-white rounded-lg text-rose-600 shadow-2xs shrink-0 mt-0.5">
                  <Hand className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    Barra de Navegação Inferior Ergonômica
                  </h4>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    Acesso imediato com o polegar a qualquer aba do app e ao botão de registro rápido central em telas de celular.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Atalhos Numéricos & Teclas Rápidas */}
          <div>
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Touchpad className="w-4 h-4 text-rose-600" />
              <span>Atalhos Rápidos de Teclado</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">1</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Calendário</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">2</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Estatísticas</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">3</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Lembretes</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">4</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Dicas & IA</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">H</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Dia de Hoje</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">← / →</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Mudar Mês</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">Esc</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Fechar Modais</div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
                <kbd className="px-2 py-0.5 text-xs font-bold bg-white text-stone-800 rounded border shadow-2xs">?</kbd>
                <div className="text-[11px] text-stone-600 mt-1">Este Menu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Total compatibilidade com iOS (Safari), Android (Chrome) e navegadores Desktop.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
