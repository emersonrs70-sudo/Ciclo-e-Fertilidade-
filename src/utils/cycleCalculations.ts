import { CycleSettings, DailyLog, DayFertilityStatus, CycleHistoricalDataPoint } from '../types';

export const formatISODate = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseISODate = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};

export const addDays = (d: Date, days: number): Date => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
};

export const differenceInCalendarDays = (d1: Date, d2: Date): number => {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
};

export const getDayFertilityStatus = (
  date: Date,
  settings: CycleSettings,
  logsMap: Record<string, DailyLog> = {}
): DayFertilityStatus => {
  const dateStr = formatISODate(date);
  const todayStr = formatISODate(new Date());
  const isToday = dateStr === todayStr;
  const log = logsMap[dateStr];

  const dum = parseISODate(settings.lastPeriodStartDate);
  const diffDays = differenceInCalendarDays(date, dum);

  const cycleLen = Math.max(20, Math.min(45, settings.cycleLengthDays || 28));
  const periodLen = Math.max(2, Math.min(10, settings.periodLengthDays || 5));
  const lutealLen = Math.max(10, Math.min(16, settings.lutealPhaseDays || 14));

  // Normalized day in the repeating cycle (1 to cycleLen)
  const normalizedDay = ((diffDays % cycleLen) + cycleLen) % cycleLen + 1;

  // Ovulation typically occurs lutealLen days before the next period
  const ovulationDay = Math.max(periodLen + 1, cycleLen - lutealLen);
  
  // Biological fertile window: sperm lives up to 5 days, ovum up to 24-36 hours
  // Window = ovulationDay - 5 to ovulationDay + 1
  const fertileStart = Math.max(periodLen + 1, ovulationDay - 5);
  const fertileEnd = ovulationDay + 1;

  const isMenstruationDay = normalizedDay <= periodLen;
  const isOvulationDay = normalizedDay === ovulationDay;
  const isFertileDay = normalizedDay >= fertileStart && normalizedDay <= fertileEnd;

  let phase: DayFertilityStatus['phase'] = 'follicular';
  let riskLevel: DayFertilityStatus['riskLevel'] = 'very_low';
  let riskTitle = '';
  let riskDescription = '';
  let clinicalAdvice = '';

  if (isMenstruationDay) {
    phase = 'menstruation';
    riskLevel = 'very_low';
    riskTitle = 'Menstruação • Baixíssima Probabilidade de Gravidez';
    riskDescription = `Você está no Dia ${normalizedDay} do seu ciclo (Fase Menstrual). A descamação endometrial está ativa e os folículos ovarianos começam a ser recrutados sob baixos níveis de estrogênio.`;
    clinicalAdvice = settings.userGoal === 'achieve_pregnancy'
      ? 'Fase de repouso e hidratação. A janela fértil começará após o término do sangramento.'
      : 'Chance de gravidez quase nula em ciclos regulares. Atenção: se seus ciclos forem muito curtos (< 24 dias), relações nos últimos dias do fluxo exigem cautela.';
  } else if (isOvulationDay) {
    phase = 'ovulation';
    riskLevel = 'peak';
    riskTitle = 'Dia Estimado da Ovulação • Pico Máximo de Fertilidade';
    riskDescription = `Dia ${normalizedDay} do ciclo. Liberação do oócito maduro pelo folículo ovariano induzida pelo pico do hormônio LH. O óvulo é viável por 12 a 24 horas.`;
    clinicalAdvice = settings.userGoal === 'prevent_pregnancy'
      ? 'RISCO MÁXIMO DE GRAVIDEZ. Abstenha-se de relações com penetração ou use preservativo com extrema rigidez.'
      : 'MOMENTO IDEAL PARA CONCEPÇÃO. Relações neste dia ou no dia anterior oferecem as taxas mais altas de fecundação.';
  } else if (isFertileDay) {
    phase = 'fertile_window';
    riskLevel = normalizedDay >= ovulationDay - 2 ? 'high' : 'medium';
    riskTitle = `Janela Fértil Ativa • ${riskLevel === 'high' ? 'Alto Risco' : 'Moderada Probabilidade'}`;
    riskDescription = `Dia ${normalizedDay} do ciclo. Espermatozoides sobrevivem até 5 dias nas criptas cervicais nutridos pelo muco estrogênico fluido e elástico.`;
    clinicalAdvice = settings.userGoal === 'prevent_pregnancy'
      ? 'Período fértil! Evite relações desprotegidas se seu objetivo for contracepção.'
      : 'Janela de oportunidade fértil aberta. Recomendam-se relações a cada 1 ou 2 dias.';
  } else if (normalizedDay < fertileStart) {
    phase = 'follicular';
    riskLevel = 'low';
    riskTitle = 'Fase Folicular Pré-Fértil • Baixo Risco';
    riskDescription = `Dia ${normalizedDay} do ciclo. Desenvolvimento folicular inicial com produção gradual de estrogênio. O colo do útero permanece fechado.`;
    clinicalAdvice = 'Margem de segurança relativa. Conforme se aproxima da janela fértil, observe a mudança do muco para transparente/elástico.';
  } else {
    phase = 'luteal';
    riskLevel = 'very_low';
    riskTitle = 'Fase Lútea Pós-Ovulatória • Baixíssimo Risco';
    riskDescription = `Dia ${normalizedDay} do ciclo. O corpo lúteo secreta progesterona, elevando a temperatura basal e tornando o muco hostil aos espermatozoides.`;
    clinicalAdvice = 'Período biológico infértil estável. Após confirmação da ovulação pelo método sintotérmico (alta térmica sustentada), o risco de gestação é residual.';
  }

  // Biological symptom overrides
  if (log?.mucus === 'egg_white' || log?.lhTest === 'positive') {
    if (!isMenstruationDay) {
      riskLevel = 'peak';
      riskTitle = 'Bioindicador Ativo • Pico de Fertilidade Detectado';
      riskDescription = `Você registrou ${log.lhTest === 'positive' ? 'Teste de LH Positivo' : 'Muco Cervical Clara de Ovo'}. Este biomarcador indica ovulação iminente nas próximas 24-48 horas.`;
    }
  }

  return {
    date: dateStr,
    dayOfCycle: normalizedDay,
    phase,
    riskLevel,
    isOvulationDay,
    isFertileDay,
    isMenstruationDay,
    isToday,
    log,
    riskTitle,
    riskDescription,
    clinicalAdvice,
  };
};

