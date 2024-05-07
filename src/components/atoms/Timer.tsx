import { Text } from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  height: 44px;
  background: ${({ theme }) => theme.color.surface.contrast};
  color: ${({ theme }) => theme.color.text.reversed};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const formatTime = (n: number) => (n < 10 ? `0${n}` : n);

function Timer({ className }: { className?: string }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(currentSeconds => currentSeconds + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  });

  const remainder = seconds % 60;
  const minutes = (seconds - remainder) / 60;

  return (
    <TimerContainer className={className}>
      <Text tag="span">
        {formatTime(minutes)}:{formatTime(remainder)}
      </Text>
    </TimerContainer>
  );
}

export default Timer;
