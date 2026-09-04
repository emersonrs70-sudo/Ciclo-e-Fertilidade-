import React, { useState } from 'react';
import { Bell, Clock, CheckCircle2, AlertCircle, Sparkles, Volume2, ShieldCheck } from 'lucide-react';
import { ReminderItem } from '../types';

interface RemindersViewProps {
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onUpdateReminderTime: (id: string, newTime: string) => void;
  onToggleCompleteToday: (id: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onToggleReminder,
  onUpdateReminderTime,
  onToggleCompleteToday,
}) => {
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testAlertMessage, setTestAlertMessage] = useState<string | null>(null);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Seu navegador não suporta notificações de sistema.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationStatus(perm);
      if (perm === 'granted') {
        new Notification('Lembretes Ativados! ✨', {
          body: 'Você receberá avisos para medir a temperatura e registrar seus sintomas.',
          icon: '/favicon.ico',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerSimulatedAlert = (rem: ReminderItem) => {
    setTestAlertMessage(`🔔 Alerta Simulado: "${rem.title}" - ${rem.description}`);
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(rem.title, {
        body: rem.description,
      });
    }
    setTimeout(() => {
      setTestAlertMessage(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Permissão & Status */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Lembretes Diários Inteligentes
              </h2>
              <p className="text-xs text-stone-500">
                Nunca perca a medição da temperatura basal matinal ou o registro de sintomas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notificationStatus !== 'granted' ? (
              <button
                id="enable-browser-notifications-btn"
                onClick={requestNotificationPermission}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
              >
                Ativar Notificações do Navegador
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
                <span>Notificações Ativas</span>
              </span>
            )}
          </div>
        </div>

        {testAlertMessage && (
          <div className="mt-4 p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{testAlertMessage}</span>
          </div>
        )}
      </div>

      {/* Lista de Lembretes */}
      <div className="space-y-3">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            id={`reminder-card-${rem.id}`}
            className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
              rem.enabled ? 'border-stone-200' : 'border-stone-200/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  id={`toggle-complete-${rem.id}`}
                  onClick={() => onToggleCompleteToday(rem.id)}
                  title={rem.completedToday ? 'Concluído hoje' : 'Marcar como concluído'}
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    rem.completedToday
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-stone-300 hover:border-stone-400 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm ${rem.completedToday ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                      {rem.title}
                    </h3>
                    {rem.completedToday && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Feito hoje
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {rem.description}
                  </p>
                </div>
              </div>

              {/* Controles de Horário e Ativação */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="time"
                    value={rem.time}
                    disabled={!rem.enabled}
                    onChange={(e) => onUpdateReminderTime(rem.id, e.target.value)}
                    className="text-xs font-mono font-medium text-stone-800 bg-transparent focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  id={`test-sound-${rem.id}`}
                  onClick={() => triggerSimulatedAlert(rem)}
                  title="Testar alerta"
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rem.enabled}
                    onChange={() => onToggleReminder(rem.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dica de Boas Práticas */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-900 block mb-1">Por que a constância é vital?</strong>
          <p className="leading-relaxed">
            A temperatura corporal basal é altamente sensível ao ciclo circadiano. Medir sempre no mesmo intervalo matinal garante curvas térmicas nítidas, facilitando a identificação do exato momento em que o óvulo foi liberado.
          </p>
        </div>
      </div>
    </div>
  );
};
