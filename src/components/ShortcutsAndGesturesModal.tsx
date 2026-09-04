import React from 'react';
import { 
  X, 
  Keyboard, 
  Smartphone, 
  HelpCircle,
  Command,
  ArrowRight
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
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-rose-600" />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Teclas de Função & Gestos
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-stone-700 max-h-[75vh] overflow-y-auto">
          {/* Function Keys Section */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Command className="w-4 h-4 text-rose-600" />
              Teclas de Função (Teclado)
            </h3>
            <div className="space-y-1.5 bg-stone-50 rounded-xl p-3 border border-stone-200/70">
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-600">Abrir Dicas & Tira-Dúvidas</span>
                <kbd className="px-2 py-0.5 bg-white border border-stone-300 rounded-md font-mono font-bold text-stone-800 shadow-2xs">F1</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-600">Registrar Sintomas de Hoje</span>
                <kbd className="px-2 py-0.5 bg-white border border-stone-300 rounded-md font-mono font-bold text-stone-800 shadow-2xs">F2</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-600">Calibrar Algoritmo do Ciclo</span>
                <kbd className="px-2 py-0.5 bg-white border border-stone-300 rounded-md font-mono font-bold text-stone-800 shadow-2xs">F3</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-600">Iniciar Tour Guiado</span>
                <kbd className="px-2 py-0.5 bg-white border border-stone-300 rounded-md font-mono font-bold text-stone-800 shadow-2xs">F4</kbd>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/60">
                <span className="text-stone-600">Alternar Abas (1 a 4)</span>
                <kbd className="px-2 py-0.5 bg-white border border-stone-300 rounded-md font-mono font-bold text-stone-800 shadow-2xs">1, 2, 3, 4</kbd>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-600">Ir para Hoje / Fechar Modais</span>
                <div className="flex gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded-md font-mono font-bold text-stone-800 shadow-2xs">H</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded-md font-mono font-bold text-stone-800 shadow-2xs">Esc</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Gestures */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-teal-600" />
              Gestos Táteis (Celular e Tablet)
            </h3>
            <div className="space-y-2 bg-stone-50 rounded-xl p-3 border border-stone-200/70">
              <p>
                <strong>Deslizar Lateral no Calendário (Swipe):</strong> Arraste para a esquerda ou direita para avançar ou retornar os meses rapidamente.
              </p>
              <p>
                <strong>Barra Inferior do Polegar:</strong> Acesso rápido com uma mão para Calendário, Estatísticas, Lembretes e botão central de registro.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