export const calculateCycleStats = (settings: CycleSettings) => {
  const history = settings.cycleHistory && settings.cycleHistory.length > 0
    ? settings.cycleHistory
    : [28, 27, 29, 28, 28];

  const sum = history.reduce((acc, val) => acc + val, 0);
  const avg = Number((sum / history.length).toFixed(1));

  const variance = history.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / history.length;
  const stdDev = Number(Math.sqrt(variance).toFixed(1));

  const minCycle = Math.min(...history);
  const maxCycle = Math.max(...history);
  const cycleVariation = maxCycle - minCycle;

  // Regularity index (0 to 100%)
  // Under FIGO classification, variation <= 7 days is considered regular
  let regularityScore = Math.max(10, Math.min(100, Math.round(100 - stdDev * 18)));
  let regularityLevel: 'Excelente' | 'Alta' | 'Moderada' | 'Irregular';
  let regularityColor: string;
  let regularityDescription: string;

  if (stdDev <= 1.2 && cycleVariation <= 3) {
    regularityLevel = 'Excelente';
    regularityColor = 'emerald';
    regularityDescription = 'Seus ciclos são altamente previsíveis, com variação mínima entre os meses (menor que 3 dias).';
  } else if (stdDev <= 2.5 && cycleVariation <= 7) {
    regularityLevel = 'Alta';
    regularityColor = 'teal';
    regularityDescription = 'Ciclos considerados saudáveis e regulares segundo os critérios clínicos da FIGO (variação de até 7 dias).';
  } else if (stdDev <= 4.0 && cycleVariation <= 9) {
    regularityLevel = 'Moderada';
    regularityColor = 'amber';
    regularityDescription = 'Leves oscilações identificadas. Fatores como estresse, viagens, rotina ou sono podem influenciar.';
  } else {
    regularityLevel = 'Irregular';
    regularityColor = 'rose';
    regularityDescription = 'Variação superior a 8-9 dias entre ciclos. Recomenda-se acompanhamento ginecológico e método sintotérmico com bioindicadores.';
  }

  // Historical data points formatted for Recharts
  const chartData: CycleHistoricalDataPoint[] = history.map((len, idx) => {
    const cycleNum = history.length - idx;
    const diff = Number((len - avg).toFixed(1));
    const ovDay = Math.max(5, len - (settings.lutealPhaseDays || 14));
    const fStart = Math.max(2, ovDay - 5);
    const fEnd = ovDay + 1;
    const isRegular = Math.abs(diff) <= 3.5;

    return {
      cycleIndex: idx + 1,
      cycleLabel: idx === history.length - 1 ? 'Atual' : `Ciclo -${history.length - 1 - idx}`,
      lengthDays: len,
      periodDays: settings.periodLengthDays || 5,
      deviationFromAverage: diff,
      fertileWindowStart: fStart,
      fertileWindowEnd: fEnd,
      ovulationDay: ovDay,
      isRegular,
      statusText: isRegular ? 'Normal' : diff > 0 ? 'Ciclo Longo' : 'Ciclo Curto',
    };
  });

  return {
    averageLength: avg,
    stdDev,
    minCycle,
    maxCycle,
    cycleVariation,
    regularityScore,
    regularityLevel,
    regularityColor,
    regularityDescription,
    chartData,
  };
};
