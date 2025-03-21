import { getAppSubpageRoute, TRAININGS_ROUTE } from "../../../routes.ts";

export enum TRAINING_IDS {
  intercultural = 'intercultural',
  misunderstandings = 'misunderstandings',
}

export const TRAININGS_DATA = {
  [TRAINING_IDS.misunderstandings]: {
    id: TRAINING_IDS.misunderstandings,
    title: 'Kulturelle Missverständnisse & Vorurteile',
    description: 'resources.trainings.misunderstandings.description',
    bio: 'resources.trainings.misunderstandings.teacher',
    slug: 'kulturelle-missverstaendnisse',
    link: getAppSubpageRoute(TRAININGS_ROUTE, 'kulturelle-missverstaendnisse'),
    linkText: 'resources.trainings.training_cta',
    image: 'https://home.little-world.com/wp-content/uploads/2025/03/Kulturelle-Missverstandnisse-Thumbnail.jpg',
    altImage: 'Kulturelle Missverständnisse Training',
    hasHandout: true,
    video: [
      {
        id: 'gzJWyH6tg7I',
        label: 'Kulturelle Missverständnisse & Vorurteile - Missverständnisse',
      },
      {
        id: 'p2zls4SjnPQ',
        label: 'Kulturelle Missverständnisse & Vorurteile - Was sind Vorurteile?',
      },
      {
        id: 't0QnPD9HpHo',
        label: 'Kulturelle Missverständnisse & Vorurteile - Mikroaggressionen',
      },
      {
        id: 'lI7JhoYyb4c',
        label: 'Kulturelle Missverständnisse & Vorurteile - Folgen von Vorurteilen',
      },
    ],
  },
  [TRAINING_IDS.intercultural]: {
    id: TRAINING_IDS.intercultural,
    title: 'Interkulturelle Kommunikation',
    slug: 'interkulturelle-kommunikation',
    description: 'resources.trainings.intercultural.description',
    bio: 'resources.trainings.intercultural.teacher',
    link: getAppSubpageRoute(TRAININGS_ROUTE, 'interkulturelle-kommunikation'),
    linkText: 'resources.trainings.training_cta',
    image: 'https://home.little-world.com/wp-content/uploads/2025/03/Interkulturelle-Kommunikation-Thumbnail.jpg',
    altImage: 'Interkulturelle Kommunikation Training',
    hasHandout: false,
    video: [
      {
        id: 'HEAtdAeYiQg?si=CFfTat_UccuT-OL6',
        label: 'Interkulturelle Kommunikation - Achtsamer Umgang',
      },
      {
        id: 'aEVKGlXfNzk?si=dqJ5osXnDpHZ_rcq',
        label: 'Interkulturelle Kommunikation - Selbstreflexion',
      },
      {
        id: 'NmzP_hBtWmU?si=TAnA_ukURlcjIxD_',
        label: 'Interkulturelle Kommunikation - Fremdreflexion',
      },
      {
        id: 'tVmQYvID-4A?si=rhxinzEdDZITbA5Y',
        label: 'Interkulturelle Kommunikation - Umgang miteinander',
      },
      {
        id: 'RFIqBk84ckc?si=7BMf1jEvXfkfSKiK',
        label:
          'Interkulturelle Kommunikation - Theorie muss sein: Kulturdimensionen',
      },
      {
        id: 'aaN4Htfkp4I?si=fy88MDx4-y7RNC-j',
        label: 'Interkulturelle Kommunikation - Sensibilisierung',
      },
    ],
  }
};

// Reverse mapping from slugs to IDs (O(1) lookup)
export const SLUG_TO_ID: Record<string, TRAINING_IDS> = Object.entries(
  TRAININGS_DATA,
).reduce((acc, [id, data]) => {
  acc[data.slug] = id as TRAINING_IDS;
  return acc;
}, {} as Record<string, TRAINING_IDS>);
