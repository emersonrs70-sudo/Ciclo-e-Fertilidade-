import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  PlusSquare, 
  X, 
  Smartphone, 
  Check, 
  Sparkles,
  Apple,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  forceOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  forceOpenModal = false,
  onCloseModal
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const isModalOpen = forceOpenModal || showModal;

  const handleClose = () => {
    setShowModal(false);
    if (onCloseModal) onCloseModal();
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else {
      setShowModal(true);
    }
  };

  // If already running as an installed standalone app and modal not forced, render nothing
  if (isInstalled && !forceOpenModal) {
    return null;
  }

  return (
    <>
      {/* Quick Header / Navigation Action Button */}
      <button
        type="button"
        id="pwa-install-header-btn"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
        title="Instalar aplicativo no seu celular (iOS / Android)"
      >
        <Download className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
        <span>Instalar App</span>
      </button>

      {/* Guide Modal for iOS Safari and other browsers */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 p-6 space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-200">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
                    Instalar Aplicativo
                  </h3>
                  <p className="text-xs text-stone-500">
                    Acesso instantâneo e offline na tela de início
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Benefits Badge */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-stone-600 bg-rose-50/60 p-3 rounded-2xl border border-rose-100">
              <div className="flex items-center gap-1.5 text-rose-800">
                <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Funciona sem internet</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-800">
                <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Sem ocupar espaço</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-800">
                <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Tela cheia sem barras</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-800">
                <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Abertura ultra-rápida</span>
              </div>
            </div>

            {/* Platform Specific Instructions */}
            {isIOS ? (
              /* iOS Safari specific step-by-step instructions */
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 border-b border-stone-100 pb-2">
                  <Apple className="w-4 h-4 text-stone-900" />
                  <span>Como instalar no iPhone ou iPad (iOS Safari):</span>
                </div>

                <div className="space-y-2.5 text-xs text-stone-700">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div className="leading-snug">
                      Toque no botão de <strong>Compartilhar</strong>{' '}
                      <Share2 className="w-3.5 h-3.5 inline text-blue-500 mx-0.5" />{' '}
                      na barra inferior do Safari.
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div className="leading-snug">
                      Role o menu para baixo e selecione a opção{' '}
                      <strong>"Adicionar à Tela de Início"</strong>{' '}
                      <PlusSquare className="w-3.5 h-3.5 inline text-stone-700 mx-0.5" />.
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div className="leading-snug">
                      No canto superior direito, toque em <strong>"Adicionar"</strong>. Pronto! O ícone do app aparecerá na sua tela inicial.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Android / Desktop / Chrome / Edge */
              <div className="space-y-4">
                {isInstallable ? (
                  <div className="text-center space-y-3">
                    <p className="text-xs text-stone-600">
                      Seu navegador suporta instalação direta em 1 clique:
                    </p>
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      disabled={isInstalling}
                      className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isInstalling ? 'Instalando...' : 'Instalar Agora no Aparelho'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-stone-800">
                      Instalação no Android (Google Chrome):
                    </p>
                    <div className="space-y-2 text-xs text-stone-700">
                      <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                          1
                        </div>
                        <div className="leading-snug">
                          Toque nos <strong>três pontinhos (⋮)</strong> no canto superior direito do Chrome.
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-xs">
                          2
                        </div>
                        <div className="leading-snug">
                          Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition cursor-pointer"
            >
              Entendido / Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
