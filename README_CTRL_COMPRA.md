# CTRL+COMPRA — versión corregida

Prototipo educativo de tienda simulada para explorar decisiones de consumo responsable.

## Cambios incluidos

- La misión de conservar al menos 40 € se evalúa al terminar las cuatro decisiones y muestra un resultado claro.
- El jugador debe identificar qué factor influyó en cada decisión. Los resultados se basan en ese autorreporte y ya no se infieren únicamente por haber comprado un producto.
- Se añadió un historial de las cuatro decisiones con producto, elección y motivo señalado.
- La cuenta atrás de la pantalla de decisión funciona de verdad y, al llegar a cero, no penaliza al jugador. Se identifica como simulación, sin escasez ni ofertas reales.
- Las insignias se desbloquean según condiciones concretas de la partida y se muestran en los resultados.
- La comparación muestra alternativas simuladas específicas por producto y el ahorro estimado; no se presentan como ofertas reales verificadas.
- El progreso de la partida se guarda en `localStorage`; desde la portada se puede continuar o iniciar una nueva partida.
- Las cuatro opciones otorgan la misma cantidad de XP, para no premiar arbitrariamente una decisión sobre otra. El presupuesto y el resumen de consecuencias siguen cambiando según la elección.
- La satisfacción se actualiza sin castigar automáticamente las opciones de esperar o no comprar.
- Se añadieron etiquetas de diálogo accesibles, cierre con Escape, foco visible y manejo de imágenes que no cargan.
- Se aclaró que la tienda, los precios, las tendencias y las ofertas son simulados y que no se realizan compras reales.
- Se separaron los datos/modelos (`src/game-model.ts`) y el componente de iconos (`src/components/Icon.tsx`) para reducir la concentración de código en `App.tsx`.

## Ejecutar localmente

Requiere Node.js compatible con Vite 8 y conexión para instalar las dependencias la primera vez.

```bash
npm install
npm run dev
```

Para compilar:

```bash
npm run build
```

## Validación realizada en este entorno

- Se comprobó la transpilación sintáctica TypeScript/JSX de todos los archivos de `src`.
- No fue posible completar `npm install` ni ejecutar la compilación de producción en este entorno porque el registro de paquetes npm no era accesible por un error de red DNS (`EAI_AGAIN`). Por ello, la compilación final debe verificarse en un equipo con acceso al registro de paquetes.

## Alcance y límites

Este es un prototipo de aprendizaje: no procesa pagos, no consulta precios reales y no mide psicológicamente al usuario. Las influencias son autorreportadas; el perfil es orientativo. La partida se conserva en el navegador del mismo dispositivo mediante `localStorage`.
