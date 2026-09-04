export type UserGoal = 'prevent_pregnancy' | 'achieve_pregnancy' | 'track_health';

export interface CycleSettings {
  lastPeriodStartDate: string; // YYYY-MM-DD
  cycleLengthDays: number;
  periodLengthDays: number;
  lutealPhaseDays: number;
  cycleHistory: number[]; // Array of past cycle lengths in days, e.g. [28, 27, 29, 28, 30]
  userGoal: UserGoal;
}

export type MenstrualFlow = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type CervicalMucus = 'dry' | 'sticky' | 'creamy' | 'egg_white' | 'watery';
export type LHTestResult = 'positive' | 'negative' | 'none';
export type IntercourseType = 'none' | 'protected' | 'unprotected';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  flow: MenstrualFlow;
  bbt?: number; // Basal Body Temperature in Celsius e.g. 36.45
  mucus?: CervicalMucus;
  lhTest?: LHTestResult;
  intercourse?: IntercourseType;
  emergencyPill?: boolean;
  symptoms: string[];
  moods: string[];
  notes: string;
}

export type CyclePhase = 'menstruation' | 'follicular' | 'fertile_window' | 'ovulation' | 'luteal';

export type PregnancyRiskLevel = 'very_low' | 'low' | 'medium' | 'high' | 'peak';

export interface DayFertilityStatus {
  date: string;
  dayOfCycle: number;
  phase: CyclePhase;
  riskLevel: PregnancyRiskLevel;
  isOvulationDay: boolean;
  isFertileDay: boolean;
  isMenstruationDay: boolean;
  isToday: boolean;
  log?: DailyLog;
  riskTitle: string;
  riskDescription: string;
  clinicalAdvice: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  description: string;
  time: string; // HH:MM
  enabled: boolean;
  type: 'bbt' | 'pill' | 'period' | 'fertile' | 'mucus';
  completedToday?: boolean;
}

export interface CycleHistoricalDataPoint {
  cycleIndex: number;
  cycleLabel: string;
  lengthDays: number;
  periodDays: number;
  deviationFromAverage: number;
  fertileWindowStart: number;
  fertileWindowEnd: number;
  ovulationDay: number;
  isRegular: boolean;
  statusText: string;
}
