// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  beforeSend(event) {
    // Check if it is an exception, and if so, show the report dialog
    if (event.exception && event.event_id) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },
  enabled: process.env.NODE_ENV === "production",
  dsn: "https://44a38013248fc3bb92a011488b6dce92@o4507999317131264.ingest.us.sentry.io/4507999456329728",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      showBranding: false,
      triggerLabel: "Reportar un Error",
      triggerAriaLabel: "Reportar un Error",
      formTitle: "Reportar un Error",
      submitButtonLabel: "Enviar Reporte de Error",
      cancelButtonLabel: "Cancelar",
      confirmButtonLabel: "Confirmar",
      addScreenshotButtonLabel: "Añadir una captura de pantalla",
      removeScreenshotButtonLabel: "Eliminar captura de pantalla",
      nameLabel: "Nombre",
      namePlaceholder: "Tu Nombre",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "tu.correo@ejemplo.com",
      isRequiredLabel: "(obligatorio)",
      messageLabel: "Descripción",
      messagePlaceholder: "¿Cuál es el error? ¿Qué esperabas?",
      successMessageText: "¡Gracias por tu reporte!",
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
