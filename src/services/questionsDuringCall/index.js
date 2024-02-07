import Cookie from 'js-cookie';
import React from 'react';

import { BACKEND_URL } from '../../ENVIRONMENT';

const DATA = {
  data: [
    {
      id: 1,
      uuid: '3e1e09da-389e-4900-87c3-9a473af3a2b3',
      content: {
        en: 'Have you ever missed out on something because of fear?',
        de: 'Gibt es etwas, das du bereust aus Angst nicht getan zu haben?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'aGF2ZS15b3UtZXZlci1taXNzZWQtb3V0LW9uLXNvbWV0aGluZy1iZWNhdXNlLW9mLWZlYXItZ2lidC1lcy1ldHdhcy1kYXMtZHUtYmVyZXVzdC1hdXMtYW5nc3QtbmljaHQtZ2V0YW4tenUtaGFiZW4=',
    },
    {
      id: 2,
      uuid: '3d6c5ac7-9019-4520-bba0-0c4f7ca8cf6a',
      content: {
        en: 'What situations make you feel shy?',
        de: 'In welchen Situationen fühlst du dich schüchtern?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'd2hhdC1zaXR1YXRpb25zLW1ha2UteW91LWZlZWwtc2h5LWluLXdlbGNoZW4tc2l0dWF0aW9uZW4tZnVobHN0LWR1LWRpY2gtc2NodWNodGVybg==',
    },
    {
      id: 3,
      uuid: 'e436f9f6-29ff-4f36-8b3b-9cb41ac640bb',
      content: {
        en: 'Are you skilled at apologizing?',
        de: 'Bist du gut darin, dich zu entschuldigen?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'YXJlLXlvdS1za2lsbGVkLWF0LWFwb2xvZ2l6aW5nLWJpc3QtZHUtZ3V0LWRhcmluLWRpY2gtenUtZW50c2NodWxkaWdlbg==',
    },
    {
      id: 4,
      uuid: 'b04ad84d-abaa-4b32-9ab3-0d13b4270c25',
      content: {
        en: 'What makes you feel envious?',
        de: 'Was macht dich neidisch?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'd2hhdC1tYWtlcy15b3UtZmVlbC1lbnZpb3VzLXdhcy1tYWNodC1kaWNoLW5laWRpc2No',
    },
    {
      id: 5,
      uuid: 'e874c9d5-b1c3-4ecd-91f1-15c2b34d98c7',
      content: {
        en: 'What causes you the most stress?',
        de: 'Was stresst dich am meisten?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'd2hhdC1jYXVzZXMteW91LXRoZS1tb3N0LXN0cmVzcy13YXMtc3RyZXNzdC1kaWNoLWFtLW1laXN0ZW4=',
    },
    {
      id: 6,
      uuid: '4547fbc7-01b0-46fa-93f5-00f484612f84',
      content: {
        en: 'In what areas are you content with being good enough?',
        de: 'In welchen Bereichen bist du froh, gut genug zu sein?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'aW4td2hhdC1hcmVhcy1hcmUteW91LWNvbnRlbnQtd2l0aC1iZWluZy1nb29kLWVub3VnaC1pbi13ZWxjaGVuLWJlcmVpY2hlbi1iaXN0LWR1LWZyb2gtZ3V0LWdlbnVnLXp1LXNlaW4=',
    },
    {
      id: 7,
      uuid: '980d889d-47a7-46f1-9f79-dcca8cb6befe',
      content: {
        en: 'When was the last time you experienced "Schadenfreude"? Can you share what triggered it?',
        de: 'Wann hast du das letzte Mal Schadenfreude erlebt? Traust du dich zuzugeben, was es ausgelöst hat?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'd2hlbi13YXMtdGhlLWxhc3QtdGltZS15b3UtZXhwZXJpZW5jZWQtc2NoYWRlbmZyZXVkZS1jYW4teW91LXNoYXJlLXdoYXQtdHJpZ2dlcmVkLWl0LXdhbm4taGFzdC1kdS1kYXMtbGV0enRlLW1hbC1zY2hhZGVuZnJldWRlLWVybGVidC10cmF1c3QtZHUtZGljaC16dXp1Z2ViZW4td2FzLWVzLWF1c2dlbG9zdC1oYXQ=',
    },
    {
      id: 8,
      uuid: '0f919039-674a-4617-b0da-26f27abd4856',
      content: {
        en: 'In what ways are you still the same as you were in your childhood?',
        de: 'In welcher Hinsicht bist du immer noch dieselbe Person, die du als Kind warst?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'aW4td2hhdC13YXlzLWFyZS15b3Utc3RpbGwtdGhlLXNhbWUtYXMteW91LXdlcmUtaW4teW91ci1jaGlsZGhvb2QtaW4td2VsY2hlci1oaW5zaWNodC1iaXN0LWR1LWltbWVyLW5vY2gtZGllc2VsYmUtcGVyc29uLWRpZS1kdS1hbHMta2luZC13YXJzdA==',
    },
    {
      id: 9,
      uuid: '2a3a81a9-3d03-4ee7-a131-49f587b877b2',
      content: {
        en: 'What do you think people say about you when they gossip?',
        de: 'Was denkst du, was die Leute sagen, wenn sie über dich lästern?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'd2hhdC1kby15b3UtdGhpbmstcGVvcGxlLXNheS1hYm91dC15b3Utd2hlbi10aGV5LWdvc3NpcC13YXMtZGVua3N0LWR1LXdhcy1kaWUtbGV1dGUtc2FnZW4td2Vubi1zaWUtdWJlci1kaWNoLWxhc3Rlcm4=',
    },
    {
      id: 10,
      uuid: '9154bc31-8c4a-42db-916a-1e5ac7ab7929',
      content: {
        en: 'Do you consider yourself a competitive person?',
        de: 'Bist du wettbewerbsorientiert?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'ZG8teW91LWNvbnNpZGVyLXlvdXJzZWxmLWEtY29tcGV0aXRpdmUtcGVyc29uLWJpc3QtZHUtd2V0dGJld2VyYnNvcmllbnRpZXJ0',
    },
    {
      id: 11,
      uuid: 'daec0086-2d3c-49cd-b78b-d9f4af13d831',
      content: {
        en: 'To what degree do you feel that life is better elsewhere?',
        de: 'Inwieweit neigst du dazu zu denken, dass das Leben woanders besser ist?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'dG8td2hhdC1kZWdyZWUtZG8teW91LWZlZWwtdGhhdC1saWZlLWlzLWJldHRlci1lbHNld2hlcmUtaW53aWV3ZWl0LW5laWdzdC1kdS1kYXp1LXp1LWRlbmtlbi1kYXNzLWRhcy1sZWJlbi13b2FuZGVycy1iZXNzZXItaXN0',
    },
    {
      id: 12,
      uuid: '1b578b23-6b10-4248-bc0c-00108333c518',
      content: {
        en: 'How susceptible are you to addiction?',
        de: 'Inwieweit neigst du zu Abhängigkeiten?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'aG93LXN1c2NlcHRpYmxlLWFyZS15b3UtdG8tYWRkaWN0aW9uLWlud2lld2VpdC1uZWlnc3QtZHUtenUtYWJoYW5naWdrZWl0ZW4=',
    },
    {
      id: 13,
      uuid: 'e77a8006-a11c-48b7-bc97-1ced61cba99d',
      content: {
        en: 'Do you believe others consider you to be a good listener?',
        de: 'Glaubst du, dass andere Menschen dich für einen guten Zuhörer halten?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'ZG8teW91LWJlbGlldmUtb3RoZXJzLWNvbnNpZGVyLXlvdS10by1iZS1hLWdvb2QtbGlzdGVuZXItZ2xhdWJzdC1kdS1kYXNzLWFuZGVyZS1tZW5zY2hlbi1kaWNoLWZ1ci1laW5lbi1ndXRlbi16dWhvcmVyLWhhbHRlbg==',
    },
    {
      id: 14,
      uuid: 'a2135dad-9fea-4c8a-af1d-bf6ef014ce46',
      content: {
        en: 'Have you ever acted without complete integrity?',
        de: 'Wann hast du ohne 100%ige Integrität gehandelt?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'aGF2ZS15b3UtZXZlci1hY3RlZC13aXRob3V0LWNvbXBsZXRlLWludGVncml0eS13YW5uLWhhc3QtZHUtb2huZS0xMDBpZ2UtaW50ZWdyaXRhdC1nZWhhbmRlbHQ=',
    },
    {
      id: 15,
      uuid: '194cdb37-428a-4f2e-be6f-8d852c98ff48',
      content: {
        en: 'How well do you handle criticism?',
        de: 'Wie gut kannst du mit Kritik umgehen?',
      },
      is_archived: false,
      category_name: {
        en: 'Personal',
        de: 'Persönlich',
      },
      slug: 'aG93LXdlbGwtZG8teW91LWhhbmRsZS1jcml0aWNpc20td2llLWd1dC1rYW5uc3QtZHUtbWl0LWtyaXRpay11bWdlaGVu',
    },
    {
      id: 16,
      uuid: '744e5ad6-df8f-4b13-8ab0-3b7a8822a1de',
      content: {
        en: 'What is a piece of art that you admire and why do you like it?',
        de: 'Beschreibe ein Kunstwerk, das du wirklich magst, und warum?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'd2hhdC1pcy1hLXBpZWNlLW9mLWFydC10aGF0LXlvdS1hZG1pcmUtYW5kLXdoeS1kby15b3UtbGlrZS1pdC1iZXNjaHJlaWJlLWVpbi1rdW5zdHdlcmstZGFzLWR1LXdpcmtsaWNoLW1hZ3N0LXVuZC13YXJ1bQ==',
    },
    {
      id: 17,
      uuid: '0ea2df3b-6f8f-4ae2-8af1-494a068ec97b',
      content: {
        en: 'What piece of art would you choose to own if you could pick only one and why?',
        de: 'Wenn du ein beliebiges Kunstwerk besitzen könntest, welches wäre es und warum?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'd2hhdC1waWVjZS1vZi1hcnQtd291bGQteW91LWNob29zZS10by1vd24taWYteW91LWNvdWxkLXBpY2stb25seS1vbmUtYW5kLXdoeS13ZW5uLWR1LWVpbi1iZWxpZWJpZ2VzLWt1bnN0d2Vyay1iZXNpdHplbi1rb25udGVzdC13ZWxjaGVzLXdhcmUtZXMtdW5kLXdhcnVt',
    },
    {
      id: 18,
      uuid: '082ba9cb-0570-4912-b749-e8efec542738',
      content: {
        en: 'What qualities make for an ideal host or hostess?',
        de: 'Welche Fähigkeiten hat der ideale Gastgeber oder die ideale Gastgeberin?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'd2hhdC1xdWFsaXRpZXMtbWFrZS1mb3ItYW4taWRlYWwtaG9zdC1vci1ob3N0ZXNzLXdlbGNoZS1mYWhpZ2tlaXRlbi1oYXQtZGVyLWlkZWFsZS1nYXN0Z2ViZXItb2Rlci1kaWUtaWRlYWxlLWdhc3RnZWJlcmlu',
    },
    {
      id: 19,
      uuid: '224af139-d96a-4629-9667-354dd6037d6d',
      content: {
        en: 'Can you describe your personal style and preferences when it comes to interior design?',
        de: 'Kannst du deinen eigenen Geschmack in Bezug auf Interieur und Design beschreiben?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'Y2FuLXlvdS1kZXNjcmliZS15b3VyLXBlcnNvbmFsLXN0eWxlLWFuZC1wcmVmZXJlbmNlcy13aGVuLWl0LWNvbWVzLXRvLWludGVyaW9yLWRlc2lnbi1rYW5uc3QtZHUtZGVpbmVuLWVpZ2VuZW4tZ2VzY2htYWNrLWluLWJlenVnLWF1Zi1pbnRlcmlldXItdW5kLWRlc2lnbi1iZXNjaHJlaWJlbg==',
    },
    {
      id: 20,
      uuid: 'dbdee513-769c-46d7-a32c-dc08b178372f',
      content: {
        en: 'How has music influenced your perspective on life?',
        de: 'Wie hat Musik deine Sicht auf das Leben beeinflusst?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'aG93LWhhcy1tdXNpYy1pbmZsdWVuY2VkLXlvdXItcGVyc3BlY3RpdmUtb24tbGlmZS13aWUtaGF0LW11c2lrLWRlaW5lLXNpY2h0LWF1Zi1kYXMtbGViZW4tYmVlaW5mbHVzc3Q=',
    },
    {
      id: 21,
      uuid: '18ffd3fd-37e5-4d81-aca6-ec4195f0b887',
      content: {
        en: 'What sources of culture do you seek out to gain insight into everyday issues?',
        de: 'Welche kulturellen Quellen helfen dir, eine neue Perspektive auf alltägliche Belange zu erhalten?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'd2hhdC1zb3VyY2VzLW9mLWN1bHR1cmUtZG8teW91LXNlZWstb3V0LXRvLWdhaW4taW5zaWdodC1pbnRvLWV2ZXJ5ZGF5LWlzc3Vlcy13ZWxjaGUta3VsdHVyZWxsZW4tcXVlbGxlbi1oZWxmZW4tZGlyLWVpbmUtbmV1ZS1wZXJzcGVrdGl2ZS1hdWYtYWxsdGFnbGljaGUtYmVsYW5nZS16dS1lcmhhbHRlbg==',
    },
    {
      id: 22,
      uuid: 'b8e2f771-58df-4bbf-a7fe-879efe9544f6',
      content: {
        en: 'Have you ever had disagreements with your partner or friends about matters of taste?',
        de: 'Haben du und dein Partner oder deine Freunde schon einmal über Geschmack gestritten?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'aGF2ZS15b3UtZXZlci1oYWQtZGlzYWdyZWVtZW50cy13aXRoLXlvdXItcGFydG5lci1vci1mcmllbmRzLWFib3V0LW1hdHRlcnMtb2YtdGFzdGUtaGFiZW4tZHUtdW5kLWRlaW4tcGFydG5lci1vZGVyLWRlaW5lLWZyZXVuZGUtc2Nob24tZWlubWFsLXViZXItZ2VzY2htYWNrLWdlc3RyaXR0ZW4=',
    },
    {
      id: 23,
      uuid: 'c989184a-791e-4996-9b2a-46909c70f977',
      content: {
        en: 'Is the quality of a work of art reflected in its price?',
        de: 'Spiegelt der Preis eines Kunstwerks jemals seine Qualität wider?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'aXMtdGhlLXF1YWxpdHktb2YtYS13b3JrLW9mLWFydC1yZWZsZWN0ZWQtaW4taXRzLXByaWNlLXNwaWVnZWx0LWRlci1wcmVpcy1laW5lcy1rdW5zdHdlcmtzLWplbWFscy1zZWluZS1xdWFsaXRhdC13aWRlcg==',
    },
    {
      id: 24,
      uuid: 'e712e8a8-3e3c-4df5-b188-c36a37ba289e',
      content: {
        en: 'If you had to choose only one, which medium would you prefer: art, film, literature, or music?',
        de: 'Wenn du nur ein Medium haben könntest, welches würdest du wählen: Kunst, Film, Literatur oder Musik?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'aWYteW91LWhhZC10by1jaG9vc2Utb25seS1vbmUtd2hpY2gtbWVkaXVtLXdvdWxkLXlvdS1wcmVmZXItYXJ0LWZpbG0tbGl0ZXJhdHVyZS1vci1tdXNpYy13ZW5uLWR1LW51ci1laW4tbWVkaXVtLWhhYmVuLWtvbm50ZXN0LXdlbGNoZXMtd3VyZGVzdC1kdS13YWhsZW4ta3Vuc3QtZmlsbS1saXRlcmF0dXItb2Rlci1tdXNpaw==',
    },
    {
      id: 25,
      uuid: 'cc26d860-7676-4f7c-89f8-f3de7ae4ebae',
      content: {
        en: 'Has a work of literature or art ever had a direct impact on your life?',
        de: 'Hat ein Werk der Literatur oder Kunst jemals dein Leben direkt beeinflusst?',
      },
      is_archived: false,
      category_name: {
        en: 'Culture',
        de: 'Kultur',
      },
      slug: 'aGFzLWEtd29yay1vZi1saXRlcmF0dXJlLW9yLWFydC1ldmVyLWhhZC1hLWRpcmVjdC1pbXBhY3Qtb24teW91ci1saWZlLWhhdC1laW4td2Vyay1kZXItbGl0ZXJhdHVyLW9kZXIta3Vuc3QtamVtYWxzLWRlaW4tbGViZW4tZGlyZWt0LWJlZWluZmx1c3N0',
    },
    {
      id: 26,
      uuid: '258f4cbe-150c-4665-9c4e-5ce77a5099e4',
      content: {
        en: 'Are you willing to connect people from different parts of your life, or do you prefer to keep them separate?',
        de: 'Bevorzugst du es, Menschen aus deinen verschiedenen Lebensbereichen zu trennen oder miteinander zu verbinden?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'YXJlLXlvdS13aWxsaW5nLXRvLWNvbm5lY3QtcGVvcGxlLWZyb20tZGlmZmVyZW50LXBhcnRzLW9mLXlvdXItbGlmZS1vci1kby15b3UtcHJlZmVyLXRvLWtlZXAtdGhlbS1zZXBhcmF0ZS1iZXZvcnp1Z3N0LWR1LWVzLW1lbnNjaGVuLWF1cy1kZWluZW4tdmVyc2NoaWVkZW5lbi1sZWJlbnNiZXJlaWNoZW4tenUtdHJlbm5lbi1vZGVyLW1pdGVpbmFuZGVyLXp1LXZlcmJpbmRlbg==',
    },
    {
      id: 27,
      uuid: '024826ba-0876-4143-b2b0-1c25c8da9a72',
      content: {
        en: 'What are some of the best things that you feel you owe to your parents?',
        de: 'Was sind die besten Dinge, die du deinen Eltern verdankst?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'd2hhdC1hcmUtc29tZS1vZi10aGUtYmVzdC10aGluZ3MtdGhhdC15b3UtZmVlbC15b3Utb3dlLXRvLXlvdXItcGFyZW50cy13YXMtc2luZC1kaWUtYmVzdGVuLWRpbmdlLWRpZS1kdS1kZWluZW4tZWx0ZXJuLXZlcmRhbmtzdA==',
    },
    {
      id: 28,
      uuid: 'fafeb212-bdc2-4e62-8245-65729da2ce30',
      content: {
        en: 'What is the kindest thing that someone has ever done for you?',
        de: 'Was ist das Netteste, was jemand für dich getan hat?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'd2hhdC1pcy10aGUta2luZGVzdC10aGluZy10aGF0LXNvbWVvbmUtaGFzLWV2ZXItZG9uZS1mb3IteW91LXdhcy1pc3QtZGFzLW5ldHRlc3RlLXdhcy1qZW1hbmQtZnVyLWRpY2gtZ2V0YW4taGF0',
    },
    {
      id: 29,
      uuid: '5a652ce4-69c8-4d4e-b202-b09272769616',
      content: {
        en: 'What are some of your happiest memories with your parents?',
        de: 'Was sind deine schönsten Erinnerungen mit deinen Eltern?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'd2hhdC1hcmUtc29tZS1vZi15b3VyLWhhcHBpZXN0LW1lbW9yaWVzLXdpdGgteW91ci1wYXJlbnRzLXdhcy1zaW5kLWRlaW5lLXNjaG9uc3Rlbi1lcmlubmVydW5nZW4tbWl0LWRlaW5lbi1lbHRlcm4=',
    },
    {
      id: 30,
      uuid: 'e414adb0-e8a7-48bb-8c02-5a496a7db1d8',
      content: {
        en: 'Do you believe that the saying "they fuck you up, your mum and dad" holds any truth?',
        de: 'Inwiefern machen deine Eltern dir das Leben schwer, auch wenn das nicht ihre Intention ist?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'ZG8teW91LWJlbGlldmUtdGhhdC10aGUtc2F5aW5nLXRoZXktZnVjay15b3UtdXAteW91ci1tdW0tYW5kLWRhZC1ob2xkcy1hbnktdHJ1dGgtaW53aWVmZXJuLW1hY2hlbi1kZWluZS1lbHRlcm4tZGlyLWRhcy1sZWJlbi1zY2h3ZXItYXVjaC13ZW5uLWRhcy1uaWNodC1paHJlLWludGVudGlvbi1pc3Q=',
    },
    {
      id: 31,
      uuid: '8e9ada17-5d46-4a30-8810-a5590bba067d',
      content: {
        en: 'Which close relative do you have the least affinity for, and what is the reason?',
        de: 'Welchen nahen Verwandten magst du am wenigsten und warum?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'd2hpY2gtY2xvc2UtcmVsYXRpdmUtZG8teW91LWhhdmUtdGhlLWxlYXN0LWFmZmluaXR5LWZvci1hbmQtd2hhdC1pcy10aGUtcmVhc29uLXdlbGNoZW4tbmFoZW4tdmVyd2FuZHRlbi1tYWdzdC1kdS1hbS13ZW5pZ3N0ZW4tdW5kLXdhcnVt',
    },
    {
      id: 32,
      uuid: '32b1b2ea-06d8-4274-858a-6ae310880daf',
      content: {
        en: 'What do you know about your distant ancestors, beyond your great grandparents?',
        de: 'Was weißt du über deine entfernten Vorfahren, abgesehen von deinen Urgroßeltern?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'd2hhdC1kby15b3Uta25vdy1hYm91dC15b3VyLWRpc3RhbnQtYW5jZXN0b3JzLWJleW9uZC15b3VyLWdyZWF0LWdyYW5kcGFyZW50cy13YXMtd2VpdC1kdS11YmVyLWRlaW5lLWVudGZlcm50ZW4tdm9yZmFocmVuLWFiZ2VzZWhlbi12b24tZGVpbmVuLXVyZ3JvZWx0ZXJu',
    },
    {
      id: 33,
      uuid: 'a4e26e36-aaf2-45eb-9677-b1a758870e0c',
      content: {
        en: 'Among the people you spend time with, who brings out your best qualities?',
        de: 'Wer von den Menschen, mit denen du Zeit verbringst, bringt deine besten Eigenschaften zum Vorschein?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'YW1vbmctdGhlLXBlb3BsZS15b3Utc3BlbmQtdGltZS13aXRoLXdoby1icmluZ3Mtb3V0LXlvdXItYmVzdC1xdWFsaXRpZXMtd2VyLXZvbi1kZW4tbWVuc2NoZW4tbWl0LWRlbmVuLWR1LXplaXQtdmVyYnJpbmdzdC1icmluZ3QtZGVpbmUtYmVzdGVuLWVpZ2Vuc2NoYWZ0ZW4tenVtLXZvcnNjaGVpbg==',
    },
    {
      id: 34,
      uuid: '581f411b-1399-4990-b30a-c1e0e923e3b1',
      content: {
        en: 'What is the most surprising conversation you have ever had?',
        de: 'Welches ist das überraschendste Gespräch, das du je geführt hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'd2hhdC1pcy10aGUtbW9zdC1zdXJwcmlzaW5nLWNvbnZlcnNhdGlvbi15b3UtaGF2ZS1ldmVyLWhhZC13ZWxjaGVzLWlzdC1kYXMtdWJlcnJhc2NoZW5kc3RlLWdlc3ByYWNoLWRhcy1kdS1qZS1nZWZ1aHJ0LWhhc3Q=',
    },
    {
      id: 35,
      uuid: '2113802c-28c2-4a3e-815b-63e5ef6bae89',
      content: {
        en: 'Have you ever regretted losing touch with someone?',
        de: 'Gibt es jemanden, zu dem du es bedauerst, den Kontakt verloren zu haben?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'aGF2ZS15b3UtZXZlci1yZWdyZXR0ZWQtbG9zaW5nLXRvdWNoLXdpdGgtc29tZW9uZS1naWJ0LWVzLWplbWFuZGVuLXp1LWRlbS1kdS1lcy1iZWRhdWVyc3QtZGVuLWtvbnRha3QtdmVybG9yZW4tenUtaGFiZW4=',
    },
    {
      id: 36,
      uuid: 'b19493fa-9307-4316-9ea7-b75ed946d66b',
      content: {
        en: 'Who was the favourite family member when you were growing up?',
        de: 'Wer war als Kind der Liebling in deiner Familie?',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'd2hvLXdhcy10aGUtZmF2b3VyaXRlLWZhbWlseS1tZW1iZXItd2hlbi15b3Utd2VyZS1ncm93aW5nLXVwLXdlci13YXItYWxzLWtpbmQtZGVyLWxpZWJsaW5nLWluLWRlaW5lci1mYW1pbGll',
    },
    {
      id: 37,
      uuid: '743dc90c-150b-4236-a9c6-b49efb09833f',
      content: {
        en: 'Describe an important teacher in your life who was not associated with school.',
        de: 'Beschreibe einen wichtigen Lehrer in deinem Leben - außerhalb der Schule.',
      },
      is_archived: false,
      category_name: {
        en: 'Family',
        de: 'Familie',
      },
      slug: 'ZGVzY3JpYmUtYW4taW1wb3J0YW50LXRlYWNoZXItaW4teW91ci1saWZlLXdoby13YXMtbm90LWFzc29jaWF0ZWQtd2l0aC1zY2hvb2wtYmVzY2hyZWliZS1laW5lbi13aWNodGlnZW4tbGVocmVyLWluLWRlaW5lbS1sZWJlbi1hdWVyaGFsYi1kZXItc2NodWxl',
    },
    {
      id: 38,
      uuid: '2c5aec09-4351-48ba-ae29-1df16fa19d0b',
      content: {
        en: 'What is the first thing you typically check when you look in the mirror?',
        de: 'Wenn du in den Spiegel schaust, was überprüfst du dann als erstes?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hhdC1pcy10aGUtZmlyc3QtdGhpbmcteW91LXR5cGljYWxseS1jaGVjay13aGVuLXlvdS1sb29rLWluLXRoZS1taXJyb3Itd2Vubi1kdS1pbi1kZW4tc3BpZWdlbC1zY2hhdXN0LXdhcy11YmVycHJ1ZnN0LWR1LWRhbm4tYWxzLWVyc3Rlcw==',
    },
    {
      id: 39,
      uuid: 'fb936b2b-ec03-4a2a-8705-dde743e0efc8',
      content: {
        en: 'Who is the person who supports you the most or is your biggest fan?',
        de: 'Wer ist dein größter Fan?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hvLWlzLXRoZS1wZXJzb24td2hvLXN1cHBvcnRzLXlvdS10aGUtbW9zdC1vci1pcy15b3VyLWJpZ2dlc3QtZmFuLXdlci1pc3QtZGVpbi1ncm90ZXItZmFu',
    },
    {
      id: 40,
      uuid: 'a68e7793-ba22-4a8f-a009-7bf197d6d366',
      content: {
        en: 'Have you ever had a religious or spiritual experience?',
        de: 'Hattest du jemals eine religiöse Erfahrung?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'aGF2ZS15b3UtZXZlci1oYWQtYS1yZWxpZ2lvdXMtb3Itc3Bpcml0dWFsLWV4cGVyaWVuY2UtaGF0dGVzdC1kdS1qZW1hbHMtZWluZS1yZWxpZ2lvc2UtZXJmYWhydW5n',
    },
    {
      id: 41,
      uuid: '8bdbcc58-b446-4000-bebf-508f36130dce',
      content: {
        en: 'Do you have any techniques for staying calm or managing stress?',
        de: 'Hast du eine Technik, um ruhig zu bleiben?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'ZG8teW91LWhhdmUtYW55LXRlY2huaXF1ZXMtZm9yLXN0YXlpbmctY2FsbS1vci1tYW5hZ2luZy1zdHJlc3MtaGFzdC1kdS1laW5lLXRlY2huaWstdW0tcnVoaWctenUtYmxlaWJlbg==',
    },
    {
      id: 42,
      uuid: '0e98750d-8fc9-4033-b6f5-f09981897866',
      content: {
        en: 'Are you currently in the place in life that you wanted to be at this point?',
        de: 'Bist du da, wo du in dieser Phase deines Lebens sein wolltest?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'YXJlLXlvdS1jdXJyZW50bHktaW4tdGhlLXBsYWNlLWluLWxpZmUtdGhhdC15b3Utd2FudGVkLXRvLWJlLWF0LXRoaXMtcG9pbnQtYmlzdC1kdS1kYS13by1kdS1pbi1kaWVzZXItcGhhc2UtZGVpbmVzLWxlYmVucy1zZWluLXdvbGx0ZXN0',
    },
    {
      id: 43,
      uuid: 'ba13a9e6-a54a-4139-987d-d1bfa33d54cd',
      content: {
        en: 'Describe a memory associated with a taste or smell that holds significance for you.',
        de: 'Beschreibe eine Erinnerung an einen Geschmack oder Geruch und was er bei dir auslöst.',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'ZGVzY3JpYmUtYS1tZW1vcnktYXNzb2NpYXRlZC13aXRoLWEtdGFzdGUtb3Itc21lbGwtdGhhdC1ob2xkcy1zaWduaWZpY2FuY2UtZm9yLXlvdS1iZXNjaHJlaWJlLWVpbmUtZXJpbm5lcnVuZy1hbi1laW5lbi1nZXNjaG1hY2stb2Rlci1nZXJ1Y2gtdW5kLXdhcy1lci1iZWktZGlyLWF1c2xvc3Q=',
    },
    {
      id: 44,
      uuid: '53808b40-70e6-4923-acf0-2017a244d105',
      content: {
        en: 'When was the last time you cried due to pain or sadness?',
        de: 'Wann hast du zuletzt vor Schmerz oder Trauer geweint?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hlbi13YXMtdGhlLWxhc3QtdGltZS15b3UtY3JpZWQtZHVlLXRvLXBhaW4tb3Itc2FkbmVzcy13YW5uLWhhc3QtZHUtenVsZXR6dC12b3Itc2NobWVyei1vZGVyLXRyYXVlci1nZXdlaW50',
    },
    {
      id: 45,
      uuid: 'e0da590b-6aa2-4590-90dc-f725f0996cf3',
      content: {
        en: 'What was the best evening you have ever experienced?',
        de: 'Was war der schönste Abend, den du je erlebt hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hhdC13YXMtdGhlLWJlc3QtZXZlbmluZy15b3UtaGF2ZS1ldmVyLWV4cGVyaWVuY2VkLXdhcy13YXItZGVyLXNjaG9uc3RlLWFiZW5kLWRlbi1kdS1qZS1lcmxlYnQtaGFzdA==',
    },
    {
      id: 46,
      uuid: 'c1ccd170-1a88-49ce-8689-454868a4b510',
      content: {
        en: 'Why do you have the ambitions that you currently hold?',
        de: 'Warum hast du die Ambitionen, die du hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2h5LWRvLXlvdS1oYXZlLXRoZS1hbWJpdGlvbnMtdGhhdC15b3UtY3VycmVudGx5LWhvbGQtd2FydW0taGFzdC1kdS1kaWUtYW1iaXRpb25lbi1kaWUtZHUtaGFzdA==',
    },
    {
      id: 47,
      uuid: '651d818c-76d9-4236-b288-fa957490154d',
      content: {
        en: 'When do you feel lonely or isolated?',
        de: 'Wann fühlst du dich einsam oder isoliert?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hlbi1kby15b3UtZmVlbC1sb25lbHktb3ItaXNvbGF0ZWQtd2Fubi1mdWhsc3QtZHUtZGljaC1laW5zYW0tb2Rlci1pc29saWVydA==',
    },
    {
      id: 48,
      uuid: '8faaa631-8f8e-4fa9-97bb-a5e4d691a16a',
      content: {
        en: 'If you were to write a book, what would be the topic or subject?',
        de: 'Wenn du ein Buch schreiben müsstest, wovon würde es dann handeln?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'aWYteW91LXdlcmUtdG8td3JpdGUtYS1ib29rLXdoYXQtd291bGQtYmUtdGhlLXRvcGljLW9yLXN1YmplY3Qtd2Vubi1kdS1laW4tYnVjaC1zY2hyZWliZW4tbXVzc3Rlc3Qtd292b24td3VyZGUtZXMtZGFubi1oYW5kZWxu',
    },
    {
      id: 49,
      uuid: '5b5e4352-07f3-4723-bf63-4a1e118308d0',
      content: {
        en: 'Would you like to have faith in a higher power or God?',
        de: 'Würdest du gerne an eine höhere Macht oder Gott glauben?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd291bGQteW91LWxpa2UtdG8taGF2ZS1mYWl0aC1pbi1hLWhpZ2hlci1wb3dlci1vci1nb2Qtd3VyZGVzdC1kdS1nZXJuZS1hbi1laW5lLWhvaGVyZS1tYWNodC1vZGVyLWdvdHQtZ2xhdWJlbg==',
    },
    {
      id: 50,
      uuid: '20fbbab9-8d45-4c6f-8998-7098c700d3a5',
      content: {
        en: 'Would you ever consider psychotherapy and what do you hope to gain from it?',
        de: 'Würdest du eine Psychotherapie in Betracht ziehen und was würdest du dir davon erhoffen?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd291bGQteW91LWV2ZXItY29uc2lkZXItcHN5Y2hvdGhlcmFweS1hbmQtd2hhdC1kby15b3UtaG9wZS10by1nYWluLWZyb20taXQtd3VyZGVzdC1kdS1laW5lLXBzeWNob3RoZXJhcGllLWluLWJldHJhY2h0LXppZWhlbi11bmQtd2FzLXd1cmRlc3QtZHUtZGlyLWRhdm9uLWVyaG9mZmVu',
    },
    {
      id: 51,
      uuid: '0c4af9fa-b4aa-4e36-96b2-02f1206b3f54',
      content: {
        en: 'Do you believe that others envy you or are jealous of you in any way?',
        de: 'Wirst du von anderen beneidet?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'ZG8teW91LWJlbGlldmUtdGhhdC1vdGhlcnMtZW52eS15b3Utb3ItYXJlLWplYWxvdXMtb2YteW91LWluLWFueS13YXktd2lyc3QtZHUtdm9uLWFuZGVyZW4tYmVuZWlkZXQ=',
    },
    {
      id: 52,
      uuid: '69aadd75-eb4d-4e56-89fa-026be9ec7c37',
      content: {
        en: 'Is there a particular technique or method for loading a dishwasher effectively?',
        de: 'Verwendest du eine spezielle Methode, um die Spülmaschine effektiv zu befüllen?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'aXMtdGhlcmUtYS1wYXJ0aWN1bGFyLXRlY2huaXF1ZS1vci1tZXRob2QtZm9yLWxvYWRpbmctYS1kaXNod2FzaGVyLWVmZmVjdGl2ZWx5LXZlcndlbmRlc3QtZHUtZWluZS1zcGV6aWVsbGUtbWV0aG9kZS11bS1kaWUtc3B1bG1hc2NoaW5lLWVmZmVrdGl2LXp1LWJlZnVsbGVu',
    },
    {
      id: 53,
      uuid: '70e6624c-14af-4e06-819d-60aab5b36c3b',
      content: {
        en: 'What is the worst possible scenario or outcome that you can imagine?',
        de: 'Was ist das schlimmstmögliche Szenario, das du dir vorstellen kannst?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hhdC1pcy10aGUtd29yc3QtcG9zc2libGUtc2NlbmFyaW8tb3Itb3V0Y29tZS10aGF0LXlvdS1jYW4taW1hZ2luZS13YXMtaXN0LWRhcy1zY2hsaW1tc3Rtb2dsaWNoZS1zemVuYXJpby1kYXMtZHUtZGlyLXZvcnN0ZWxsZW4ta2FubnN0',
    },
    {
      id: 54,
      uuid: 'c2b68c2e-2f92-418d-862c-f904a89f65d6',
      content: {
        en: 'Who or what may have prevented you from achieving your full potential?',
        de: 'Wer oder was hat dich daran gehindert, dein volles Potenzial zu entfalten?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hvLW9yLXdoYXQtbWF5LWhhdmUtcHJldmVudGVkLXlvdS1mcm9tLWFjaGlldmluZy15b3VyLWZ1bGwtcG90ZW50aWFsLXdlci1vZGVyLXdhcy1oYXQtZGljaC1kYXJhbi1nZWhpbmRlcnQtZGVpbi12b2xsZXMtcG90ZW56aWFsLXp1LWVudGZhbHRlbg==',
    },
    {
      id: 55,
      uuid: '2a5765d5-0821-4505-b7ce-4ef7dbffb623',
      content: {
        en: 'Have you ever had a recurring dream, and if so, what was it?',
        de: 'Hattest du jemals einen wiederkehrenden Traum? Und wenn ja, welcher?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'aGF2ZS15b3UtZXZlci1oYWQtYS1yZWN1cnJpbmctZHJlYW0tYW5kLWlmLXNvLXdoYXQtd2FzLWl0LWhhdHRlc3QtZHUtamVtYWxzLWVpbmVuLXdpZWRlcmtlaHJlbmRlbi10cmF1bS11bmQtd2Vubi1qYS13ZWxjaGVy',
    },
    {
      id: 56,
      uuid: 'c0eee13f-b775-4589-b213-0a4273d0b189',
      content: {
        en: 'Would you prefer to be more in tune with your body or your mind?',
        de: 'Würdest du gerne mehr in deinem Körper oder mehr in deinem Kopf leben?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd291bGQteW91LXByZWZlci10by1iZS1tb3JlLWluLXR1bmUtd2l0aC15b3VyLWJvZHktb3IteW91ci1taW5kLXd1cmRlc3QtZHUtZ2VybmUtbWVoci1pbi1kZWluZW0ta29ycGVyLW9kZXItbWVoci1pbi1kZWluZW0ta29wZi1sZWJlbg==',
    },
    {
      id: 57,
      uuid: 'e28c1e12-5937-4120-ba6b-1676ef5282da',
      content: {
        en: 'When was the last time you laughed uncontrollably or threw your head back in laughter?',
        de: 'Wann hast du das letzte Mal Tränen oder richtig herzhaft gelacht und warum?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hlbi13YXMtdGhlLWxhc3QtdGltZS15b3UtbGF1Z2hlZC11bmNvbnRyb2xsYWJseS1vci10aHJldy15b3VyLWhlYWQtYmFjay1pbi1sYXVnaHRlci13YW5uLWhhc3QtZHUtZGFzLWxldHp0ZS1tYWwtdHJhbmVuLW9kZXItcmljaHRpZy1oZXJ6aGFmdC1nZWxhY2h0LXVuZC13YXJ1bQ==',
    },
    {
      id: 58,
      uuid: '9e861857-18ca-44da-a14a-c3412f0dd9ae',
      content: {
        en: 'Who has had a negative or harmful influence on you in the past?',
        de: 'Wer hatte in der Vergangenheit einen schlechten Einfluss auf dich?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hvLWhhcy1oYWQtYS1uZWdhdGl2ZS1vci1oYXJtZnVsLWluZmx1ZW5jZS1vbi15b3UtaW4tdGhlLXBhc3Qtd2VyLWhhdHRlLWluLWRlci12ZXJnYW5nZW5oZWl0LWVpbmVuLXNjaGxlY2h0ZW4tZWluZmx1c3MtYXVmLWRpY2g=',
    },
    {
      id: 59,
      uuid: 'cc9fe458-144a-47a3-9600-ad0b3ac862d3',
      content: {
        en: 'Describe a simple pleasure that brings you happiness.',
        de: 'Beschreibe ein einfaches Vergnügen, das dich glücklich macht.',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'ZGVzY3JpYmUtYS1zaW1wbGUtcGxlYXN1cmUtdGhhdC1icmluZ3MteW91LWhhcHBpbmVzcy1iZXNjaHJlaWJlLWVpbi1laW5mYWNoZXMtdmVyZ251Z2VuLWRhcy1kaWNoLWdsdWNrbGljaC1tYWNodA==',
    },
    {
      id: 60,
      uuid: 'd797ec36-ce65-4029-98f2-9c8ef310bf87',
      content: {
        en: 'Where do you feel most comfortable or at home?',
        de: 'Wo fühlst du dich am meisten zu Hause?',
      },
      is_archived: false,
      category_name: {
        en: 'Self',
        de: 'Selbst',
      },
      slug: 'd2hlcmUtZG8teW91LWZlZWwtbW9zdC1jb21mb3J0YWJsZS1vci1hdC1ob21lLXdvLWZ1aGxzdC1kdS1kaWNoLWFtLW1laXN0ZW4tenUtaGF1c2U=',
    },
    {
      id: 61,
      uuid: '504ad019-e3e5-423b-ab1e-fda44db01c21',
      content: {
        en: "Who was the best boss you've ever had, and what made them stand out?",
        de: 'Wer ist der beste Chef, den du je hattest? Und was zeichnete ihn aus?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'd2hvLXdhcy10aGUtYmVzdC1ib3NzLXlvdXZlLWV2ZXItaGFkLWFuZC13aGF0LW1hZGUtdGhlbS1zdGFuZC1vdXQtd2VyLWlzdC1kZXItYmVzdGUtY2hlZi1kZW4tZHUtamUtaGF0dGVzdC11bmQtd2FzLXplaWNobmV0ZS1paG4tYXVz',
    },
    {
      id: 62,
      uuid: 'fbe1b53d-f1cf-4ad7-b4a2-7e4348c52050',
      content: {
        en: 'Are you comfortable sharing your salary with your friends?',
        de: 'Wäre es okay für dich, deinen Freunden dein Gehalt zu nennen?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'YXJlLXlvdS1jb21mb3J0YWJsZS1zaGFyaW5nLXlvdXItc2FsYXJ5LXdpdGgteW91ci1mcmllbmRzLXdhcmUtZXMtb2theS1mdXItZGljaC1kZWluZW4tZnJldW5kZW4tZGVpbi1nZWhhbHQtenUtbmVubmVu',
    },
    {
      id: 63,
      uuid: 'd7b39544-2188-4cd2-aca9-acc4255b610b',
      content: {
        en: 'In what ways do you think you could be a challenging person to work with or for?',
        de: 'Inwiefern könntest du eine schwierige Person sein, mit oder für die man arbeitet?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'aW4td2hhdC13YXlzLWRvLXlvdS10aGluay15b3UtY291bGQtYmUtYS1jaGFsbGVuZ2luZy1wZXJzb24tdG8td29yay13aXRoLW9yLWZvci1pbndpZWZlcm4ta29ubnRlc3QtZHUtZWluZS1zY2h3aWVyaWdlLXBlcnNvbi1zZWluLW1pdC1vZGVyLWZ1ci1kaWUtbWFuLWFyYmVpdGV0',
    },
    {
      id: 64,
      uuid: '34464318-7457-4348-af1e-46fc11fa1326',
      content: {
        en: 'If you could use the resources of the Bill Gates Foundation to address only one issue, which one would you choose?',
        de: 'Wenn du die Stiftung von Bill Gates leiten würdest, aber die Mittel nur für ein einziges Problem ausgeben könntest, welches wäre das?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'aWYteW91LWNvdWxkLXVzZS10aGUtcmVzb3VyY2VzLW9mLXRoZS1iaWxsLWdhdGVzLWZvdW5kYXRpb24tdG8tYWRkcmVzcy1vbmx5LW9uZS1pc3N1ZS13aGljaC1vbmUtd291bGQteW91LWNob29zZS13ZW5uLWR1LWRpZS1zdGlmdHVuZy12b24tYmlsbC1nYXRlcy1sZWl0ZW4td3VyZGVzdC1hYmVyLWRpZS1taXR0ZWwtbnVyLWZ1ci1laW4tZWluemlnZXMtcHJvYmxlbS1hdXNnZWJlbi1rb25udGVzdC13ZWxjaGVzLXdhcmUtZGFz',
    },
    {
      id: 65,
      uuid: '158fce7d-5755-4128-a8ea-9ecf4ab4124b',
      content: {
        en: 'What task were you working on the last time you completely lost track of time?',
        de: 'Welcher Arbeit bist du nachgegangen, als du das letzte Mal die Zeit ganz vergessen hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'd2hhdC10YXNrLXdlcmUteW91LXdvcmtpbmctb24tdGhlLWxhc3QtdGltZS15b3UtY29tcGxldGVseS1sb3N0LXRyYWNrLW9mLXRpbWUtd2VsY2hlci1hcmJlaXQtYmlzdC1kdS1uYWNoZ2VnYW5nZW4tYWxzLWR1LWRhcy1sZXR6dGUtbWFsLWRpZS16ZWl0LWdhbnotdmVyZ2Vzc2VuLWhhc3Q=',
    },
    {
      id: 66,
      uuid: '5832ec3c-acfd-42eb-9df0-6da541dda02e',
      content: {
        en: 'If you had to choose between a happy home life and an average career, or a successful career and an average home life, which would you choose?',
        de: 'Wenn du die Wahl hättest zwischen einem glücklichen Leben zu Hause und einer mittelmäßigen Karriere oder einer erfolgreichen Karriere und einem mittelmäßigen Leben zu Hause, was würdest du wählen?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'aWYteW91LWhhZC10by1jaG9vc2UtYmV0d2Vlbi1hLWhhcHB5LWhvbWUtbGlmZS1hbmQtYW4tYXZlcmFnZS1jYXJlZXItb3ItYS1zdWNjZXNzZnVsLWNhcmVlci1hbmQtYW4tYXZlcmFnZS1ob21lLWxpZmUtd2hpY2gtd291bGQteW91LWNob29zZS13ZW5uLWR1LWRpZS13YWhsLWhhdHRlc3Qtendpc2NoZW4tZWluZW0tZ2x1Y2tsaWNoZW4tbGViZW4tenUtaGF1c2UtdW5kLWVpbmVyLW1pdHRlbG1haWdlbi1rYXJyaWVyZS1vZGVyLWVpbmVyLWVyZm9sZ3JlaWNoZW4ta2FycmllcmUtdW5kLWVpbmVtLW1pdHRlbG1haWdlbi1sZWJlbi16dS1oYXVzZS13YXMtd3VyZGVzdC1kdS13YWhsZW4=',
    },
    {
      id: 67,
      uuid: 'bdaeb91e-03e3-45f6-9589-df9dfe30249d',
      content: {
        en: 'What job did you dream of having when you were a child?',
        de: 'Von welchem späteren Beruf hast du als Kind geträumt?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'd2hhdC1qb2ItZGlkLXlvdS1kcmVhbS1vZi1oYXZpbmctd2hlbi15b3Utd2VyZS1hLWNoaWxkLXZvbi13ZWxjaGVtLXNwYXRlcmVuLWJlcnVmLWhhc3QtZHUtYWxzLWtpbmQtZ2V0cmF1bXQ=',
    },
    {
      id: 68,
      uuid: '3b51ae77-ed0d-46ff-8a05-a3b0ee198479',
      content: {
        en: "If you won the lottery, what would be the first thing you'd do with the money?",
        de: 'Was wäre das Erste, was du tun würdest, wenn du im Lotto gewinnen würdest?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'aWYteW91LXdvbi10aGUtbG90dGVyeS13aGF0LXdvdWxkLWJlLXRoZS1maXJzdC10aGluZy15b3VkLWRvLXdpdGgtdGhlLW1vbmV5LXdhcy13YXJlLWRhcy1lcnN0ZS13YXMtZHUtdHVuLXd1cmRlc3Qtd2Vubi1kdS1pbS1sb3R0by1nZXdpbm5lbi13dXJkZXN0',
    },
    {
      id: 69,
      uuid: '7434de02-38ee-40c7-84de-766db912158a',
      content: {
        en: 'Have you ever undermined your own success?',
        de: 'Hast du jemals deinen eigenen Erfolg sabotiert?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'aGF2ZS15b3UtZXZlci11bmRlcm1pbmVkLXlvdXItb3duLXN1Y2Nlc3MtaGFzdC1kdS1qZW1hbHMtZGVpbmVuLWVpZ2VuZW4tZXJmb2xnLXNhYm90aWVydA==',
    },
    {
      id: 70,
      uuid: '6d67ed11-b98c-4e4a-a9b4-f8077b1a3a7f',
      content: {
        en: 'Is it more effective to donate money to the government or to a charity?',
        de: 'Ist es effektiver, Geld an den Staat zu spenden oder an eine wohltätige Organisation?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'aXMtaXQtbW9yZS1lZmZlY3RpdmUtdG8tZG9uYXRlLW1vbmV5LXRvLXRoZS1nb3Zlcm5tZW50LW9yLXRvLWEtY2hhcml0eS1pc3QtZXMtZWZmZWt0aXZlci1nZWxkLWFuLWRlbi1zdGFhdC16dS1zcGVuZGVuLW9kZXItYW4tZWluZS13b2hsdGF0aWdlLW9yZ2FuaXNhdGlvbg==',
    },
    {
      id: 71,
      uuid: 'a0352168-cc6d-4c08-bcaa-5581c27f8888',
      content: {
        en: 'What government action would make you consider leaving the country?',
        de: 'Welche realistische Maßnahme der Regierung würde dich veranlassen, das Land zu verlassen?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'd2hhdC1nb3Zlcm5tZW50LWFjdGlvbi13b3VsZC1tYWtlLXlvdS1jb25zaWRlci1sZWF2aW5nLXRoZS1jb3VudHJ5LXdlbGNoZS1yZWFsaXN0aXNjaGUtbWFuYWhtZS1kZXItcmVnaWVydW5nLXd1cmRlLWRpY2gtdmVyYW5sYXNzZW4tZGFzLWxhbmQtenUtdmVybGFzc2Vu',
    },
    {
      id: 72,
      uuid: 'a845d140-91cf-492b-90e6-4cf4a0e39c9e',
      content: {
        en: 'Who has given you the most helpful advice about your career?',
        de: 'Wer hat dir die nützlichsten Karriereratschläge gegeben?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'd2hvLWhhcy1naXZlbi15b3UtdGhlLW1vc3QtaGVscGZ1bC1hZHZpY2UtYWJvdXQteW91ci1jYXJlZXItd2VyLWhhdC1kaXItZGllLW51dHpsaWNoc3Rlbi1rYXJyaWVyZXJhdHNjaGxhZ2UtZ2VnZWJlbg==',
    },
    {
      id: 73,
      uuid: 'aeabbab7-05a3-4e04-a100-2e0aa0dc4179',
      content: {
        en: 'Do you feel happier spending or saving money?',
        de: 'Fühlst du dich glücklicher, wenn du Geld ausgibst oder sparst?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'ZG8teW91LWZlZWwtaGFwcGllci1zcGVuZGluZy1vci1zYXZpbmctbW9uZXktZnVobHN0LWR1LWRpY2gtZ2x1Y2tsaWNoZXItd2Vubi1kdS1nZWxkLWF1c2dpYnN0LW9kZXItc3BhcnN0',
    },
    {
      id: 74,
      uuid: 'e8f07d1f-7513-4f5f-92cd-9b22afc31f70',
      content: {
        en: 'If given the choice, would you prefer to be a psychotherapist or a doctor?',
        de: 'Würdest du lieber Psychotherapeut oder Arzt werden?',
      },
      is_archived: false,
      category_name: {
        en: 'Work',
        de: 'Arbeit',
      },
      slug: 'aWYtZ2l2ZW4tdGhlLWNob2ljZS13b3VsZC15b3UtcHJlZmVyLXRvLWJlLWEtcHN5Y2hvdGhlcmFwaXN0LW9yLWEtZG9jdG9yLXd1cmRlc3QtZHUtbGllYmVyLXBzeWNob3RoZXJhcGV1dC1vZGVyLWFyenQtd2VyZGVu',
    },
    {
      id: 75,
      uuid: '81b44e01-557f-4333-9c4d-c0c2b6ff52f7',
      content: {
        en: 'Have you ever travelled on your own?',
        de: 'Bist du schon einmal allein verreist?',
      },
      is_archived: false,
      category_name: {
        en: 'Travel',
        de: 'Reisen',
      },
      slug: 'aGF2ZS15b3UtZXZlci10cmF2ZWxsZWQtb24teW91ci1vd24tYmlzdC1kdS1zY2hvbi1laW5tYWwtYWxsZWluLXZlcnJlaXN0',
    },
    {
      id: 76,
      uuid: '4e6a75f1-b1c3-438f-9af4-b26249214ccc',
      content: {
        en: 'What qualities make for a good travel companion?',
        de: 'Was macht eine Person zu einem guten Reisebegleiter?',
      },
      is_archived: false,
      category_name: {
        en: 'Travel',
        de: 'Reisen',
      },
      slug: 'd2hhdC1xdWFsaXRpZXMtbWFrZS1mb3ItYS1nb29kLXRyYXZlbC1jb21wYW5pb24td2FzLW1hY2h0LWVpbmUtcGVyc29uLXp1LWVpbmVtLWd1dGVuLXJlaXNlYmVnbGVpdGVy',
    },
    {
      id: 77,
      uuid: 'ea414e9b-f64e-4e2b-bfe8-9ef8e2b69c83',
      content: {
        en: 'Would you rather stay in a bad hotel with a good meal or a good hotel with a bad meal?',
        de: 'Würdest du lieber in einem schlechten Hotel mit einer guten Mahlzeit oder in einem guten Hotel mit einer schlechten Mahlzeit übernachten?',
      },
      is_archived: false,
      category_name: {
        en: 'Travel',
        de: 'Reisen',
      },
      slug: 'd291bGQteW91LXJhdGhlci1zdGF5LWluLWEtYmFkLWhvdGVsLXdpdGgtYS1nb29kLW1lYWwtb3ItYS1nb29kLWhvdGVsLXdpdGgtYS1iYWQtbWVhbC13dXJkZXN0LWR1LWxpZWJlci1pbi1laW5lbS1zY2hsZWNodGVuLWhvdGVsLW1pdC1laW5lci1ndXRlbi1tYWhsemVpdC1vZGVyLWluLWVpbmVtLWd1dGVuLWhvdGVsLW1pdC1laW5lci1zY2hsZWNodGVuLW1haGx6ZWl0LXViZXJuYWNodGVu',
    },
    {
      id: 78,
      uuid: 'eedaf553-f46f-498d-8fc0-9a490871be61',
      content: {
        en: 'Do you prefer a settled or nomadic lifestyle?',
        de: 'Fühlst du dich eher zu einem nomadischen oder einem sesshaften Leben hingezogen?',
      },
      is_archived: false,
      category_name: {
        en: 'Travel',
        de: 'Reisen',
      },
      slug: 'ZG8teW91LXByZWZlci1hLXNldHRsZWQtb3Itbm9tYWRpYy1saWZlc3R5bGUtZnVobHN0LWR1LWRpY2gtZWhlci16dS1laW5lbS1ub21hZGlzY2hlbi1vZGVyLWVpbmVtLXNlc3NoYWZ0ZW4tbGViZW4taGluZ2V6b2dlbg==',
    },
    {
      id: 79,
      uuid: 'c04efeda-e7fe-445b-996d-cfb8e9aa938a',
      content: {
        en: 'Are there travel mistakes you tend to make repeatedly?',
        de: 'Gibt es Fehler, die du von Reise zu Reise wiederholst?',
      },
      is_archived: false,
      category_name: {
        en: 'Travel',
        de: 'Reisen',
      },
      slug: 'YXJlLXRoZXJlLXRyYXZlbC1taXN0YWtlcy15b3UtdGVuZC10by1tYWtlLXJlcGVhdGVkbHktZ2lidC1lcy1mZWhsZXItZGllLWR1LXZvbi1yZWlzZS16dS1yZWlzZS13aWVkZXJob2xzdA==',
    },
    {
      id: 80,
      uuid: 'bfee0d04-acbe-4195-b873-753dfc9c7955',
      content: {
        en: 'Would you rather have a view of the sea or the desert, and why?',
        de: 'Würdest du den Blick auf die Wüste oder auf das Meer bevorzugen - und warum?',
      },
      is_archived: false,
      category_name: {
        en: 'Travel',
        de: 'Reisen',
      },
      slug: 'd291bGQteW91LXJhdGhlci1oYXZlLWEtdmlldy1vZi10aGUtc2VhLW9yLXRoZS1kZXNlcnQtYW5kLXdoeS13dXJkZXN0LWR1LWRlbi1ibGljay1hdWYtZGllLXd1c3RlLW9kZXItYXVmLWRhcy1tZWVyLWJldm9yenVnZW4tdW5kLXdhcnVt',
    },
    {
      id: 81,
      uuid: '3427c7e5-3cf8-4068-84ea-ebc7e6a7958d',
      content: {
        en: 'If you had to live somewhere other than where you currently live, where would you choose to live?',
        de: 'Wenn du woanders leben müsstest, welchen Ort würdest du wählen?',
      },
      is_archived: false,
      category_name: {
        en: 'Travel',
        de: 'Reisen',
      },
      slug: 'aWYteW91LWhhZC10by1saXZlLXNvbWV3aGVyZS1vdGhlci10aGFuLXdoZXJlLXlvdS1jdXJyZW50bHktbGl2ZS13aGVyZS13b3VsZC15b3UtY2hvb3NlLXRvLWxpdmUtd2Vubi1kdS13b2FuZGVycy1sZWJlbi1tdXNzdGVzdC13ZWxjaGVuLW9ydC13dXJkZXN0LWR1LXdhaGxlbg==',
    },
    {
      id: 82,
      uuid: '16d8650c-abea-40f8-8038-f416e617695c',
      content: {
        en: 'In what ways could society show greater appreciation for the elderly?',
        de: 'Wie könnten wir älteren Menschen mehr Wertschätzung entgegenbringen?',
      },
      is_archived: false,
      category_name: {
        en: 'Live & Death',
        de: 'Leben & Tod',
      },
      slug: 'aW4td2hhdC13YXlzLWNvdWxkLXNvY2lldHktc2hvdy1ncmVhdGVyLWFwcHJlY2lhdGlvbi1mb3ItdGhlLWVsZGVybHktd2llLWtvbm50ZW4td2lyLWFsdGVyZW4tbWVuc2NoZW4tbWVoci13ZXJ0c2NoYXR6dW5nLWVudGdlZ2VuYnJpbmdlbg==',
    },
    {
      id: 83,
      uuid: '0619e5b3-439e-4725-b6d7-e59651d63e01',
      content: {
        en: 'What does a meaningful or positive death mean to you?',
        de: 'Was wäre für dich ein guter Tod?',
      },
      is_archived: false,
      category_name: {
        en: 'Live & Death',
        de: 'Leben & Tod',
      },
      slug: 'd2hhdC1kb2VzLWEtbWVhbmluZ2Z1bC1vci1wb3NpdGl2ZS1kZWF0aC1tZWFuLXRvLXlvdS13YXMtd2FyZS1mdXItZGljaC1laW4tZ3V0ZXItdG9k',
    },
    {
      id: 84,
      uuid: '11855d13-01f1-4ab5-baf0-4d0805597fff',
      content: {
        en: 'If you had only one year left to live, how would you choose to spend that time?',
        de: 'Wenn du wüsstest, dass du nur noch ein Jahr zu leben hättest, wie würdest du die nächsten 12 Monate verbringen?',
      },
      is_archived: false,
      category_name: {
        en: 'Live & Death',
        de: 'Leben & Tod',
      },
      slug: 'aWYteW91LWhhZC1vbmx5LW9uZS15ZWFyLWxlZnQtdG8tbGl2ZS1ob3ctd291bGQteW91LWNob29zZS10by1zcGVuZC10aGF0LXRpbWUtd2Vubi1kdS13dXNzdGVzdC1kYXNzLWR1LW51ci1ub2NoLWVpbi1qYWhyLXp1LWxlYmVuLWhhdHRlc3Qtd2llLXd1cmRlc3QtZHUtZGllLW5hY2hzdGVuLTEyLW1vbmF0ZS12ZXJicmluZ2Vu',
    },
    {
      id: 85,
      uuid: '9a09ab73-c1d2-4402-858f-efaa3c046222',
      content: {
        en: 'What do you consider to be the most positive aspects of middle age?',
        de: 'Was sind deiner Meinung nach die besten Eigenschaften des mittleren Alters?',
      },
      is_archived: false,
      category_name: {
        en: 'Live & Death',
        de: 'Leben & Tod',
      },
      slug: 'd2hhdC1kby15b3UtY29uc2lkZXItdG8tYmUtdGhlLW1vc3QtcG9zaXRpdmUtYXNwZWN0cy1vZi1taWRkbGUtYWdlLXdhcy1zaW5kLWRlaW5lci1tZWludW5nLW5hY2gtZGllLWJlc3Rlbi1laWdlbnNjaGFmdGVuLWRlcy1taXR0bGVyZW4tYWx0ZXJz',
    },
    {
      id: 86,
      uuid: '787e3c10-a405-48c4-9ba5-dc7217da0bd0',
      content: {
        en: 'What was the best thing you bought for under 100€?',
        de: 'Was war der beste Kauf, den du für unter 100€ getätigt hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMtdGhlLWJlc3QtdGhpbmcteW91LWJvdWdodC1mb3ItdW5kZXItMTAwLXdhcy13YXItZGVyLWJlc3RlLWthdWYtZGVuLWR1LWZ1ci11bnRlci0xMDAtZ2V0YXRpZ3QtaGFzdA==',
    },
    {
      id: 87,
      uuid: 'c8ffe34d-b779-4ace-b29c-4a80fa0f8e23',
      content: {
        en: 'Which achievement are you most proud of?',
        de: 'Auf welche Leistung oder Errungenschaft bist du besonders stolz?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hpY2gtYWNoaWV2ZW1lbnQtYXJlLXlvdS1tb3N0LXByb3VkLW9mLWF1Zi13ZWxjaGUtbGVpc3R1bmctb2Rlci1lcnJ1bmdlbnNjaGFmdC1iaXN0LWR1LWJlc29uZGVycy1zdG9seg==',
    },
    {
      id: 88,
      uuid: '6bd81fdd-5d9e-403c-8946-978ac7d296bc',
      content: {
        en: 'What is your most valuable lesson?',
        de: 'Was ist die wertvollste Lektion, die du gelernt hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC1pcy15b3VyLW1vc3QtdmFsdWFibGUtbGVzc29uLXdhcy1pc3QtZGllLXdlcnR2b2xsc3RlLWxla3Rpb24tZGllLWR1LWdlbGVybnQtaGFzdA==',
    },
    {
      id: 89,
      uuid: '0bc8235c-bc74-4b7e-b76c-520f1f16b22e',
      content: {
        en: 'What moment would you most like to relive?',
        de: 'Welchen Moment würdest du gerne noch einmal erleben?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC1tb21lbnQtd291bGQteW91LW1vc3QtbGlrZS10by1yZWxpdmUtd2VsY2hlbi1tb21lbnQtd3VyZGVzdC1kdS1nZXJuZS1ub2NoLWVpbm1hbC1lcmxlYmVu',
    },
    {
      id: 90,
      uuid: 'd25e0ff1-dd74-43c6-9705-6067946fcbee',
      content: {
        en: 'When did you laugh the loudest?',
        de: 'Wann hast du am lautesten gelacht?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hlbi1kaWQteW91LWxhdWdoLXRoZS1sb3VkZXN0LXdhbm4taGFzdC1kdS1hbS1sYXV0ZXN0ZW4tZ2VsYWNodA==',
    },
    {
      id: 91,
      uuid: '95c51084-ed84-46fe-a6e2-4a04457c4565',
      content: {
        en: 'Who or what has inspired you the most?',
        de: 'Wer oder was hat dich besonders inspiriert?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hvLW9yLXdoYXQtaGFzLWluc3BpcmVkLXlvdS10aGUtbW9zdC13ZXItb2Rlci13YXMtaGF0LWRpY2gtYmVzb25kZXJzLWluc3BpcmllcnQ=',
    },
    {
      id: 92,
      uuid: 'c8d21b92-8843-425a-8b09-79c18e6a682f',
      content: {
        en: 'What was the most beautiful place you visited?',
        de: 'Was war der schönste Ort, den du besucht hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMtdGhlLW1vc3QtYmVhdXRpZnVsLXBsYWNlLXlvdS12aXNpdGVkLXdhcy13YXItZGVyLXNjaG9uc3RlLW9ydC1kZW4tZHUtYmVzdWNodC1oYXN0',
    },
    {
      id: 93,
      uuid: 'cdb32a50-c093-4629-8133-9e6bf231f8a7',
      content: {
        en: 'What was your most exciting experience?',
        de: 'Was war die aufregendste Erfahrung, die du gemacht hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMteW91ci1tb3N0LWV4Y2l0aW5nLWV4cGVyaWVuY2Utd2FzLXdhci1kaWUtYXVmcmVnZW5kc3RlLWVyZmFocnVuZy1kaWUtZHUtZ2VtYWNodC1oYXN0',
    },
    {
      id: 94,
      uuid: '55289892-b355-4ae6-83d8-a3967a98a37a',
      content: {
        en: 'What three things gave you the most energy?',
        de: 'Welche drei Dinge haben dir besonders viel Energie gegeben?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC10aHJlZS10aGluZ3MtZ2F2ZS15b3UtdGhlLW1vc3QtZW5lcmd5LXdlbGNoZS1kcmVpLWRpbmdlLWhhYmVuLWRpci1iZXNvbmRlcnMtdmllbC1lbmVyZ2llLWdlZ2ViZW4=',
    },
    {
      id: 95,
      uuid: '1320a1a5-46c4-4a84-ba41-782f260e9568',
      content: {
        en: 'What kept you awake at night?',
        de: 'Was hat dich nachts wachgehalten?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC1rZXB0LXlvdS1hd2FrZS1hdC1uaWdodC13YXMtaGF0LWRpY2gtbmFjaHRzLXdhY2hnZWhhbHRlbg==',
    },
    {
      id: 96,
      uuid: 'ff0522b9-4aa6-489c-be0a-3251d90fac1a',
      content: {
        en: 'What was the nicest compliment you received?',
        de: 'Was war das schönste Kompliment, das du erhalten hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMtdGhlLW5pY2VzdC1jb21wbGltZW50LXlvdS1yZWNlaXZlZC13YXMtd2FyLWRhcy1zY2hvbnN0ZS1rb21wbGltZW50LWRhcy1kdS1lcmhhbHRlbi1oYXN0',
    },
    {
      id: 97,
      uuid: '90cd51dc-84a8-4306-b4a8-5f2189fdd997',
      content: {
        en: 'What was your best decision?',
        de: 'Was war die beste Entscheidung, die du getroffen hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMteW91ci1iZXN0LWRlY2lzaW9uLXdhcy13YXItZGllLWJlc3RlLWVudHNjaGVpZHVuZy1kaWUtZHUtZ2V0cm9mZmVuLWhhc3Q=',
    },
    {
      id: 98,
      uuid: '0d1d3134-26ec-471d-8763-7273699f7b7a',
      content: {
        en: 'What surprised you the most?',
        de: 'Was hat dich besonders überrascht?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC1zdXJwcmlzZWQteW91LXRoZS1tb3N0LXdhcy1oYXQtZGljaC1iZXNvbmRlcnMtdWJlcnJhc2NodA==',
    },
    {
      id: 99,
      uuid: 'decc467a-73e8-4445-bc35-29a96df7be42',
      content: {
        en: 'What was your biggest mistake?',
        de: 'Was war dein größter Fehler?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMteW91ci1iaWdnZXN0LW1pc3Rha2Utd2FzLXdhci1kZWluLWdyb3Rlci1mZWhsZXI=',
    },
    {
      id: 100,
      uuid: '84675dbb-d38b-4f9b-a75b-414fcc7149a1',
      content: {
        en: 'Which three people have influenced you the most?',
        de: 'Welche drei Personen haben dich besonders beeinflusst?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hpY2gtdGhyZWUtcGVvcGxlLWhhdmUtaW5mbHVlbmNlZC15b3UtdGhlLW1vc3Qtd2VsY2hlLWRyZWktcGVyc29uZW4taGFiZW4tZGljaC1iZXNvbmRlcnMtYmVlaW5mbHVzc3Q=',
    },
    {
      id: 101,
      uuid: '91e00ea5-9b1f-420b-bddb-fd26369874cc',
      content: {
        en: 'What was your best day?',
        de: 'Was war dein schönster Tag?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMteW91ci1iZXN0LWRheS13YXMtd2FyLWRlaW4tc2Nob25zdGVyLXRhZw==',
    },
    {
      id: 102,
      uuid: '7359c575-e24a-4430-8078-a532ec85af09',
      content: {
        en: 'Who would you like to thank?',
        de: 'Wem möchtest du danken?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hvLXdvdWxkLXlvdS1saWtlLXRvLXRoYW5rLXdlbS1tb2NodGVzdC1kdS1kYW5rZW4=',
    },
    {
      id: 103,
      uuid: '88fa4349-4d5c-4ca8-b5bb-43b6f48aacb8',
      content: {
        en: 'What was the best book, movie, or TV series you read or watched?',
        de: 'Was war das beste Buch, der beste Film oder die beste TV-Serie, die du gelesen oder gesehen hast?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13YXMtdGhlLWJlc3QtYm9vay1tb3ZpZS1vci10di1zZXJpZXMteW91LXJlYWQtb3Itd2F0Y2hlZC13YXMtd2FyLWRhcy1iZXN0ZS1idWNoLWRlci1iZXN0ZS1maWxtLW9kZXItZGllLWJlc3RlLXR2LXNlcmllLWRpZS1kdS1nZWxlc2VuLW9kZXItZ2VzZWhlbi1oYXN0',
    },
    {
      id: 104,
      uuid: '27fcd702-3927-441f-a224-9912e9064e11',
      content: {
        en: 'What would you do differently with the knowledge you have today?',
        de: 'Was würdest du aufgrund deines heutigen Wissensstands anders machen?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC13b3VsZC15b3UtZG8tZGlmZmVyZW50bHktd2l0aC10aGUta25vd2xlZGdlLXlvdS1oYXZlLXRvZGF5LXdhcy13dXJkZXN0LWR1LWF1ZmdydW5kLWRlaW5lcy1oZXV0aWdlbi13aXNzZW5zc3RhbmRzLWFuZGVycy1tYWNoZW4=',
    },
    {
      id: 105,
      uuid: '19fcb380-fdd2-408b-93b8-81b67bb12ae1',
      content: {
        en: 'What are you most grateful for?',
        de: 'Wofür bist du am meisten dankbar?',
      },
      is_archived: false,
      category_name: {
        en: 'Past 12 months',
        de: 'Rückblick 12 Monate',
      },
      slug: 'd2hhdC1hcmUteW91LW1vc3QtZ3JhdGVmdWwtZm9yLXdvZnVyLWJpc3QtZHUtYW0tbWVpc3Rlbi1kYW5rYmFy',
    },
    {
      id: 106,
      uuid: 'eb2000cc-c5a4-4a67-9f7f-0e1a9d2b4d78',
      content: {
        en: 'What will be in your photos?',
        de: 'Was wirst du auf deinen Fotos zeigen können?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13aWxsLWJlLWluLXlvdXItcGhvdG9zLXdhcy13aXJzdC1kdS1hdWYtZGVpbmVuLWZvdG9zLXplaWdlbi1rb25uZW4=',
    },
    {
      id: 107,
      uuid: '76106c8e-9495-425f-aa1c-e7b421845853',
      content: {
        en: 'What bad habit would you like to get rid of?',
        de: 'Welche unerwünschte Gewohnheit möchtest du ablegen?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1iYWQtaGFiaXQtd291bGQteW91LWxpa2UtdG8tZ2V0LXJpZC1vZi13ZWxjaGUtdW5lcnd1bnNjaHRlLWdld29obmhlaXQtbW9jaHRlc3QtZHUtYWJsZWdlbg==',
    },
    {
      id: 108,
      uuid: 'a9fc33ca-ffb8-4bbd-85a7-3feff5be7a04',
      content: {
        en: 'What will you do that no one would expect you to do?',
        de: 'Was wirst du tun, womit niemand rechnen würde?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13aWxsLXlvdS1kby10aGF0LW5vLW9uZS13b3VsZC1leHBlY3QteW91LXRvLWRvLXdhcy13aXJzdC1kdS10dW4td29taXQtbmllbWFuZC1yZWNobmVuLXd1cmRl',
    },
    {
      id: 109,
      uuid: '423b3a3d-f3da-47cd-8799-5e96c5b7b6e5',
      content: {
        en: 'What would you like to spend less time on?',
        de: 'Für was möchtest du weniger Zeit aufwenden?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13b3VsZC15b3UtbGlrZS10by1zcGVuZC1sZXNzLXRpbWUtb24tZnVyLXdhcy1tb2NodGVzdC1kdS13ZW5pZ2VyLXplaXQtYXVmd2VuZGVu',
    },
    {
      id: 110,
      uuid: '597054bd-f00b-474e-8a32-cd6a490fdf0a',
      content: {
        en: 'What are you looking forward to the most?',
        de: 'Auf was freust du dich am meisten?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1hcmUteW91LWxvb2tpbmctZm9yd2FyZC10by10aGUtbW9zdC1hdWYtd2FzLWZyZXVzdC1kdS1kaWNoLWFtLW1laXN0ZW4=',
    },
    {
      id: 111,
      uuid: 'e2d3ab3b-dbec-4437-b79d-363d876fdcbb',
      content: {
        en: 'What habit would you like to keep?',
        de: 'Welche Gewohnheit möchtest du beibehalten?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1oYWJpdC13b3VsZC15b3UtbGlrZS10by1rZWVwLXdlbGNoZS1nZXdvaG5oZWl0LW1vY2h0ZXN0LWR1LWJlaWJlaGFsdGVu',
    },
    {
      id: 112,
      uuid: '3fc3cd86-824c-4ee3-a94b-a3ccb28b81bd',
      content: {
        en: 'What will you do for the first time in your life?',
        de: 'Was wirst du zum ersten Mal in deinem Leben tun?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13aWxsLXlvdS1kby1mb3ItdGhlLWZpcnN0LXRpbWUtaW4teW91ci1saWZlLXdhcy13aXJzdC1kdS16dW0tZXJzdGVuLW1hbC1pbi1kZWluZW0tbGViZW4tdHVu',
    },
    {
      id: 113,
      uuid: 'faf1a96b-032b-481a-938f-7f09b49265e7',
      content: {
        en: 'What will you do to make the next twelve months as wonderful or better than the last twelve months?',
        de: 'Was wirst du tun (oder nicht tun), um die nächsten zwölf Monate genauso wundervoll oder noch besser als die letzten zwölf Monate zu machen?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13aWxsLXlvdS1kby10by1tYWtlLXRoZS1uZXh0LXR3ZWx2ZS1tb250aHMtYXMtd29uZGVyZnVsLW9yLWJldHRlci10aGFuLXRoZS1sYXN0LXR3ZWx2ZS1tb250aHMtd2FzLXdpcnN0LWR1LXR1bi1vZGVyLW5pY2h0LXR1bi11bS1kaWUtbmFjaHN0ZW4tendvbGYtbW9uYXRlLWdlbmF1c28td3VuZGVydm9sbC1vZGVyLW5vY2gtYmVzc2VyLWFscy1kaWUtbGV0enRlbi16d29sZi1tb25hdGUtenUtbWFjaGVu',
    },
    {
      id: 114,
      uuid: '8d76a3f8-42de-4f8d-a2d1-1de544131477',
      content: {
        en: 'What will you do (or leave undone) to achieve YOUR GOALS AND DREAMS?',
        de: 'Was wirst du tun, um DEINE ZIELE UND TRÄUME zu erreichen?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13aWxsLXlvdS1kby1vci1sZWF2ZS11bmRvbmUtdG8tYWNoaWV2ZS15b3VyLWdvYWxzLWFuZC1kcmVhbXMtd2FzLXdpcnN0LWR1LXR1bi11bS1kZWluZS16aWVsZS11bmQtdHJhdW1lLXp1LWVycmVpY2hlbg==',
    },
    {
      id: 115,
      uuid: '17a30612-dcfd-479c-bb28-23f1529d12d4',
      content: {
        en: 'What do you want to spend more time on?',
        de: 'Für was möchtest du mehr Zeit aufwenden?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1kby15b3Utd2FudC10by1zcGVuZC1tb3JlLXRpbWUtb24tZnVyLXdhcy1tb2NodGVzdC1kdS1tZWhyLXplaXQtYXVmd2VuZGVu',
    },
    {
      id: 116,
      uuid: 'be5b265c-d5fe-4965-8eb3-1f4f6cd34bee',
      content: {
        en: 'What are you least looking forward to?',
        de: 'Worauf freust du dich am wenigsten?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1hcmUteW91LWxlYXN0LWxvb2tpbmctZm9yd2FyZC10by13b3JhdWYtZnJldXN0LWR1LWRpY2gtYW0td2VuaWdzdGVu',
    },
    {
      id: 117,
      uuid: 'e5709607-1ae0-4006-ba8c-c412ae6446f3',
      content: {
        en: 'What do you want to achieve?',
        de: 'Was möchtest du erreichen?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1kby15b3Utd2FudC10by1hY2hpZXZlLXdhcy1tb2NodGVzdC1kdS1lcnJlaWNoZW4=',
    },
    {
      id: 118,
      uuid: '86c73cf7-6fbe-45ad-b4c4-24a323ae90c5',
      content: {
        en: 'What would you like to improve?',
        de: 'In welchen Bereichen möchtest du dich verbessern?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13b3VsZC15b3UtbGlrZS10by1pbXByb3ZlLWluLXdlbGNoZW4tYmVyZWljaGVuLW1vY2h0ZXN0LWR1LWRpY2gtdmVyYmVzc2Vybg==',
    },
    {
      id: 119,
      uuid: '62a7f10a-bc28-4489-b243-ba01173a3974',
      content: {
        en: 'Who or what could serve as a new source of inspiration for you?',
        de: 'Wer oder was könnte dich als neue Inspirationsquelle dienen?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hvLW9yLXdoYXQtY291bGQtc2VydmUtYXMtYS1uZXctc291cmNlLW9mLWluc3BpcmF0aW9uLWZvci15b3Utd2VyLW9kZXItd2FzLWtvbm50ZS1kaWNoLWFscy1uZXVlLWluc3BpcmF0aW9uc3F1ZWxsZS1kaWVuZW4=',
    },
    {
      id: 120,
      uuid: '6b99cf3b-4c49-4cfe-8a1c-686c84bdaa50',
      content: {
        en: 'What is your greatest wish?',
        de: 'Was ist dein größter Wunsch?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1pcy15b3VyLWdyZWF0ZXN0LXdpc2gtd2FzLWlzdC1kZWluLWdyb3Rlci13dW5zY2g=',
    },
    {
      id: 121,
      uuid: 'b2f90db3-154b-40ab-a1f0-0b043a4cc968',
      content: {
        en: 'What would make your year special?',
        de: 'Was würde dein Jahr besonders machen?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13b3VsZC1tYWtlLXlvdXIteWVhci1zcGVjaWFsLXdhcy13dXJkZS1kZWluLWphaHItYmVzb25kZXJzLW1hY2hlbg==',
    },
    {
      id: 122,
      uuid: '905d3df3-0fcd-4357-aefb-1c24a68fcf77',
      content: {
        en: 'What is the time ripe for?',
        de: 'Wofür ist die Zeit jetzt reif?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1pcy10aGUtdGltZS1yaXBlLWZvci13b2Z1ci1pc3QtZGllLXplaXQtamV0enQtcmVpZg==',
    },
    {
      id: 123,
      uuid: '7f80904a-feab-4419-96ec-26b4a8e0eb77',
      content: {
        en: 'What would you like to be able to congratulate yourself for in exactly one year?',
        de: 'Wofür möchtest du dir selbst in genau einem Jahr gratulieren können?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC13b3VsZC15b3UtbGlrZS10by1iZS1hYmxlLXRvLWNvbmdyYXR1bGF0ZS15b3Vyc2VsZi1mb3ItaW4tZXhhY3RseS1vbmUteWVhci13b2Z1ci1tb2NodGVzdC1kdS1kaXItc2VsYnN0LWluLWdlbmF1LWVpbmVtLWphaHItZ3JhdHVsaWVyZW4ta29ubmVu',
    },
    {
      id: 124,
      uuid: 'b3dedba4-dded-4776-bd9b-db6a8ac40dd2',
      content: {
        en: 'What do you do for your health?',
        de: 'Was unternimmst du für deine Gesundheit?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'd2hhdC1kby15b3UtZG8tZm9yLXlvdXItaGVhbHRoLXdhcy11bnRlcm5pbW1zdC1kdS1mdXItZGVpbmUtZ2VzdW5kaGVpdA==',
    },
    {
      id: 125,
      uuid: 'd12bafa5-79c5-4e61-b817-e8add4698c92',
      content: {
        en: 'To whom would you like to devote more time?',
        de: 'Wem möchtest du gerne mehr Zeit widmen?',
      },
      is_archived: false,
      category_name: {
        en: 'Future 12 months',
        de: 'Vorausblick 12 Monate',
      },
      slug: 'dG8td2hvbS13b3VsZC15b3UtbGlrZS10by1kZXZvdGUtbW9yZS10aW1lLXdlbS1tb2NodGVzdC1kdS1nZXJuZS1tZWhyLXplaXQtd2lkbWVu',
    },
  ],
  category: [
    {
      en: 'Personal',
      de: 'Persönlich',
    },
    {
      en: 'Culture',
      de: 'Kultur',
    },
    {
      en: 'Family',
      de: 'Familie',
    },
    {
      en: 'Self',
      de: 'Selbst',
    },
    {
      en: 'Work',
      de: 'Arbeit',
    },
    {
      en: 'Travel',
      de: 'Reisen',
    },
    {
      en: 'Live & Death',
      de: 'Leben & Tod',
    },
    {
      en: 'Past 12 months',
      de: 'Rückblick 12 Monate',
    },
    {
      en: 'Future 12 months',
      de: 'Vorausblick 12 Monate',
    },
  ],
};

class QuestionsDuringCall {
  async getQuestions() {
    return DATA;
    let response = await fetch(`${BACKEND_URL}/api/question/`, {
      method: 'GET',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-UseTagsOnly': true,
      },
    });
    let data = await response.text();
    data = JSON.parse(data);
    if (data.code === 200) {
      return data.data;
    } else return;
  }

  async getUnArchivedQuestions() {
    let response = await fetch(
      `${BACKEND_URL}/api/questions-list/userarchived/`,
      {
        method: 'GET',
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-UseTagsOnly': true,
        },
      },
    );
    let data = await response.text();
    data = JSON.parse(data);
    if (data.code === 200) {
      return data.data;
    } else return;
  }

  async archiveQuestion(id) {
    let response = await fetch(`${BACKEND_URL}/api/questions/archive/`, {
      method: 'POST',
      body: JSON.stringify({
        card_id: id,
      }),
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-UseTagsOnly': true,
      },
    });
    if (response.status == 204) {
      let data = await response.text();
      return data;
    } else {
      return 'error';
    }
  }

  async unArchiveQuestion(id) {
    let response = await fetch(`${BACKEND_URL}/api/questions/unarchived/`, {
      method: 'POST',
      body: JSON.stringify({
        card_id: id,
      }),
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-UseTagsOnly': true,
      },
    });
    if (response.status == 200) {
      let data = await response.text();
      return data;
    } else {
      return 'error';
    }
  }
}

export const questionsDuringCall = new QuestionsDuringCall();
