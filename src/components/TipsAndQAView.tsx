import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  ShieldCheck,
  Award,
  FileQuestion
} from 'lucide-react';
import { CycleSettings, DayFertilityStatus } from '../types';

interface TipsAndQAViewProps {
  settings: CycleSettings;
  todayStatus: DayFertilityStatus;
  onStartTour?: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Biologia & Fisiologia',
    question: 'Por que a janela fértil tem cerca de 6 dias se o óvulo só vive 24 horas?',
    answer: 'Porque os espermatozoides conseguem sobreviver por até 5 dias no trato reprodutor feminino quando há muco cervical favorável (estrogênico). Portanto, uma relação ocorrida até 5 dias antes da ovulação pode resultar em fecundação no momento em que o óvulo for liberado.',
  },
  {
    category: 'Sintotérmico',
    question: 'Como interpretar a Temperatura Corporal Basal (TCB)?',
    answer: 'A TCB deve ser medida logo ao acordar, antes de qualquer atividade física. Ela permanece mais baixa na fase folicular e sobre de 0,2°C a 0,5°C logo após a ovulação devido à progesterona secretada pelo corpo lúteo, permanecendo alta até a menstruação.',
  },
  {
    category: 'Muco Cervical',
    question: 'Como saber se o muco indica o pico de fertilidade?',
    answer: 'O muco fértil é semelhante à clara de ovo crua: transparente, elástico e escorregadio. Ele facilita a nutrição e o deslocamento dos espermatozoides até as trompas uterinas.',
  },
  {
    category: 'Contracepção',
    question: 'O coito interrompido é um método seguro?',
    answer: 'Não. O coito interrompido apresenta taxa de falha típica de até 22% ao ano, pois o fluido pré-ejaculatório pode carregar espermatozoides viáveis e o controle ejaculatório nem sempre é infalível. Além disso, não oferece nenhuma proteção contra ISTs.',
  },
];

export const TipsAndQAView: React.FC<TipsAndQAViewProps> = ({
  settings,
  todayStatus,
  onStartTour,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [userQuestion, setUserQuestion] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState<{ question: string; answer: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setIsLoading(true);
    const q = userQuestion;

    // Simulate smart clinical response with rich educational rules
    setTimeout(() => {
      const qLower = q.toLowerCase();
      let answer = 'O ciclo menstrual saudável varia de 21 a 35 dias. A fertilidade máxima ocorre na janela de 5 dias antes da ovulação até 24 horas depois dela. Registre seus sintomas e consulte sempre sua ginecologista para orientações personalizadas.';

      if (qLower.includes('pílula') || qLower.includes('dia seguinte') || qLower.includes('emergência')) {
        answer = 'A contracepção de emergência (pílula do dia seguinte) é mais eficaz quando tomada nas primeiras 24 horas (podendo ser utilizada em até 72h). Ela atua principalmente adiando a ovulação e não tem efeito abortivo caso a nidação já tenha ocorrido.';
      } else if (qLower.includes('menstruada') || qLower.includes('sangramento') || qLower.includes('fluxo')) {
        answer = 'A gravidez durante a menstruação é improvável, mas não impossível em mulheres com ciclos curtos (< 24 dias) ou quando sangramentos ovulatórios são confundidos com menstruação real.';
      } else if (qLower.includes('recharts') || qLower.includes('gráfico') || qLower.includes('regularidade')) {
        answer = 'O gráfico na aba "Estatísticas & Recharts" calcula o desvio-padrão dos seus últimos ciclos. Variações de até 7 dias entre os ciclos são classificadas como fisiologicamente normais pela FIGO.';
      } else if (qLower.includes('muco') || qLower.includes('clara de ovo')) {
        answer = 'O muco cervical tipo clara de ovo indica o pico de estrogênio que precede a ovulação em cerca de 24 a 48 horas. É o sinal mais claro de fertilidade biológica.';
      }

      setAssistantAnswer({ question: q, answer });
      setUserQuestion('');
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg sm:text-xl font-bold text-stone-900">
            Guia Científico do Ciclo & Fertilidade
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
          Compreenda como os hormônios (FSH, LH, Estrogênio e Progesterona) influenciam a temperatura, o muco e o risco gestacional em cada fase do seu organismo.
        </p>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100 space-y-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">1. Fase Folicular</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              Inicia no 1º dia da menstruação. O hormônio FSH estimula o amadurecimento dos folículos ovarianos, que produzem estrogênio gradativamente.
            </p>
          </div>

          <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 space-y-2">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">2. Janela Ovulatória</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              O pico do hormônio LH induz a liberação do óvulo. O muco torna-se elástico e a chance de gravidez atinge o ápice máximo do mês.
            </p>
          </div>

          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">3. Fase Lútea</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dura em média 14 dias constantes. O corpo lúteo produz progesterona, elevando a temperatura basal e fechando a janela fértil.
            </p>
          </div>
        </div>
      </div>

      {/* Smart Question & Answer Assistant */}
      <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-600" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              Tira-Dúvidas Instantâneo de Saúde Reprodutiva
            </h3>
            <p className="text-xs text-stone-500">
              Faça qualquer pergunta sobre seu ciclo, métodos contraceptivos ou bioindicadores.
            </p>
          </div>
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Qual a chance de gravidez menstruada? Ou como medir a TCB?"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={isLoading || !userQuestion.trim()}
            className="px-4 sm:px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Perguntar</span>
          </button>
        </form>

        {assistantAnswer && (
          <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200 text-xs sm:text-sm space-y-2">
            <p className="font-bold text-rose-900">Pergunta: {assistantAnswer.question}</p>
            <p className="text-stone-700 leading-relaxed">{assistantAnswer.answer}</p>
          </div>
        )}
      </div>

      {/* Frequently Asked Questions (Accordion) */}
      <div className="bg-white rounded-2xl border border-rose-100 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-rose-600" />
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            Perguntas Frequentes & Respostas Clínicas
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left px-4 py-3.5 bg-stone-50/60 hover:bg-rose-50/30 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-stone-900 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 py-3 text-xs sm:text-sm text-stone-600 bg-white border-t border-stone-100 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
