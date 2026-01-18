import LernFairLogo from '../../../images/partners/lern-fair-logo.svg';
import LernFairImage from '../../../images/partners/lern-fair-studying.jpg';
import {
  PARTNERS_ROUTE,
  TRAININGS_ROUTE,
  getAppSubpageRoute,
} from '../../../router/routes';

const LERN_FAIR_YT_ID = 'lA4CIXDXXK8';

export enum PARTNERS_DATA_IDS {
  babbel = 'babbel',
  lewagon = 'lewagon',
  lernfair = 'lernfair',
  patenmatch = 'patenmatch',
}

export const PARTNERS_DATA = {
  // To be included when we do a more comprehensive intergation of Patenmatch
  // patenmatch: {
  //   id: PARTNERS_DATA_IDS.patenmatch,
  //   title: 'Patenmatch',
  //   description: 'resources.partners.patenmatch.description',
  //   slug: 'patenmatch',
  //   link: getAppSubpageRoute(PARTNERS_ROUTE, 'patenmatch'),
  //   linkText: 'resources.partners.partner_cta',
  //   image:
  //     'https://home.little-world.com/wp-content/uploads/2025/03/Patenmatch-logo.svg',
  // },
  // babbel: {
  //   id: PARTNERS_DATA_IDS.babbel,
  //   title: 'Babbel',
  //   description: 'resources.partners.babbel.description',
  //   slug: 'babbel',
  //   link: getAppSubpageRoute(PARTNERS_ROUTE, 'babbel'),
  //   linkText: 'resources.partners.partner_cta',
  //   ctaLink: BABBEL_REDIRECT,
  //   image: BabbelLogo,
  // },
  lernFair: {
    id: PARTNERS_DATA_IDS.lernfair,
    title: 'Lern Fair',
    description: 'resources.partners.lernfair.description',
    slug: 'lern-fair',
    link: getAppSubpageRoute(PARTNERS_ROUTE, 'lern-fair'),
    linkText: 'resources.partners.partner_cta',
    ctaLink: 'https://app.lern-fair.de/welcome',
    image: LernFairLogo,
    additionalImage: LernFairImage,
    additionalAltImage: 'Girl studying',
    videoId: LERN_FAIR_YT_ID,
  },
};

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
    image:
      'https://home.little-world.com/wp-content/uploads/2026/01/Kulturelle-Missverstaendnisse-und-Vorurteile.jpg',
    altImage: 'Kulturelle Missverständnisse Training',
    hasHandout: true,
    video: [
      {
        id: 'gzJWyH6tg7I',
        label: 'Kulturelle Missverständnisse & Vorurteile - Missverständnisse',
      },
      {
        id: 'p2zls4SjnPQ',
        label:
          'Kulturelle Missverständnisse & Vorurteile - Was sind Vorurteile?',
      },
      {
        id: 't0QnPD9HpHo',
        label: 'Kulturelle Missverständnisse & Vorurteile - Mikroaggressionen',
      },
      {
        id: 'lI7JhoYyb4c',
        label:
          'Kulturelle Missverständnisse & Vorurteile - Folgen von Vorurteilen',
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
    image:
      'https://home.little-world.com/wp-content/uploads/2026/01/Interkulturellen-Kommunikation-Workshop.jpg',
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
  },
};

type DataWithSlug = { slug: string } & Record<string, any>;

export function getDataBySlug<TIds extends string, TData extends DataWithSlug>(
  data: Record<TIds, TData>,
  slug?: string,
): TData | null {
  if (!slug) return null;

  const slugToIdMap = Object.entries(data).reduce((acc, [id, itemData]) => {
    acc[(itemData as DataWithSlug).slug] = id as TIds;
    return acc;
  }, {} as Record<string, TIds>);

  const id = slugToIdMap[slug];
  return id ? data[id] : null;
}
