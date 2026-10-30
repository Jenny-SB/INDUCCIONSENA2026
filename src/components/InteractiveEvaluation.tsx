import React, { useState, useEffect } from 'react';
import { EVALUATION_QUESTIONS } from '../data/senaData.ts';
import { Question, ApprenticeResult, AuthUser } from '../types.ts';
import { SenaLogo } from './SenaLogo.tsx';
import { Award, CheckCircle2, XCircle, AlertCircle, Clock, ArrowRight, ArrowLeft, RotateCcw, FileText, Share2, Sparkles } from 'lucide-react';

interface InteractiveEvaluationProps {
  onCompleteEvaluation: (result: ApprenticeResult) => void;
  onOpenCertificate: (result: ApprenticeResult) => void;
  savedResult: ApprenticeResult | null;
  onGoToTab: (tab: string) => void;
  currentUser?: AuthUser | null;
}

export const InteractiveEvaluation: React.FC<InteractiveEvaluationProps> = ({
  onCompleteEvaluation,
  onOpenCertificate,
  savedResult,
  onGoToTab,
  currentUser,
}) => {
  // Apprentice form state (pre-filled with authenticated user if available)
  const [apprenticeName, setApprenticeName] = useState<string>(
    currentUser?.fullName || 'Laura Camila Rodríguez Parra'
  );
  const [documentId, setDocumentId] = useState<string>(
    currentUser?.documentId || '1020849312'
  );
  const [trainingProgram, setTrainingProgram] = useState<string>(
    currentUser?.trainingProgram || 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)'
  );
  const [cohortNumber, setCohortNumber] = useState<string>(
    currentUser?.cohortNumber || '2825491'
  );
  const [regional, setRegional] = useState<string>('Distrito Capital');
  const [centerName, setCenterName] = useState<string>('Centro de Tecnologías para la Construcción y la Madera');

  // Quiz state
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(savedResult));
  const [activeResult, setActiveResult] = useState<ApprenticeResult | null>(savedResult);

  // Timer
  useEffect(() => {
    let interval: number | undefined;
    if (isQuizStarted && !isSubmitted) {
      interval = window.setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizStarted, isSubmitted]);

  const currentQ: Question = EVALUATION_QUESTIONS[currentQuestionIndex];
  const totalQuestions = EVALUATION_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleStartQuiz = () => {
    if (!apprenticeName.trim() || !documentId.trim() || !cohortNumber.trim()) {
      alert('Por favor completa tu nombre, documento y número de ficha.');
      return;
    }
    setIsQuizStarted(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setSecondsElapsed(0);
    setCurrentQuestionIndex(0);
  };

  const handleCalculateScore = () => {
    let correctCount = 0;
    const catMap: Record<string, { correct: number; total: number }> = {};

    EVALUATION_QUESTIONS.forEach((q) => {
      const chosen = selectedAnswers[q.id];
      const isCorrect = chosen === q.correctAnswerId;
      if (isCorrect) correctCount++;

      if (!catMap[q.categoryLabel]) {
        catMap[q.categoryLabel] = { correct: 0, total: 0 };
      }
      catMap[q.categoryLabel].total += 1;
      if (isCorrect) {
        catMap[q.categoryLabel].correct += 1;
      }
    });

    const finalScore = Math.round((correctCount / totalQuestions) * 100);
    const passed = finalScore >= 80;

    const breakdown = Object.entries(catMap).map(([category, data]) => ({
      category,
      score: data.correct,
      total: data.total,
    }));

    const resultObj: ApprenticeResult = {
      id: `eval-${Date.now()}`,
      apprenticeName,
      documentId,
      trainingProgram,
      cohortNumber,
      regional,
      centerName,
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      score: finalScore,
      totalQuestions,
      correctAnswersCount: correctCount,
      passed,
      categoryBreakdown: breakdown,
      answersGiven: selectedAnswers,
    };

    setActiveResult(resultObj);
    setIsSubmitted(true);
    onCompleteEvaluation(resultObj);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 text-center space-y-2 transition-colors">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-[#39A900] font-semibold">Módulo 4</span>
          <span aria-hidden="true">·</span>
          <span>Apropiación del Proceso</span>
          <span aria-hidden="true">·</span>
          <span>Evaluación Oficial</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white tracking-tight">
          Evaluación Interactiva de Inducción SENA
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Verifica si has asimilado la identidad institucional, tus derechos, deberes y el régimen de convivencia.
          Al obtener 80% o más, recibirás tu <strong>Certificado Digital de Aprobación de Inducción</strong>.
        </p>
      </div>

      {/* STATE 1: REGISTRATION / WELCOME BEFORE START */}
      {!isQuizStarted && !isSubmitted && (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center shrink-0">
              <SenaLogo className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#00324D] dark:text-white">
                Registro del Aprendiz para la Evaluación
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Estos datos se registrarán en el reporte del instructor y en tu constancia oficial de inducción.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nombre Completo del Aprendiz *
              </label>
              <input
                type="text"
                value={apprenticeName}
                onChange={(e) => setApprenticeName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Número de Documento (T.I. / C.C.) *
              </label>
              <input
                type="text"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                placeholder="Ej. 1020304050"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Programa de Formación *
              </label>
              <input
                type="text"
                value={trainingProgram}
                onChange={(e) => setTrainingProgram(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                placeholder="Ej. ADSO / Gestión Administrativa"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Número de Ficha de Caracterización *
              </label>
              <input
                type="text"
                value={cohortNumber}
                onChange={(e) => setCohortNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                placeholder="Ej. 2825491"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Regional SENA</label>
              <input
                type="text"
                value={regional}
                onChange={(e) => setRegional(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                placeholder="Ej. Distrito Capital / Antioquia"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Centro de Formación</label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                placeholder="Ej. CTCM / CTI"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white block">Condiciones de la Evaluación:</span>
            <ul className="list-disc list-inside space-y-1">
              <li>10 preguntas situacionales basadas en casos reales del Reglamento del Aprendiz y los Símbolos.</li>
              <li>Puntaje mínimo de aprobación institucional: <strong>80% (8 de 10 aciertos)</strong>.</li>
              <li>Retroalimentación formativa inmediata con fundamentación normativa por cada pregunta.</li>
              <li>Si no alcanzas el puntaje, podrás repasar los módulos y reintentar la prueba.</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartQuiz}
              className="w-full py-3 text-sm font-semibold text-white bg-[#39A900] hover:bg-[#2e8800] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Comenzar Evaluación de Apropiación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: ACTIVE QUIZ IN PROGRESS */}
      {isQuizStarted && !isSubmitted && (
        <div className="space-y-6">
          {/* Top Bar Status */}
          <div className="bg-white dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#00324D] dark:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                Pregunta {currentQuestionIndex + 1} / {totalQuestions}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                {answeredCount} respondidas ({progressPercent}%)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="tabular-nums font-bold">{formatTimer(secondsElapsed)}</span>
              </div>

              {answeredCount === totalQuestions && (
                <button
                  onClick={handleCalculateScore}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8800] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Finalizar Evaluación
                </button>
              )}
            </div>
          </div>

          {/* Question Navigator Dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {EVALUATION_QUESTIONS.map((q, idx) => {
              const isSelected = Boolean(selectedAnswers[q.id]);
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#00324D] dark:bg-emerald-600 text-white ring-2 ring-[#00324D]/30'
                      : isSelected
                      ? 'bg-[#39A900] text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Question Box */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[#39A900] font-semibold">{currentQ.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Caso Situacional</span>
              </div>

              {currentQ.situationContext && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300 italic">
                  <strong>Situación:</strong> {currentQ.situationContext}
                </div>
              )}

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const isChecked = selectedAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-[#39A900] ring-1 ring-[#39A900]'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        isChecked
                          ? 'bg-[#39A900] border-[#39A900] text-white'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {opt.text}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stepper controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#00324D] dark:bg-emerald-700 hover:bg-slate-800 dark:hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleCalculateScore}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8800] rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Enviar Respuestas y Calificar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: RESULTS & APPROPRIATION ANALYSIS */}
      {isSubmitted && activeResult && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Main Score Banner */}
          <div
            className={`rounded-2xl p-6 sm:p-8 border shadow-sm ${
              activeResult.passed
                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {activeResult.passed ? (
                    <CheckCircle2 className="w-7 h-7 text-[#39A900]" />
                  ) : (
                    <AlertCircle className="w-7 h-7 text-amber-600" />
                  )}
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {activeResult.passed
                      ? '¡Apropiación Exitosa del Proceso de Inducción!'
                      : 'Nivel de Apropiación en Proceso de Refuerzo'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed">
                  {activeResult.passed
                    ? `Felicitaciones, ${activeResult.apprenticeName}. Has demostrado un conocimiento sólido del Reglamento del Aprendiz y la Identidad SENA.`
                    : `${activeResult.apprenticeName}, necesitas un puntaje mínimo del 80% para certificar la inducción. Revisa los módulos de refuerzo y presenta la prueba de nuevo.`}
                </p>
              </div>

              {/* Big Score badge */}
              <div className="bg-white dark:bg-[#0f172a] px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-xs shrink-0 min-w-[140px]">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#00324D] dark:text-white tabular-nums">
                  {activeResult.score}%
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeResult.correctAnswersCount} / {activeResult.totalQuestions} Aciertos
                </div>
              </div>
            </div>

            {/* Action buttons on banner */}
            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center gap-3">
              {activeResult.passed ? (
                <button
                  onClick={() => onOpenCertificate(activeResult)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8800] rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Generar y Descargar Certificado de Inducción</span>
                </button>
              ) : (
                <button
                  onClick={handleStartQuiz}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reintentar Evaluación</span>
                </button>
              )}

              <button
                onClick={() => onGoToTab('instructor')}
                className="px-4 py-2.5 text-xs font-semibold text-[#00324D] dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Ver en Panel de Gestión del Instructor
              </button>
            </div>
          </div>

          {/* Breakdown by Dimension */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
            <h4 className="text-base font-bold text-[#00324D] dark:text-white">
              Apropiación por Competencias y Dimensiones
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeResult.categoryBreakdown.map((cat, idx) => {
                const percentage = Math.round((cat.score / cat.total) * 100);
                return (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{cat.category}</span>
                      <span className="font-mono font-bold text-[#00324D] dark:text-emerald-400 tabular-nums">
                        {cat.score} / {cat.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          percentage >= 80 ? 'bg-[#39A900]' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#00324D] dark:text-white">
                  Retroalimentación Detallada Pregunta por Pregunta
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Revisa los fundamentos normativos y las explicaciones pedagógicas de cada respuesta.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {EVALUATION_QUESTIONS.map((q, idx) => {
                const userChosen = activeResult.answersGiven[q.id];
                const isCorrect = userChosen === q.correctAnswerId;
                const chosenOption = q.options.find((o) => o.id === userChosen);
                const correctOption = q.options.find((o) => o.id === q.correctAnswerId);

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-xl border text-xs sm:text-sm space-y-3 ${
                      isCorrect
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                            isCorrect ? 'bg-[#39A900]' : 'bg-amber-600'
                          }`}
                        >
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {idx + 1}. {q.question}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">
                        {q.categoryLabel}
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-7 text-xs">
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Tu respuesta: </strong>
                        <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-amber-800 dark:text-amber-300 line-through'}>
                          {chosenOption ? chosenOption.text : 'Sin respuesta'}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div>
                          <strong className="text-emerald-800 dark:text-emerald-300">Respuesta correcta: </strong>
                          <span className="text-emerald-900 dark:text-emerald-200 font-medium">{correctOption?.text}</span>
                        </div>
                      )}

                      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-300 mt-2">
                        <p><strong>Justificación formativa: </strong>{q.feedbackExplanation}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 font-mono">{q.ruleReference}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
