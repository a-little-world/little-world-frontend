import {
    Button,
    Card,
    CardSizes,
    Text,
    TextTypes
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import useSWR from 'swr';
import { default as useRandomCallLobbyStore } from '../../../features/stores/randomCallLobby.ts';
import { USER_ENDPOINT, fetcher } from '../../../features/swr/index.ts';
import { PROFILE_CARD_HEIGHT } from '../Cards/ProfileCard';

const StyledCard = styled(Card)`
  align-items: center;
  border-color: ${({ theme }) => theme.color.border.subtle};
  gap: ${({ theme, $hasMatch }) =>
        $hasMatch ? theme.spacing.small : theme.spacing.xxsmall};
  justify-content: center;
  order: ${({ $hasMatch }) => ($hasMatch ? 1 : 0)};
  height: ${PROFILE_CARD_HEIGHT};
`;

const WelcomeTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  max-width: 280px; // ensures it wraps correctly
`;

const JoinLobbyButton = styled(Button)`
  ${({ theme, $isLink }) =>
        $isLink &&
        css`
      color: ${theme.color.text.link};
    `}
`;

export function Start({
    userPk,
}) {
    const { t } = useTranslation();

    const { data: user } = useSWR(USER_ENDPOINT, fetcher)
    const hasMatch = user?.hasMatch;

    const { initRandomCallLobby } = useRandomCallLobbyStore();

    return (
        <StyledCard width={CardSizes.Small} $hasMatch={hasMatch}>
            <WelcomeTitle tag="h3" type={TextTypes.Body1} bold center>
                {t(`start_random_call.title`)}
            </WelcomeTitle>
            <Text center>{t(`start_random_call.intro`)}</Text>
            <JoinLobbyButton
                onClick={() => initRandomCallLobby({ userId: userPk })}
            >
                {t(`start_random_call.lobby_btn`)}
            </JoinLobbyButton>
        </StyledCard>
    );
}

export default Start;
