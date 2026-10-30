import React, { useState } from 'react';
import { BookOpen, X, Search, CheckCircle, Shield, Award, HelpCircle, FileSpreadsheet, Download, ExternalLink } from 'lucide-react';
import { SenaLogo } from './SenaLogo.tsx';

interface ManualModalProps {
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('todos');

  const sections = [
    { id: 'todos', label: 'Todo el Manual' },
    { id: 'acceso', label: '1. Ingreso y Registro' },
    { id: 'identidad', label: '2. Identidad y Símbolos' },
    { id: 'reglamento', label: '3. Reglamento (Acuerdo 0009)' },
    { id: 'dilemas', label: '4. Simulador de Dilemas' },
    { id: 'evaluacion', label: '5. Evaluación y Certificado' },
    { id: 'bienestar', label: '6. Bienestar al Aprendiz' },
    { id: 'drive', label: '7. Sincronización Google Drive' },
  ];

  const handleDownloadMarkdown = () => {
    const link = document.createElement('a');
    link.href = '/manual.md';
    link.download = 'manual_del_aprendiz_sena.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#39A900] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#00324D] dark:text-white">
                  Manual de Usuario para Aprendices
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guía completa de navegación, módulos formativos, evaluación y sincronización
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Descargar archivo manual.md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .md</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-[#00324D] text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {(activeSection === 'todos' || activeSection === 'acceso') && (
            <section className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#00324D] dark:text-emerald-400 font-bold text-base">
                <span>1. Pantalla de Acceso e Inicio de Sesión</span>
              </div>
              <p>
                Al abrir la plataforma encontrarás dos botones principales: <strong>"Ingresar como Aprendiz"</strong> e <strong>"Ingresar como Instructor"</strong>.
              </p>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Paso a paso para el aprendiz:</span>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Haz clic en <strong>"Ingresar como Aprendiz"</strong>.</li>
                  <li>Diligencia tu usuario (número de documento) y tu contraseña institucional.</li>
                  <li>Si eres nuevo, presiona <em>"¿No tienes cuenta? Regístrate aquí"</em> para registrar tu nombre completo, tipo de documento, ficha y programa de formación.</li>
                  <li>Al ingresar, se te redirecciona directamente a la <strong>Ruta de Inducción</strong>.</li>
                  <li>Tus datos se sincronizan automáticamente en segundo plano con la hoja de Google Drive de tu cohorte.</li>
                </ul>
              </div>
            </section>
          )}

