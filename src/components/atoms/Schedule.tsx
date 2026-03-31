import {
  CalendarIcon,
  ClockIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { formatDate, formatEventTime } from '../../helpers/date';

export type ScheduleSession = {
  start_time: string;
  end_time: string;
};

export type ScheduleProps = {
  title: string;
  sessions: ScheduleSession[];
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.small};
  padding: ${({ theme }) => theme.spacing.small};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  max-width: 28rem;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small};
    }
  `}
`;

const Title = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme }) => theme.color.text.heading};
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const SessionRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xsmall};
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.small};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.color.surface.tertiary};
  }
`;

const SessionDate = styled(Text)`
  color: ${({ theme }) => theme.color.text.primary};
`;

const SessionTimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const SessionTime = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

const IconWrap = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.secondary};
`;

export function Schedule({ title, sessions }: ScheduleProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <Wrapper>
      <Title bold type={TextTypes.Body4}>
        {title}
      </Title>
      <SessionList>
        {sessions.length === 0 ? (
          <Text>{t('random_calls.schedule_empty')}</Text>
        ) : (
          sessions.map((session, index) => {
            const start = new Date(session.start_time);
            const end = new Date(session.end_time);
            const dateLabel = formatDate(start, 'EEE d MMM', locale);
            const timeLabel = formatEventTime(start, end);
            return (
              <SessionRow key={session.start_time ?? index}>
                <IconWrap>
                  <CalendarIcon
                    label="date icon"
                    width={16}
                    height={16}
                    aria-hidden
                  />
                </IconWrap>
                <SessionDate tag="span">{dateLabel}</SessionDate>
                <SessionTimeWrapper>
                  <IconWrap>
                    <ClockIcon
                      label="time icon"
                      width={16}
                      height={16}
                      aria-hidden
                    />
                  </IconWrap>
                  <SessionTime tag="span">{timeLabel}</SessionTime>
                </SessionTimeWrapper>
              </SessionRow>
            );
          })
        )}
      </SessionList>
    </Wrapper>
  );
}
