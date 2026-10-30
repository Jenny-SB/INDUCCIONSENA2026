import React, { useState } from 'react';
import { DILEMMA_CASES } from '../data/senaData.ts';
import { DilemmaCase } from '../types.ts';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export const DilemmasSimulator: React.FC = () => {
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [resolvedDilemmas, setResolvedDilemmas] = useState<Record<string, string>>({});

  const dilemma = DILEMMA_CASES[currentDilemmaIndex];
  const selectedOption = dilemma.options.find((opt) => opt.id === selectedOptionId);

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setResolvedDilemmas((prev) => ({
      ...prev,
      [dilemma.id]: optionId,
    }));
  };

  const handleNextDilemma = () => {
    if (currentDilemmaIndex < DILEMMA_CASES.length - 1) {
      setCurrentDilemmaIndex((prev) => prev + 1);
      setSelectedOptionId(resolvedDilemmas[DILEMMA_CASES[currentDilemmaIndex + 1]?.id] || null);
    }
  };

  const handlePrevDilemma = () => {
    if (currentDilemmaIndex > 0) {
      setCurrentDilemmaIndex((prev) => prev - 1);
      setSelectedOptionId(resolvedDilemmas[DILEMMA_CASES[currentDilemmaIndex - 1]?.id] || null);
    }
  };

  const handleReset = () => {
    setResolvedDilemmas({});
    setSelectedOptionId(null);
    setCurrentDilemmaIndex(0);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 text-center space-y-2 transition-colors">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="text-[#39A900] font-semibold">Simulador de Casos</span>
          <span aria-hidden="true">·</span>
          <span>Toma de Decisiones Éticas</span>
          <span aria-hidden="true">·</span>
          <span>Vida del Aprendiz</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white tracking-tight">
          Dilemas Cotidianos en la Vida del Aprendiz
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Ponte a prueba en situaciones reales que viven los aprendices en aulas, talleres y empresas patrocinadoras.
          Analiza el dilema y elige la conducta ética más acertada según el Reglamento.
        </p>
      </div>

      {/* Progress indicators */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Caso {currentDilemmaIndex + 1} de {DILEMMA_CASES.length}
        </span>
        <div className="flex gap-1.5">
          {DILEMMA_CASES.map((d, idx) => {
            const isAnswered = Boolean(resolvedDilemmas[d.id]);
            const isCurrent = idx === currentDilemmaIndex;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setCurrentDilemmaIndex(idx);
                  setSelectedOptionId(resolvedDilemmas[d.id] || null);
                }}
                className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                    : isAnswered
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dilemma Card */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#00324D] dark:text-white">{dilemma.title}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {dilemma.scenario}
            </p>
          </div>
        </div>

        {/* Options list */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            ¿Qué decisión tomarías tú como aprendiz integral?
          </div>

          {dilemma.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-[#39A900] ring-1 ring-[#39A900]'
                      : 'bg-red-50/80 dark:bg-red-950/50 border-red-400 ring-1 ring-red-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-[#39A900] border-[#39A900] text-white'
                        : 'bg-red-500 border-red-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 text-slate-400'
                  }`}
                >
                  {isSelected ? (opt.isCorrect ? '✓' : '✗') : ''}
                </div>
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {opt.action}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback block once answered */}
        {selectedOption && (
          <div
            className={`p-5 rounded-xl border animate-in fade-in space-y-3 ${
              selectedOption.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {selectedOption.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#39A900]" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
              <h4 className="text-sm font-bold">
                {selectedOption.isCorrect ? '¡Conducta Acorde al Reglamento SENA!' : 'Atención: Decisión No Adecuada'}
              </h4>
            </div>

            <p className="text-xs leading-relaxed">
              <strong>Consecuencia en el entorno formativo:</strong> {selectedOption.consequence}
            </p>

            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <strong>Lección normativa:</strong> {selectedOption.regulationLesson}
            </div>
          </div>
        )}

        {/* Navigation between dilemmas */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrevDilemma}
            disabled={currentDilemmaIndex === 0}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:text-slate-900 dark:hover:text-white cursor-pointer disabled:cursor-not-allowed"
          >
            ← Caso Anterior
          </button>

          <button
            onClick={handleReset}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Simulador</span>
          </button>

          {currentDilemmaIndex < DILEMMA_CASES.length - 1 ? (
            <button
              onClick={handleNextDilemma}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#00324D] dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Siguiente Caso</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="text-xs font-semibold text-[#39A900]">
              ¡Todos los casos revisados!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
