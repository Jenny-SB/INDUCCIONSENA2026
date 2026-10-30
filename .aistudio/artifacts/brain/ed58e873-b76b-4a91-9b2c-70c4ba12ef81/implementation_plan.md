# Plan de Integración: Sincronización Automática con Google Drive y Google Sheets

Sistema de sincronización bidireccional en tiempo real entre el Portal de Inducción SENA y una hoja de cálculo institucional alojada en Google Drive, permitiendo el registro automático de aprendices y sus calificaciones de evaluación de apropiación.

---

## Decisiones Críticas y Revisión del Usuario

> [!IMPORTANT]
> A continuación se resumen las decisiones confirmadas en la fase de clarificación con el usuario:

- **Creación de la Hoja en Google Drive**: Se auto-creará automáticamente un nuevo archivo en el Google Drive del usuario/instructor titulado `"SENA - Registro de Aprendices e Inducción 2026"`, con cabeceras institucionales formateadas y protegidas.
- **Momento de Sincronización**: En dos momentos exactos:
  1. *Al registrarse o iniciar sesión*: Se sincroniza la fila inicial del aprendiz con sus datos personales, ficha y estado `"En Proceso de Inducción"`.
  2. *Al finalizar la evaluación interactiva*: Se actualiza la fila con el puntaje final obtenido, estado de aprobación (`Aprobado / No Aprobado`), fecha/hora y código de certificación.
- **Columnas de la Hoja de Cálculo**:
  - `Marca Temporal (Fecha y Hora)`
  - `Tipo y Número de Documento`
  - `Nombre Completo del Aprendiz`
  - `Ficha de Caracterización`
  - `Programa de Formación`
  - `Estado de Inducción`
  - `Puntaje de Evaluación (%)`
  - `Resultado Oficial (Aprobado >= 80% / No Aprobado)`
  - `ID de Certificación / Constancia`
- **Flujo de Autorización**: Mediante Google OAuth 2.0 (`https://www.googleapis.com/auth/drive.file` y `https://www.googleapis.com/auth/spreadsheets`) utilizando Firebase Auth en el cliente, conforme al estándar de seguridad de Google Workspace.

---

## 1. Concepto Central y Experiencia de Usuario

### ¿Qué hace el sistema?
Permite que cada aprendiz que ingresa y realiza su inducción en el prototipo quede automáticamente reflejado en una hoja de cálculo en Google Drive en tiempo real. Los instructores y directivos del centro pueden auditar el avance formativo, descargar reportes consolidados en Excel/Sheets y contar con una base de datos centralizada sin intervención manual.

### Flujo de Usuario:
1. **Configuración Inicial del Instructor (Una sola vez)**:
   - El instructor conecta su cuenta institucional mediante el botón oficial *"Conectar Google Drive y Sheets"*.
   - El sistema crea la hoja `"SENA - Registro de Aprendices e Inducción 2026"` en su Drive con estilo institucional (verde SENA `#39A900`, tipografía clara, filtros automáticos).
   - El enlace directo a la hoja queda guardado y accesible desde el panel.
2. **Flujo del Aprendiz (Registro)**:
   - El aprendiz presiona *"Ingresar como Aprendiz"*, diligencia sus datos (Nombre, Documento, Ficha, Programa).
   - Al registrarse, se envía la fila a Google Sheets en segundo plano con estado `"En Inducción"`.
3. **Flujo del Aprendiz (Evaluación)**:
   - El aprendiz presenta la evaluación interactiva oficial de 10 preguntas.
   - Al enviar el examen, el puntaje obtenido y el estado de aprobación se actualizan en la fila correspondiente de la hoja de cálculo.
4. **Retroalimentación en Tiempo Real**:
   - Indicador discreto de sincronización (*"✓ Guardado en Google Sheets"*) sin interrumpir la experiencia pedagógica.

---

## 2. Arquitectura del Sistema y Flujo de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PORTAL DE INDUCCIÓN SENA                      │
└────────────────────────────────────────────────────────────────────────┘
          │                                           │
          ▼                                           ▼
┌───────────────────────────┐               ┌───────────────────────────┐
│   Pantalla de Acceso      │               │   Módulo de Evaluación    │
│   (Registro de Aprendiz)  │               │   (10 Preguntas)          │
└───────────────────────────┘               └───────────────────────────┘
          │                                           │
          │ [1. Al Registrarse]                       │ [2. Al Evaluar]
          ▼                                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Servicio de Sincronización (sheetsSyncService.ts)          │
│                                                                        │
│  - Gestor de Token OAuth (Firebase Auth Google Provider)               │
│  - Localizador/Creador de Hoja: "SENA - Registro de Aprendices 2026"   │
│  - Mutaciones Batch: AppendRow / UpdateValues                          │
└────────────────────────────────────────────────────────────────────────┘
          │                                           │
          ▼                                           ▼
