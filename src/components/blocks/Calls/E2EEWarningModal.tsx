import {
  Button,
  ButtonSizes,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  ExclamationIcon,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

const StyledCardHeader = styled(CardHeader)`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

/**
 * Blocking content for clients that cannot encrypt call media. There is deliberately no
 * action to continue into a call: calls are only offered with end-to-end encryption, so
 * the client has to be updated instead.
 */
export function E2EEWarningCard() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card width={CardSizes.Medium}>
      <StyledCardHeader asContainer textColor={theme.color.text.error}>
        <ExclamationIcon
          label={t('e2ee.warning_title')}
          color={theme.color.text.error}
        />
        <Text
          type={TextTypes.Heading4}
          tag="h3"
          center
          color={theme.color.text.error}
        >
          {t('e2ee.warning_title')}
        </Text>
      </StyledCardHeader>
      <CardContent>
        <Text center type={TextTypes.Body4}>
          {t('e2ee.warning_body')}
        </Text>
      </CardContent>
      <CardFooter align="center">
        <Button
          size={ButtonSizes.Stretch}
          onClick={() => window.location.reload()}
        >
          {t('e2ee.warning_reload')}
        </Button>
      </CardFooter>
    </Card>
  );
}

type E2EEWarningModalProps = {
  open: boolean;
};

/**
 * Full-screen variant for the call route, in case it is reached without passing through
 * the call setup (e.g. a stale deep link). The call UI is never rendered for those clients.
 */
function E2EEWarningModal({ open }: E2EEWarningModalProps) {
  return (
    <Modal open={open} locked hideCloseButton>
      <E2EEWarningCard />
    </Modal>
  );
}

export default E2EEWarningModal;
