import { Button, Text } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

const MAX_SESSION_ROW_WIDTH_WITH_FREQUENCY = '424px';
const MAX_SESSION_ROW_WIDTH_WITHOUT_FREQUENCY = '400px';

export const Events = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  flex: 1 1 0;
  max-width: min(1200px, 100%);
  padding: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      padding: 0;
    }
  `}
`;

export const EventContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;

  ${({ theme }) => `
    border-radius: ${theme.spacing.large};
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.small};

    @media (min-width: ${theme.breakpoints.large}) {
       flex-direction: row;
    }
  `}
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  ${({ theme }) => `
    gap: ${theme.spacing.small};
  `}
`;

export const EventInfo = styled.div``;

export const EventTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

export const DateTimeEvent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const TimeWithFrequency = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const SessionFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xsmall};
  justify-self: flex-end;
`;

export const Buttons = styled.div`
  display: flex;
  margin-top: auto;
  align-items: center;

  ${({ theme }) => `
    gap: ${theme.spacing.xsmall};

    > button {
      gap: ${theme.spacing.xxsmall};
    }
  `}
`;

export const ShowMoreButton = styled(Button)`
  height: 44px;
`;

type SessionColumns = {
  $wideDate?: boolean;
  $withFrequency?: boolean;
  $stacked?: boolean;
};

const sessionColumns = ({
  $wideDate,
  $withFrequency,
  $stacked,
}: SessionColumns) => {
  // Small screens with tags: date and time share the first column.
  if ($stacked) return 'minmax(0, 1fr) auto auto';
  const date = $wideDate ? 'minmax(6.25rem, max-content)' : '104px';
  return $withFrequency ? `${date} max-content auto auto` : `${date} auto auto`;
};

// The list owns the columns and every row uses them through subgrid, so times, tags and
// buttons line up across rows instead of each row sizing its own.
export const Sessions = styled.div<SessionColumns>`
  display: grid;
  grid-template-columns: ${sessionColumns};
  column-gap: ${({ theme }) => theme.spacing.xxsmall};
  row-gap: ${({ theme }) => theme.spacing.xsmall};
  align-items: center;

  ${({ theme, $withFrequency }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      max-width: ${$withFrequency
        ? MAX_SESSION_ROW_WIDTH_WITH_FREQUENCY
        : MAX_SESSION_ROW_WIDTH_WITHOUT_FREQUENCY};
    }
  `}

  > ${ShowMoreButton} {
    grid-column: 1 / -1;
  }
`;

export const Session = styled.div`
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: flex-end;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      align-items: center;
    }
  `}
`;

/** Date and time: two grid columns normally, one stacked column on small screens. */
export const SessionDateTime = styled.div<{ $stacked?: boolean }>`
  ${({ $stacked }) =>
    $stacked
      ? css`
          display: flex;
          flex-direction: column;
        `
      : css`
          display: contents;
        `}
`;

export const EventsPagination = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.small};
  align-self: center;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      margin-top: 0;
    }
  `}
`;

export const DateText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxxxsmall};
`;
