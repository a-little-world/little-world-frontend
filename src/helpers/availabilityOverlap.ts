const DAYS = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'] as const;
const SLOTS = [
  '08_10',
  '10_12',
  '12_14',
  '14_16',
  '16_18',
  '18_20',
  '20_22',
] as const;

const DAY_LABELS_DE: Record<(typeof DAYS)[number], string> = {
  mo: 'Montag',
  tu: 'Dienstag',
  we: 'Mittwoch',
  th: 'Donnerstag',
  fr: 'Freitag',
  sa: 'Samstag',
  su: 'Sonntag',
};

type Availability = Partial<Record<(typeof DAYS)[number], string[]>>;

type OverlapCandidate = {
  day: (typeof DAYS)[number];
  dayOffset: number;
  slotCount: number;
  slots: string[];
  overlapDate: Date;
};

const getWeekdayIndex = (date: Date) => {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
};

const groupConsecutiveSlots = (slots: string[]) => {
  const ordered = SLOTS.filter(slot => slots.includes(slot));
  if (!ordered.length) {
    return [];
  }

  const groups: string[][] = [[ordered[0]]];
  ordered.slice(1).forEach(slot => {
    const lastGroup = groups[groups.length - 1];
    const lastSlotIndex = SLOTS.indexOf(lastGroup[lastGroup.length - 1] as (typeof SLOTS)[number]);
    const slotIndex = SLOTS.indexOf(slot as (typeof SLOTS)[number]);
    if (slotIndex === lastSlotIndex + 1) {
      lastGroup.push(slot);
      return;
    }
    groups.push([slot]);
  });
  return groups;
};

const formatSlotRange = (slots: string[]) => {
  const [startHour] = slots[0].split('_');
  const [, endHour] = slots[slots.length - 1].split('_');
  return `${startHour}-${endHour} Uhr`;
};

const formatOverlapDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}.`;
};

const getOverlapCandidates = (
  availability1?: Availability,
  availability2?: Availability,
  lookaheadDays = 7,
): OverlapCandidate[] => {
  if (!availability1 || !availability2) {
    return [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bestPerDate = new Map<string, OverlapCandidate>();

  Array.from({ length: lookaheadDays }, (_, index) => index + 1).forEach(offset => {
    const overlapDate = new Date(today);
    overlapDate.setDate(today.getDate() + offset);
    const day = DAYS[getWeekdayIndex(overlapDate)];
    const overlappingSlots = SLOTS.filter(
      slot =>
        availability1[day]?.includes(slot) && availability2[day]?.includes(slot),
    );
    if (!overlappingSlots.length) {
      return;
    }

    groupConsecutiveSlots(overlappingSlots).forEach(slotGroup => {
      const candidate: OverlapCandidate = {
        day,
        dayOffset: offset,
        slotCount: slotGroup.length,
        slots: slotGroup,
        overlapDate,
      };
      const dateKey = overlapDate.toISOString().slice(0, 10);
      const existing = bestPerDate.get(dateKey);
      if (!existing || candidate.slotCount > existing.slotCount) {
        bestPerDate.set(dateKey, candidate);
      }
    });
  });

  return Array.from(bestPerDate.values());
};

const selectOverlapCandidates = (
  candidates: OverlapCandidate[],
  maxSuggestions = 2,
) =>
  [...candidates]
    .sort((left, right) => {
      if (right.slotCount !== left.slotCount) {
        return right.slotCount - left.slotCount;
      }
      return left.dayOffset - right.dayOffset;
    })
    .slice(0, maxSuggestions)
    .sort((left, right) => left.dayOffset - right.dayOffset);

export const formatSuggestedAvailabilityOverlap = (
  availability1?: Availability,
  availability2?: Availability,
  maxSuggestions = 2,
) =>
  selectOverlapCandidates(
    getOverlapCandidates(availability1, availability2),
    maxSuggestions,
  )
    .map(
      candidate =>
        `• ${DAY_LABELS_DE[candidate.day]} (${formatOverlapDate(candidate.overlapDate)}), ${formatSlotRange(candidate.slots)}`,
    )
    .join('\n');
