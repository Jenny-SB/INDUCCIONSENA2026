export interface SymbolItem {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  details: string[];
  iconType: 'shield' | 'flag' | 'logo' | 'music';
}

export interface ValueItem {
  name: string;
  description: string;
  behavior: string;
}

export interface RightOrDuty {
  id: string;
  type: 'derecho' | 'deber' | 'prohibicion';
  category: 'academico' | 'disciplinario' | 'bienestar' | 'tecnologico' | 'seguridad';
  title: string;
  description: string;
  articleRef: string;
  practicalExample: string;
}

export interface Question {
  id: string;
  category: 'identidad' | 'derechos' | 'deberes' | 'prohibiciones' | 'debido_proceso';
  categoryLabel: string;
  question: string;
  situationContext?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
  feedbackExplanation: string;
  ruleReference: string;
}

export interface DilemmaCase {
  id: string;
  title: string;
  scenario: string;
  options: {
    id: string;
    action: string;
    isCorrect: boolean;
    consequence: string;
    regulationLesson: string;
  }[];
}

export interface ApprenticeResult {
  id: string;
  apprenticeName: string;
  documentId: string;
  trainingProgram: string;
  cohortNumber: string; // Ficha de caracterización
  regional: string;
  centerName: string;
  completedAt: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctAnswersCount: number;
  passed: boolean;
  categoryBreakdown: {
    category: string;
    score: number;
    total: number;
  }[];
  answersGiven: Record<string, string>; // questionId -> optionId
}

export interface RegulationDefinition {
  id: string;
  term: string;
  category: 'formativo' | 'modalidad' | 'gestion' | 'inclusion';
  categoryLabel: string;
  shortDesc: string;
  fullDefinition: string;
  keyRule: string;
}

export interface PermanenceTopic {
  id: string;
  stage: 'ingreso' | 'novedades' | 'desercion' | 'productiva' | 'certificacion';
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  bulletPoints: string[];
  deadlinesOrRules?: string;
}

export interface FaultClassification {
  id: string;
  type: 'academica' | 'disciplinaria';
  gravity: 'leve' | 'grave' | 'gravisima';
  title: string;
  description: string;
  examples: string[];
  consequence: string;
}

export type UserRole = 'aprendiz' | 'instructor' | 'bienestar';

export interface AuthUser {
  username: string;
  fullName: string;
  role: UserRole;
  documentId?: string;
  trainingProgram?: string;
  cohortNumber?: string;
  isRegistered?: boolean;
}

export interface WellnessDimension {
  id: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  inductionObjective: string;
  servicesOffered: string[];
  coordinatorContact: string;
}

export interface WellnessApprenticeCase {
  id: string;
  apprenticeName: string;
  documentId: string;
  program: string;
  cohort: string;
  stratum: number;
  priorityCategory: 'ninguna' | 'victima_conflicto' | 'discapacidad' | 'madre_cabeza_hogar' | 'indigena_afro' | 'vulnerabilidad_extrema';
  priorityLabel: string;
  requestedSupport: 'ninguno' | 'apoyo_regular' | 'apoyo_fic' | 'bono_alimentacion' | 'monitoria';
  requestedSupportLabel: string;
  riskStatus: 'bajo' | 'medio' | 'alto';
  riskReason: string;
  psychosocialIntervention: string;
  attendanceInductionPct: number;
  status: 'atendido' | 'en_seguimiento' | 'pendiente_documentos';
}

export interface WellnessWorkshop {
  id: string;
  title: string;
  objective: string;
  speaker: string;
  durationHours: number;
  deliveryDate: string;
  mandatory: boolean;
  attendedCohorts: number;
  totalCohorts: number;
  status: 'completado' | 'en_curso' | 'programado';
}

