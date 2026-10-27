import {
  Button,
  ButtonAppearance,
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

import ButtonsContainer from '../../atoms/ButtonsContainer';

const StyledCardHeader = styled(CardHeader)`
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

type E2EEWarningCardProps = {
  onContinue: () => void;
  /** the partner's client cannot encrypt, not this one */
  partner?: boolean;
};

function E2EEWarningCard({ onContinue, partner }: E2EEWarningCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const title = t(
    partner ? 'e2ee.partner_warning_title' : 'e2ee.warning_title',
  );

  return (
    <Card width={CardSizes.Medium}>
      <StyledCardHeader asContainer textColor={theme.color.text.error}>
        <ExclamationIcon label={title} color={theme.color.text.error} />
        <Text
          type={TextTypes.Heading4}
          tag="h3"
          center
          color={theme.color.text.error}
        >
          {title}
        </Text>
      </StyledCardHeader>
      <CardContent>
        <Text center type={TextTypes.Body4}>
          {t(partner ? 'e2ee.partner_warning_body' : 'e2ee.warning_body')}
        </Text>
      </CardContent>
      <CardFooter align="center">
        <ButtonsContainer>
          {!partner && (
            <Button
              appearance={ButtonAppearance.Secondary}
              size={ButtonSizes.Stretch}
              onClick={() => window.location.reload()}
            >
              {t('e2ee.warning_reload')}
            </Button>
          )}
          <Button size={ButtonSizes.Stretch} onClick={onContinue}>
            {t('e2ee.warning_continue')}
          </Button>
        </ButtonsContainer>
      </CardFooter>
    </Card>
  );
}

type E2EEWarningModalProps = E2EEWarningCardProps & {
  open: boolean;
};

function E2EEWarningModal({ open, ...cardProps }: E2EEWarningModalProps) {
  return (
    <Modal open={open} locked hideCloseButton>
      <E2EEWarningCard {...cardProps} />
    </Modal>
  );
}

export default E2EEWarningModal;
