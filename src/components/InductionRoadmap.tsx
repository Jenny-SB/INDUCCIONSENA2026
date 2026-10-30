import React from 'react';
import { ArrowRight, Compass, Shield, HeartHandshake, HelpCircle, Award, CheckCircle, HeartPulse, BookOpen, Play } from 'lucide-react';

interface InductionRoadmapProps {
  onNavigate: (tab: string) => void;
  evaluationCompleted: boolean;
  score?: number;
  onOpenManual?: () => void;
  onOpenVideo?: () => void;
}

export const InductionRoadmap: React.FC<InductionRoadmapProps> = ({
  onNavigate,
  evaluationCompleted,
  score,
  onOpenManual,
  onOpenVideo,
}) => {
  const roadmapSteps = [
    {
      step: 'Fase 01',
      title: 'Identidad, Historia y Símbolos Institucionales',
      description: 'Descubre el legado de Rodolfo Martínez Tono, la misión transformadora del SENA y el significado del escudo, la bandera, el logosímbolo y el himno marcial.',
      tab: 'identidad',
      icon: Compass,
      status: 'Disponible',
      actionText: 'Explorar Símbolos',
    },
    {
      step: 'Fase 02',
      title: 'Reglamento del Aprendiz: Derechos y Deberes',
      description: 'Estudia el nuevo Acuerdo 0009 de 2024: tus garantías académicas, entornos virtuales, inclusión, la justificación de inasistencias en 3 días hábiles y el debido proceso ante el Comité.',
      tab: 'reglamento',
      icon: Shield,
      status: 'Fundamental',
      actionText: 'Ver Derechos y Deberes',
    },
    {
      step: 'Fase 03',
      title: 'Plan Integral de Bienestar y Apoyos',
      description: 'Conoce tus beneficios: apoyos de sostenimiento (FIC y Regular), bonos de alimentación, acompañamiento psicosocial, deporte, cultura y elección de voceros de ficha.',
      tab: 'bienestar',
      icon: HeartPulse,
      status: 'Integral',
      actionText: 'Explorar Bienestar',
    },
    {
      step: 'Fase 04',
      title: 'Dilemas Éticos y Casos Cotidianos',
      description: 'Entrena tu criterio con situaciones auténticas: listas de asistencia, seguridad en laboratorios, derechos de autor y resolución dialogada de desacuerdos.',
      tab: 'dilemas',
      icon: HelpCircle,
      status: 'Práctico',
      actionText: 'Resolver Dilemas',
    },
    {
      step: 'Fase 05',
      title: 'Evaluación Interactiva de Apropiación',
      description: 'Presenta el examen situacional de 10 preguntas. Con 80% o más de aciertos certificarás oficialmente tu proceso de inducción y recibirás tu diploma digital.',
      tab: 'evaluacion',
      icon: Award,
      status: evaluationCompleted ? 'Aprobado' : 'Requerido',
      actionText: evaluationCompleted ? `Ver Resultado (${score}%)` : 'Iniciar Examen',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Visual Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>Formación Profesional Integral</span>
              <span aria-hidden="true">·</span>
              <span>SENA Colombia</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Ruta Oficial de Inducción para Aprendices
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              La inducción garantiza que cada aprendiz inicie su etapa lectiva con plena conciencia de sus derechos, 
              su rol transformador en el país y los estándares de convivencia y seguridad exigidos en los ambientes SENA.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('identidad')}
                className="px-4 py-2.5 text-xs font-bold text-[#00324D] bg-white hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Iniciar Fase 1</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('evaluacion')}
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8800] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Ir Directo a la Evaluación</span>
              </button>

              {onOpenManual && (
                <button
                  onClick={onOpenManual}
                  className="px-4 py-2.5 text-xs font-bold text-slate-100 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Manual del Aprendiz</span>
                </button>
              )}

              {onOpenVideo && (
                <button
                  onClick={onOpenVideo}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600/90 hover:bg-emerald-600 border border-emerald-400/30 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Video Tutorial</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src="/src/assets/images/sena_apprentices_learning_1793115113619.jpg"
              alt="Aprendices del SENA en laboratorio de automatización y tecnología"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* 4 Phases Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#00324D] dark:text-white">
            Etapas de la Inducción Institucional
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">4 Fases Integradas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roadmapSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-[#39A900] dark:hover:border-[#39A900] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-mono font-bold text-[#39A900]">{step.step}</span>
                    <span className="text-slate-400 dark:text-slate-400 font-medium">{step.status}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#00324D] dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 group-hover:text-[#39A900] transition-colors flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#39A900] transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-slate-400">Contenido interactivo</span>
                  <button
                    onClick={() => onNavigate(step.tab)}
                    className="text-xs font-bold text-[#39A900] hover:text-[#2e8800] flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
