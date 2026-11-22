import { useEffect, useState } from 'react';

import styled from 'styled-components';

import useAnnouncerStore from '../../features/stores/announcer';

const VisuallyHidden = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Mount once, near the app root. The region must already exist in the DOM
// before its text changes, otherwise screen readers ignore the update.
function LiveAnnouncer() {
  const { message, id } = useAnnouncerStore();
  const [text, setText] = useState('');

  useEffect(() => {
    if (!message) return undefined;
    // Clear first so an identical message is announced again.
    setText('');
    const timeout = window.setTimeout(() => setText(message), 100);
    return () => window.clearTimeout(timeout);
  }, [message, id]);

  return (
    <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
      {text}
    </VisuallyHidden>
  );
}

export default LiveAnnouncer;
