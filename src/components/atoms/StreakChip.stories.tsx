import React from 'react';

import StreakChip from './StreakChip';

export default {
  title: 'Atoms/StreakChip',
  component: StreakChip,
};

export const Active = () => <StreakChip weeks={3} state="active" />;

export const Paused = () => <StreakChip weeks={0} state="paused" />;

export const ForcedPaused = () => <StreakChip weeks={0} state="active" />;
