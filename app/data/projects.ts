import type { Localized } from "../lib/i18n";

export type Project = {
  title: string;
  year: string;
  description: Localized;
  highlight?: Localized;
  live: string;
  /** Show Vekipper's live user count (app/api/vekipper-users). */
  liveUsers?: boolean;
};

export const projects: Project[] = [
  {
    title: "Vekipper",
    year: "2026",
    description: {
      es: "Centro de mando personal en la web que reúne Google Calendar, Google Tasks y Gmail en una sola pantalla, pensado para tenerlo abierto todo el día. La sincronización va en ambos sentidos: lo que cambias en Vekipper aparece en Google, y al revés.",
      en: "Personal web command center that brings Google Calendar, Google Tasks and Gmail together on a single screen, built to stay open all day. Changes sync both ways, so anything edited in Vekipper shows up in Google and vice versa.",
    },
    live: "https://vekipper.com",
    liveUsers: true,
  },
];
