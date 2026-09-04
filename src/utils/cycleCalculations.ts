import { CyclePhase, CycleSettings, DailyLog, DayFertilityStatus, PregnancyRiskLevel } from '../types';

export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDaysDifference(d1: Date, d2: Date): number {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

export function calculateCycleMetrics(settings: CycleSettings) {
  const history = settings.cycleHistory && settings.cycleHistory.length > 0 
    ? settings.cycleHistory 
    : [settings.cycleLengthDays];

  const avgLength = Math.round(
    history.reduce((a, b) => a + b, 0) / history.length
  );

  // Calculate variance and standard deviation
  const variance = history.reduce((acc, val) => acc + Math.pow(val - avgLength, 2), 0) / history.length;
  const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

  let regularity: 'Alta (Ciclo Regular)' | 'Média (Variação Moderada)' | 'Baixa (Ciclo Irregular)';
  let regularityBadgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let safetyMarginBonus = 0;

  if (stdDev <= 2) {
    regularity = 'Alta (Ciclo Regular)';
    regularityBadgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    safetyMarginBonus = 0;
  } else if (stdDev <= 5) {
    regularity = 'Média (Variação Moderada)';
    regularityBadgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    safetyMarginBonus = 1; // expand window 1 day
  } else {
    regularity = 'Baixa (Ciclo Irregular)';
    regularityBadgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
    safetyMarginBonus = 3; // expand window 3 days due to irregular unpredictability
  }

  // Next ovulation day of cycle: cycleLength - lutealPhaseDays
  const ovulationCycleDay = Math.max(8, settings.cycleLengthDays - settings.lutealPhaseDays);

  return {
    avgLength,
    stdDev,
    regularity,
    regularityBadgeColor,
    safetyMarginBonus,
    ovulationCycleDay,
  };
}

export function getDayFertilityStatus(
  date: Date,
  settings: CycleSettings,
  logsMap: Record<string, DailyLog> = {}
): DayFertilityStatus {
  const dateStr = formatISODate(date);
  const startDate = parseISODate(settings.lastPeriodStartDate);
  
  const diffDays = getDaysDifference(startDate, date);
  const cycleLen = Math.max(20, settings.cycleLengthDays);
  
  // Cycle iteration (can be negative if before last period, or positive 0, 1, 2...)
  const cycleIteration = Math.floor(diffDays / cycleLen);
  // Day of cycle: 1 to cycleLen
  const modDay = ((diffDays % cycleLen) + cycleLen) % cycleLen;
  const dayOfCycle = modDay + 1;

  const { ovulationCycleDay, safetyMarginBonus } = calculateCycleMetrics(settings);

  // Fertile window calculation (Sperm lifespan: 5 days, Egg lifespan: 12-24h)
  // Ovulation is at ovulationCycleDay
  const fertileStart = Math.max(1, ovulationCycleDay - 5 - safetyMarginBonus);
  const fertileEnd = Math.min(cycleLen, ovulationCycleDay + 1 + Math.min(1, safetyMarginBonus));
  const bufferStart = Math.max(1, fertileStart - 2);
  const bufferEnd = Math.min(cycleLen, fertileEnd + 1);

  const log = logsMap[dateStr];
  const hasLog = Boolean(log);

  // Check if today
  const todayStr = formatISODate(new Date());
  const isToday = dateStr === todayStr;

  let phase: CyclePhase = 'follicular_low_risk';
  let riskLevel: PregnancyRiskLevel = 'low';
  let riskTitle = 'Baixa Probabilidade de Gravidez';
  let riskBadge = 'Fase Segura Natural';
  let recommendation = 'Probabilidade biológica muito baixa de concepção neste dia. Ideal para sexo sem preocupação contraceptiva, mantendo atenção à prevenção de ISTs.';
  let biologicalExplanation = 'O endométrio está em fase de regeneração e ainda não há folículo maduro pronto para liberação de óvulo.';

  // Biomarker overrides: If user logged egg-white mucus or positive LH test, elevate risk immediately!
  const hasEggWhiteMucus = log?.mucus === 'egg_white';
  const hasPositiveLH = log?.lhTest === 'positive';
  const hasHighBBTConfirmed = log?.bbt && log.bbt >= 36.8 && dayOfCycle > ovulationCycleDay;

  if (dayOfCycle <= settings.periodLengthDays) {
    phase = 'menstrual';
    riskLevel = 'menstrual_low';
    riskTitle = 'Menstruação (Sangramento Ativo)';
    riskBadge = 'Baixa Probabilidade';
    recommendation = 'Probabilidade baixa em ciclos de tamanho normal, mas atenção: em ciclos curtos (menores que 25 dias), a ovulação pode ocorrer logo após o sangramento.';
    biologicalExplanation = 'Descamação do endométrio. Ambiente vaginal com sangue e pH alterado.';
  } else if (dayOfCycle === ovulationCycleDay || hasPositiveLH) {
    phase = 'ovulation';
    riskLevel = 'very_high';
    riskTitle = 'Ápice da Fertilidade: Dia Provável da Ovulação';
    riskBadge = 'Risco Máximo de Gravidez';
    recommendation = 'EVITE relações sem preservativo se o objetivo for evitar gravidez. Se deseja conceber, este é o momento mais fértil do mês.';
    biologicalExplanation = 'O óvulo é liberado pelo ovário e permanece viável por cerca de 12 a 24 horas nas tubas uterinas.';
  } else if (dayOfCycle >= fertileStart && dayOfCycle <= fertileEnd) {
    phase = 'fertile_window';
    riskLevel = 'high';
    riskTitle = 'Janela Fértil (Alta Probabilidade)';
    riskBadge = 'Risco Elevado de Gravidez';
    recommendation = 'Uso imprescindível de camisinha ou abstinência de penetração desprotegida para evitar gestação.';
    biologicalExplanation = 'Espermatozoides sobrevivem até 5 dias no muco fértil esperando pela liberação do óvulo.';
  } else if ((dayOfCycle >= bufferStart && dayOfCycle < fertileStart) || (dayOfCycle > fertileEnd && dayOfCycle <= bufferEnd)) {
    phase = 'fertile_buffer';
    riskLevel = 'moderate';
    riskTitle = 'Margem de Segurança (Atenção)';
    riskBadge = 'Probabilidade Média';
    recommendation = 'Dias de transição. Recomenda-se uso de barreira profilática (preservativo) para assegurar que flutuações hormonais não antecipem a ovulação.';
    biologicalExplanation = 'Aproximação da fase ovulatória ou período imediato pós-viabilidade ovular.';
  } else if (dayOfCycle > bufferEnd) {
    phase = 'luteal_low_risk';
    riskLevel = 'low';
    riskTitle = 'Fase Lútea (Baixíssima Probabilidade)';
    riskBadge = 'Fase Infértil Confirmada';
    recommendation = 'Uma das fases mais seguras do ciclo natural para relações desprotegidas. O óvulo deste ciclo já degenerou.';
    biologicalExplanation = 'O corpo lúteo produz progesterona, fechando o colo uterino com muco espesso e impedindo a passagem de espermatozoides.';
  } else {
    phase = 'follicular_low_risk';
    riskLevel = 'low';
    riskTitle = 'Fase Pré-Ovulatória (Baixa Probabilidade)';
    riskBadge = 'Baixa Probabilidade';
    recommendation = 'Dias antes do início da janela fértil. Monitore a presença de muco tipo clara de ovo.';
    biologicalExplanation = 'Fase folicular inicial anterior ao desenvolvimento folicular final.';
  }

  // Biomarker dynamic override
  if ((hasEggWhiteMucus || hasPositiveLH) && phase !== 'ovulation') {
    phase = 'fertile_window';
    riskLevel = 'high';
    riskTitle = 'Janela Fértil Ativada por Sintomas Biomédicos';
    riskBadge = 'Alerta: Muco/LH Fértil';
    recommendation = 'Seus registros de muco cervical clara de ovo ou teste LH positivo indicam fertilidade ativa agora, independente do calendário!';
    biologicalExplanation = 'Sinais biológicos reais têm precedência sobre cálculos estatísticos de calendário.';
  }

  if (hasHighBBTConfirmed && dayOfCycle > ovulationCycleDay) {
    riskTitle = 'Fase Lútea Confirmada por Temperatura Basal';
    riskBadge = 'Infertilidade Comprovada';
    recommendation = 'A elevação térmica basal sustentada comprova que a ovulação já ocorreu. Risco mínimo de gravidez.';
  }

  // Styling properties
  const colorMap: Record<PregnancyRiskLevel, DayFertilityStatus['riskColor']> = {
    very_high: {
      bg: 'bg-rose-500/15 hover:bg-rose-500/25',
      text: 'text-rose-950 font-bold',
      border: 'border-rose-400',
      dot: 'bg-rose-600',
      badgeBg: 'bg-rose-600 text-white',
    },
    high: {
      bg: 'bg-purple-500/15 hover:bg-purple-500/25',
      text: 'text-purple-950 font-semibold',
      border: 'border-purple-300',
      dot: 'bg-purple-600',
      badgeBg: 'bg-purple-600 text-white',
    },
    moderate: {
      bg: 'bg-amber-500/15 hover:bg-amber-500/25',
      text: 'text-amber-950 font-medium',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      badgeBg: 'bg-amber-500 text-white',
    },
    low: {
      bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      text: 'text-emerald-950',
      border: 'border-emerald-200',
      dot: 'bg-emerald-600',
      badgeBg: 'bg-emerald-600 text-white',
    },
    menstrual_low: {
      bg: 'bg-red-500/15 hover:bg-red-500/25',
      text: 'text-red-950 font-medium',
      border: 'border-red-300',
      dot: 'bg-red-500',
      badgeBg: 'bg-red-500 text-white',
    },
  };

  return {
    date: dateStr,
    dayNumber: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    dayOfCycle,
    cycleIteration,
    phase,
    riskLevel,
    riskTitle,
    riskBadge,
    riskColor: colorMap[riskLevel],
    recommendation,
    biologicalExplanation,
    isToday,
    hasLog,
    log,
  };
}

export function getMonthDaysMatrix(
  year: number,
  month: number,
  settings: CycleSettings,
  logsMap: Record<string, DailyLog> = {}
): DayFertilityStatus[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days: DayFertilityStatus[] = [];

  // Previous month padding days to align with Monday/Sunday
  // Let's use Sunday as start (0) or Monday (1). In Brazil/PT, Monday is common or Sunday. Let's align standard Sunday (0) to Saturday (6).
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push(getDayFertilityStatus(prevDate, settings, logsMap));
  }

  // Current month days
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    const currDate = new Date(year, month, d);
    days.push(getDayFertilityStatus(currDate, settings, logsMap));
  }

  // Next month padding to fill grid (multiple of 7)
  const remainder = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remainder; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push(getDayFertilityStatus(nextDate, settings, logsMap));
  }

  return days;
}

export function getUpcomingKeyDates(settings: CycleSettings) {
  const startDate = parseISODate(settings.lastPeriodStartDate);
  const { ovulationCycleDay, avgLength } = calculateCycleMetrics(settings);

  // Next period estimate
  const nextPeriodDate = new Date(startDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgLength);

  // Next ovulation estimate
  const nextOvulationDate = new Date(startDate);
  nextOvulationDate.setDate(nextOvulationDate.getDate() + ovulationCycleDay);

  // Fertile window start and end
  const fertileStart = new Date(nextOvulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(nextOvulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  return {
    nextPeriodDate: formatISODate(nextPeriodDate),
    nextOvulationDate: formatISODate(nextOvulationDate),
    fertileStartDate: formatISODate(fertileStart),
    fertileEndDate: formatISODate(fertileEnd),
  };
}