┌───────────────────────────┐               ┌───────────────────────────┐
│   Google Drive API v3     │               │   Google Sheets API v4    │
│   (drive.googleapis.com)  │               │   (sheets.googleapis.com) │
│                           │               │                           │
│   - Crear archivo Sheets  │               │   - Formatear cabeceras   │
│   - drive.file scope      │               │   - Insertar/actualizar   │
└───────────────────────────┘               └───────────────────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  Hoja en Google Drive     │
                    │  (Visualizable y en Vivo) │
                    └───────────────────────────┘
```

---

## 3. Componentes y Módulos a Implementar

### A. Servicio de Integración Google Workspace (`/src/services/googleSheetsService.ts`)
- **Autenticación**:
  - `initGoogleAuth()`: Inicializa el listener de estado de Firebase Auth.
  - `signInWithGoogle()`: Despliega el popup oficial de Google solicitando scopes mínimos:
    - `https://www.googleapis.com/auth/drive.file`
    - `https://www.googleapis.com/auth/spreadsheets`
  - `getCachedAccessToken()`: Mantiene el token en memoria sin persistir secretos en localStorage.
- **Gestión de Hoja de Cálculo**:
  - `getOrCreateInductionSpreadsheet(token)`:
    - Busca si ya existe una hoja con el título oficial creada por la app.
    - Si no existe, crea una nueva vía `POST https://sheets.googleapis.com/v4/spreadsheets`.
    - Inserta la fila de cabecera con formato corporativo SENA (fondo verde `#39A900`, texto blanco en negrita, congelamiento de fila 1).
- **Sincronización de Datos**:
  - `syncApprenticeRow(token, spreadsheetId, data)`: Agrega o actualiza la fila según el número de documento.

### B. Panel de Control de Sincronización en `InstructorDashboard.tsx`
- Tarjeta de integración de Google Workspace:
  - Estado de conexión (Cuenta de Google vinculada).
  - Enlace directo *"Abrir Hoja en Google Drive"* (icono externo de Sheets).
  - Contador de aprendices sincronizados en la nube.
  - Botón de sincronización manual masiva (*"Sincronizar Todas las Fichas"*).
  - Historial de última sincronización.

### C. Conexión de Eventos en el Flujo de la Aplicación
1. **En `PortalAccess.tsx` (Registro)**:
   - Al completar el registro, si la hoja está vinculada, se envía la fila inicial automáticamente.
2. **En `InteractiveEvaluation.tsx` (Finalización)**:
   - Al calcular el puntaje final (botón *"Finalizar y Enviar Evaluación"*), se sincroniza el resultado, porcentaje y fecha.

---

## 4. Estructura de Columnas de la Hoja de Cálculo

| Columna | Nombre de Campo | Ejemplo de Dato |
| :--- | :--- | :--- |
| **A** | `Fecha y Hora` | `28/10/2026 09:45:12` |
| **B** | `Tipo Doc.` | `CC` |
| **C** | `Número Documento` | `1020849312` |
| **D** | `Nombre del Aprendiz` | `Laura Camila Rodríguez Parra` |
| **E** | `Ficha de Caracterización` | `2825491` |
| **F** | `Programa de Formación` | `Tecnólogo en Análisis y Desarrollo de Software` |
| **G** | `Estado de Inducción` | `Completada / Evaluada` |
| **H** | `Puntaje (%)` | `100%` |
| **I** | `Resultado Oficial` | `APROBADO` |
| **J** | `Código Certificado` | `SENA-IND-2026-1020849` |

---

## 5. Estado de Ejecución

- [x] **Configuración de OAuth**: Scopes `drive.file` y `spreadsheets` aprobados y configurados con Firebase Auth.
- [x] **Servicios `googleWorkspaceAuth.ts` y `googleSheetsService.ts`**: Implementados con manejo de token en memoria, creación de hoja estilizada SENA verde `#39A900` y sincronización idempotente por número de cédula.
- [x] **Panel del Instructor (`InstructorDashboard.tsx`)**: Tarjeta en vivo con estado de sincronización, botón "Conectar Cuenta de Google", botón directo "Abrir Hoja en Drive", y "Sincronizar Todo".
- [x] **Triggers Automáticos en `App.tsx`**:
  - Al ingresar o registrarse como aprendiz (`PortalAccess.tsx`): Sincronización en segundo plano con estado `"En Inducción"`.
  - Al finalizar la evaluación interactiva: Sincronización del puntaje final (%), resultado oficial (`APROBADO` / `NO APROBADO`), marca temporal y código de certificado.
- [x] **Verificación**: `lint_applet` (0 errores) y `compile_applet` (éxito).
