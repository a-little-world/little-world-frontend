import React from 'react';

import ProgressRing from './ProgressRing';

export default {
  title: 'Atoms/ProgressRing',
  component: ProgressRing,
};

export const Hero = () => (
  <ProgressRing
    value={8}
    max={10}
    label="8 of 10 weeks"
    caption="Wochen"
    size="hero"
    tone="accent"
  />
);

export const FreePlay = () => (
  <ProgressRing
    value={10}
    max={10}
    label="Cycle complete"
    caption="Wochen"
    size="hero"
    tone="success"
  />
);

export const Badge = () => (
  <ProgressRing size="badge" value={7} max={10} label="7 of 10 calls" />
);
