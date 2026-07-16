import React from 'react';

import CallHistoryRow from './CallHistoryRow';

export default {
  title: 'Atoms/CallHistoryRow',
  component: CallHistoryRow,
};

export const Outgoing = () => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '22rem' }}>
    <CallHistoryRow
      direction="outgoing"
      startedAt={new Date('2026-07-12T18:30:00')}
      durationMinutes={32}
      bothParticipated
    />
  </ul>
);

export const Incoming = () => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '22rem' }}>
    <CallHistoryRow
      direction="incoming"
      startedAt={new Date('2026-07-05T17:00:00')}
      durationMinutes={18}
      bothParticipated
    />
  </ul>
);
