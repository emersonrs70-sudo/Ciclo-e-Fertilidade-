import React from 'react';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Thermometer, 
  Pill, 
  Droplet,
  Sparkles
} from 'lucide-react';
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
  const getIcon = (type: ReminderItem['type']) => {
    switch (type) {
      case 'bbt':
        return <Thermometer className="w-5 h-5 text-rose-500" />;
      case 'pill':
        return <Pill className="w-5 h-5 text-amber-500" />;
      case 'mucus':
        return <Droplet className="w-5 h-5 text-teal-500" />;
      default:
        return <Bell className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-600" />
            Lembretes Diários Inteligentes
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure horários estratégicos para aferir temperatura basal e registrar bioindicadores sem esquecer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {reminders.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl p-4 border transition-all ${
                item.enabled
                  ? 'bg-white border-rose-200/80 shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-50 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{item.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => onToggleReminder(item.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    item.enabled ? 'bg-rose-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      item.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="time"
                    value={item.time}
                    disabled={!item.enabled}
                    onChange={(e) => onUpdateReminderTime(item.id, e.target.value)}
                    className="font-mono text-xs bg-stone-100 px-2 py-1 rounded-md border border-stone-200 disabled:opacity-50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onToggleCompleteToday(item.id)}
                  className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition ${
                    item.completedToday
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.completedToday ? 'Concluído hoje' : 'Marcar hoje'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
