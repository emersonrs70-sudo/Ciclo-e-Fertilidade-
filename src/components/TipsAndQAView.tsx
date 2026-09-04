import React, { useState } from 'react';
import { 
  HelpCircle, 
  Lightbulb, 
  Search, 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Droplet, 
  CheckCircle2, 
  Thermometer, 
  Flame, 
  Sliders, 
  MessageSquareQuote,
  Loader2,
  AlertCircle,
  Compass
} from 'lucide-react';
import { HEALTH_TIPS, FREQUENT_QUESTIONS } from '../data/faqsAndTips';
import { CycleSettings, DayFertilityStatus, FAQItem } from '../types';

interface TipsAndQAViewProps {
  settings: CycleSettings;
  todayStatus: DayFertilityStatus;
  onStartTour?: () => void;
}

export const TipsAndQAView: React.FC<TipsAndQAViewProps> = ({
  settings,
  todayStatus,
  onStartTour,
}) => {
  const [activeSection, setActiveSection] = useState<'tips' | 'faq' | 'assistant'>('tips');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(FREQUENT_QUESTIONS[0].id);

  // Interactive Q&A Assistant state
  const [userQuestion, setUserQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [assistantAnswer, setAssistantAnswer] = useState<{
    question: string;
    answer: string;
    source: string;
  } | null>(null);

  const getTipIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className="w-5 h-5 text-purple-600" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'Thermometer': return <Thermometer className="w-5 h-5 text-amber-600" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-600" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-blue-600" />;
      case 'ShieldAlert':
      default:
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
    }
  };

  // Filter FAQs
  const filteredFaqs = FREQUENT_QUESTIONS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAskAssistant = async (queryText?: string) => {
    const textToAsk = queryText || userQuestion;
    if (!textToAsk.trim()) return;

    setIsAsking(true);
    setAssistantAnswer(null);

    try {
      let data: any = null;
      try {
        const res = await fetch('/api/qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: textToAsk,
            context: {
              cycleLength: settings.cycleLengthDays,
              currentPhase: todayStatus.phase,
              userGoal: settings.userGoal,
            },
          }),
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Backend not available (e.g. GitHub Pages static deploy)
      }

      if (data && (data.answer || data.fallbackAnswer)) {
        setAssistantAnswer({
          question: textToAsk,
          answer: data.answer || data.fallbackAnswer,
          source: data.source || 'sistema',
        });
      } else {
        // Client-side medical knowledge fallback when running statically on GitHub Pages
        const qLower = textToAsk.toLowerCase();
        let fallbackText = 'O ciclo biológico é guiado pelas oscilações de estrogênio e progesterona. O período mais seguro ocorre na fase lútea (após confirmação da ovulação), enquanto a janela de fertilidade abrange os 5 dias anteriores e o dia da ovulação. Para orientações específicas ou suspeita de falha, consulte sempre um profissional de saúde.';
        
        if (qLower.includes('menstruad') || qLower.includes('sangr')) {
          fallbackText = 'Gravidez durante a menstruação é improvável, mas biologicamente possível em ciclos curtos (< 25 dias), onde a ovulação pode ocorrer cedo e espermatozoides sobrevivem até 5 dias.';
        } else if (qLower.includes('pílula') || qLower.includes('dia seguinte') || qLower.includes('emergência')) {
          fallbackText = 'A contracepção de emergência (pílula do dia seguinte) tem maior eficácia se tomada nas primeiras 24 horas (até 72h). Ela adia a ovulação e não possui efeito abortivo.';
        } else if (qLower.includes('muco') || qLower.includes('clara de ovo')) {
          fallbackText = 'O muco tipo clara de ovo (elástico e transparente) indica pico de estrogênio e sinaliza a máxima fertilidade biológica.';
        } else if (qLower.includes('temperatura') || qLower.includes('basal') || qLower.includes('tcb')) {
          fallbackText = 'A Temperatura Corporal Basal (TCB) sobe de 0,2°C a 0,5°C após a ovulação e permanece elevada por toda a fase lútea.';
        } else if (qLower.includes('coito') || qLower.includes('tirar antes')) {
          fallbackText = 'O coito interrompido possui cerca de 20% de falha no uso típico, pois o fluido pré-ejaculatório pode conter espermatozoides viáveis e não protege contra ISTs.';
        }

        setAssistantAnswer({
          question: textToAsk,
          answer: fallbackText,
          source: 'base_local',
        });
      }
      if (!queryText) setUserQuestion('');
    } catch (err) {
      console.error(err);
      setAssistantAnswer({
        question: textToAsk,
        answer: 'Ocorreu um erro ao consultar o assistente. Lembre-se: em caso de dúvidas urgentes ou suspeita de falha contraceptiva, consulte a farmácia para avaliação da pílula de emergência ou seu médico.',
        source: 'erro',
      });
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Navigation */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-2 flex items-center gap-1 overflow-x-auto">
        <button
          id="tips-tab-button"
          onClick={() => setActiveSection('tips')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeSection === 'tips'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Dicas Fundamentais ({HEALTH_TIPS.length})</span>
        </button>

        <button
          id="faq-tab-button"
          onClick={() => setActiveSection('faq')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeSection === 'faq'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Tira-Dúvidas Frequentes</span>
        </button>

        <button
          id="assistant-tab-button"
          onClick={() => setActiveSection('assistant')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
            activeSection === 'assistant'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Pergunte à Especialista (IA)</span>
        </button>

        {onStartTour && (
          <button
            id="tips-start-tour-btn"
            onClick={onStartTour}
            className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors whitespace-nowrap"
            title="Rever passo a passo explicativo das ferramentas"
          >
            <Compass className="w-3.5 h-3.5 text-rose-600" />
            <span>Passo a Passo das Funções</span>
          </button>
        )}
      </div>

      {/* SECTION 1: HEALTH TIPS */}
      {activeSection === 'tips' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HEALTH_TIPS.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:border-rose-200 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      {getTipIcon(tip.iconName)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        {tip.subtitle}
                      </span>
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                        {tip.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 shrink-0">
                    {tip.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {tip.content}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">Aviso Clínico e Ético:</strong>
              As orientações do sistema são baseadas em fisiologia reprodutiva (OMS e literatura sintotérmica). Elas não substituem consultas periódicas com seu ginecologista nem o uso de exames laboratoriais.
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FAQ & SEARCH */}
      {activeSection === 'faq' && (
        <div className="space-y-4">
          {/* Search bar & Category filters */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                id="faq-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por termos: menstruação, temperatura, pílula, preservativo..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'all', label: 'Todas as Dúvidas' },
                { id: 'metodos', label: 'Métodos Naturais' },
                { id: 'biologia', label: 'Biologia do Ciclo' },
                { id: 'sintotermico', label: 'Sintotérmico' },
                { id: 'emergencia', label: 'Contracepção de Emergência' },
                { id: 'mitos', label: 'Mitos Populares' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white border-stone-900 font-medium'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                Nenhuma resposta encontrada para sua busca. Tente outras palavras ou pergunte na aba do assistente!
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    id={`faq-item-${faq.id}`}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-stone-50/50"
                    >
                      <span className="font-bold text-sm text-stone-900 leading-snug">
                        {faq.question}
                      </span>
                      <span className="p-1 rounded-lg bg-stone-100 text-stone-500 shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-700 border-t border-stone-100 space-y-3 leading-relaxed">
                        <p>{faq.answer}</p>
                        
                        {faq.medicalCaution && (
                          <div className="p-3 bg-red-50 text-red-900 rounded-xl border border-red-200 text-xs flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>Atenção Clínica:</strong> {faq.medicalCaution}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 pt-1">
                          {faq.tags.map((t) => (
                            <span key={t} className="text-[10px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: INTERACTIVE ASSISTANT (IA) */}
      {activeSection === 'assistant' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  Assistente Inteligente de Saúde Reprodutiva
                </h3>
                <p className="text-xs text-stone-500">
                  Tire dúvidas personalizadas sobre seu ciclo, métodos de barreira, pílula de emergência ou sinais do corpo
                </p>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block mb-2">
                Sugestões de perguntas comuns para clicar:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Posso engravidar no último dia da menstruação?',
                  'Como saber se já ovulei pela temperatura basal?',
                  'A pílula do dia seguinte funciona se eu já tiver ovulado?',
                  'O muco clara de ovo dura quantos dias?',
                  'Quanto tempo o espermatozoide vive no colo do útero?',
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskAssistant(chip)}
                    className="px-3 py-1.5 rounded-full bg-stone-50 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-stone-200 text-xs text-stone-700 text-left transition-colors"
                  >
                    💬 {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="flex items-center gap-2 pt-2">
              <input
                id="assistant-query-input"
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskAssistant();
                }}
                placeholder="Digite sua dúvida aqui (ex: 'Posso ter relação desprotegida no dia 20?')..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              />
              <button
                type="button"
                id="send-assistant-query-btn"
                disabled={isAsking || !userQuestion.trim()}
                onClick={() => handleAskAssistant()}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs"
              >
                {isAsking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Perguntar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Box */}
          {assistantAnswer && (
            <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-5 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-4 h-4 text-purple-600" />
                  <span>Pergunta: "{assistantAnswer.question}"</span>
                </span>
                <span className="text-[10px] font-semibold text-stone-400">
                  {assistantAnswer.source === 'gemini' ? 'Resposta por IA Especialista' : 'Base Curada'}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line space-y-2">
                {assistantAnswer.answer}
              </div>

              <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
                <span>Esta orientação tem finalidade educativa. Para situações de risco concreto, consulte um profissional de saúde.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