          {(activeSection === 'todos' || activeSection === 'identidad') && (
            <section className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#00324D] dark:text-emerald-400 font-bold text-base">
                <span>2. Módulo de Identidad Institucional y Símbolos</span>
              </div>
              <p>
                Permite comprender la misión del SENA, sus valores y el significado heráldico de sus emblemas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-[#00324D] dark:text-emerald-400 block mb-1">El Escudo y Bandera</span>
                  <span>El escudo plasma los 3 sectores de la economía nacional (campo, industria y servicios) y la bandera blanca representa la paz y la transparencia.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-[#00324D] dark:text-emerald-400 block mb-1">El Logotipo y el Himno</span>
                  <span>La figura humana representa al aprendiz caminando hacia su futuro; el himno rinde tributo a la patria y al trabajo creador.</span>
                </div>
              </div>
            </section>
          )}

          {(activeSection === 'todos' || activeSection === 'reglamento') && (
            <section className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#00324D] dark:text-emerald-400 font-bold text-base">
                <span>3. Módulo de Reglamento del Aprendiz (Acuerdo 0009 de 2024)</span>
              </div>
              <p>
                Conoce las normas de convivencia, deberes, derechos y garantías procesales:
              </p>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <strong className="text-[#39A900]">Ingreso y Permanencia:</strong> Trámites de aplazamiento (máximo 6 meses), traslados, reingresos y retiro voluntario. La <em>deserción</em> se configura con 3 días hábiles consecutivos de inasistencia injustificada.
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <strong className="text-slate-900 dark:text-white">Derechos y Deberes:</strong> Plazo máximo de 8 días hábiles para que los instructores califiquen evidencias; justificación de inasistencias dentro de los 3 días hábiles posteriores.
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
                  <strong className="text-amber-800 dark:text-amber-300">Medidas Formativas y Sanciones:</strong> Desde el llamado de atención verbal y plan de mejoramiento hasta condicionamiento o cancelación de matrícula (inhabilidad de 6 a 24 meses).
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                  <strong className="text-blue-800 dark:text-blue-300">Debido Proceso:</strong> Citación formal con 3 días de anticipación, presentación de descargos en el Comité y derecho a interponer Recurso de Reposición en los 5 días hábiles siguientes.
                </div>
              </div>
            </section>
          )}

          {(activeSection === 'todos' || activeSection === 'dilemas') && (
            <section className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#00324D] dark:text-emerald-400 font-bold text-base">
                <span>4. Simulador Interactivo de Dilemas Éticos</span>
              </div>
              <p>
                Afronta casos reales de formación. Al seleccionar una opción recibirás:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>La consecuencia práctica de tu elección en el ambiente de formación.</li>
                <li>El artículo específico del Acuerdo 0009 de 2024 que fundamenta la acción.</li>
                <li>Una lección reflexiva para afianzar tu criterio ético profesional.</li>
              </ul>
            </section>
          )}

          {(activeSection === 'todos' || activeSection === 'evaluacion') && (
            <section className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#00324D] dark:text-emerald-400 font-bold text-base">
                <span>5. Evaluación Oficial y Certificado de Inducción</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p><strong>10 preguntas interactivas:</strong> Ponderadas según los ejes de la inducción.</p>
                <p><strong>Umbral de Aprobación:</strong> Debes alcanzar un mínimo de <strong>80%</strong> para aprobar.</p>
                <p><strong>Certificado Oficial:</strong> Al aprobar, se habilita la constancia institucional con código de validación alfanumérico, firma digital y opción de impresión / guardado en PDF.</p>
                <p><strong>Reintentos:</strong> Puedes repetir la prueba cuantas veces sea necesario para reforzar los temas no dominados.</p>
              </div>
            </section>
          )}

          {(activeSection === 'todos' || activeSection === 'bienestar') && (
            <section className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[#00324D] dark:text-emerald-400 font-bold text-base">
                <span>6. Módulo de Bienestar al Aprendiz</span>
              </div>
              <p>
                Conoce las áreas de apoyo integral del SENA:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white block">Salud Integral</span>
                  <span>Primeros auxilios y prevención.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white block">Apoyo Socioeconómico</span>
                  <span>FIC, sostenimiento regular y bonos.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white block">Deporte y Cultura</span>
                  <span>Grupos representativos y torneos.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white block">Psicología</span>
                  <span>Acompañamiento psicopedagógico.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white block">Liderazgo</span>
                  <span>Voceros y representantes de centro.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white block">Monitorías</span>
                  <span>Apoyo a ambientes de formación.</span>
                </div>
              </div>
            </section>
          )}

          {(activeSection === 'todos' || activeSection === 'drive') && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-[#00324D] dark:text-emerald-400 font-bold text-base">
                <span>7. Sincronización Automática con Google Drive</span>
              </div>
              <p>
                Tu avance queda registrado de forma segura e inmediata en la hoja de cálculo de tu instructor:
              </p>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <span className="font-bold text-[#39A900] block">Beneficios para el aprendiz:</span>
                <p>✓ No necesitas enviar capturas ni correos manuales con tu resultado.</p>
                <p>✓ Tu instructor y coordinación verifican tu aprobación en tiempo real.</p>
                <p>✓ Se genera una auditoría transparente de tu matrícula.</p>
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Archivo de texto completo disponible en la raíz del proyecto: <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">manual.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#00324D] dark:bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            Entendido, Cerrar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
