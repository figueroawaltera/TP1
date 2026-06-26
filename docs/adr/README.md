# Architecture Decision Records

Este directorio documenta las decisiones de diseño relevantes del proyecto ComfyChair mediante ADRs (*Architecture Decision Records*).

Cada ADR sigue una estructura simple:

- **Estado**: propuesta, aceptada, reemplazada o deprecada.
- **Contexto**: problema o situación que motiva la decisión.
- **Decisión**: solución adoptada.
- **Consecuencias**: impactos positivos, negativos y compromisos.

## ADRs

| ADR | Título | Estado |
| --- | --- | --- |
| [ADR-001](./001-usar-patron-state-para-etapas-de-session.md) | Usar patrón State para modelar las etapas de una sesión | Aceptada |
| [ADR-002](./002-usar-strategy-para-politicas-de-aceptacion.md) | Usar patrón Strategy para políticas de aceptación de artículos | Aceptada |
| [ADR-003](./003-centralizar-reglas-de-score-y-limites-de-revision.md) | Centralizar reglas de score y límites de revisión | Propuesta |
| [ADR-004](./004-refactorizar-asignacion-de-revisores.md) | Refactorizar la asignación de revisores | Propuesta |
| [ADR-005](./005-encapsular-colecciones-internas.md) | Encapsular colecciones internas del dominio | Propuesta |
| [ADR-006](./006-normalizar-nombres-y-corregir-assigment.md) | Normalizar nombres y corregir `Assigment` a `Assignment` | Propuesta |

## Criterio de uso

Los ADRs aceptados describen decisiones ya presentes en el diseño actual. Los ADRs propuestos documentan oportunidades de refactorización identificadas para mejorar mantenibilidad, legibilidad y protección de invariantes del dominio.
