export type PregnancyRiskLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'menstrual_low';

export type CyclePhase = 
  | 'menstrual'
  | 'follicular_low_risk'
  | 'fertile_buffer'
  | 'fertile_window'
  | 'ovulation'
  | 'luteal_low_risk';

export type FlowIntensity = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type CervicalMucus = 'dry' | 'sticky' | 'creamy' | 'egg_white';
export type LHTestResult = 'none' | 'negative' | 'positive';
export type IntercourseType = 'none' | 'protected' | 'unprotected' | 'withdrawal';

export interface CycleSettings {
  lastPeriodStartDate: string; // YYYY-MM-DD
  cycleLengthDays: number; // e.g. 28
  periodLengthDays: number; // e.g. 5
  lutealPhaseDays: number; // e.g. 14
  cycleHistory: number[]; // e.g. [28, 27, 29, 28]
  userGoal: 'prevent_pregnancy' | 'track_health' | 'conceive';
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  flow: FlowIntensity;
  bbt?: number; // Basal Body Temperature in °C (e.g. 36.55)
  mucus?: CervicalMucus;
  lhTest?: LHTestResult;
  intercourse?: IntercourseType;
  emergencyPill?: boolean;
  symptoms: string[];
  moods: string[];
  notes?: string;
}

export interface DayFertilityStatus {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1-31
  month: number; // 0-11
  year: number;
  dayOfCycle: number; // 1 to cycleLengthDays
  cycleIteration: number;
  phase: CyclePhase;
  riskLevel: PregnancyRiskLevel;
  riskTitle: string;
  riskBadge: string;
  riskColor: {
    bg: string;
    text: string;
    border: string;
    dot: string;
    badgeBg: string;
  };
  recommendation: string;
  biologicalExplanation: string;
  isToday: boolean;
  hasLog: boolean;
  log?: DailyLog;
}

export interface ReminderItem {
  id: string;
  title: string;
  description: string;
  time: string;
  enabled: boolean;
  type: 'bbt' | 'symptoms' | 'period_soon' | 'fertile_window' | 'hydration';
  completedToday: boolean;
}

export interface FAQItem {
  id: string;
  category: 'metodos' | 'biologia' | 'sintotermico' | 'emergencia' | 'mitos';
  question: string;
  answer: string;
  tags: string[];
  medicalCaution?: string;
}
