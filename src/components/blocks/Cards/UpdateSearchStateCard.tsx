import {
  Button,
  ButtonAppearance,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  StatusMessage,
  StatusTypes,
  Text,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import { SEARCHING_STATES } from '../../../constants';
import useSearchState from '../../../hooks/useSearchState';
import ButtonsContainer from '../../atoms/ButtonsContainer';

interface UpdateSearchStateCardProps {
  onClose: () => void;
}

function UpdateSearchStateCard({ onClose }: UpdateSearchStateCardProps) {
  const { t } = useTranslation();
  const { isSearching, error, setSearching } = useSearchState();
  const currentState = isSearching
    ? SEARCHING_STATES.searching
    : SEARCHING_STATES.idle;

  function activateSearching() {
    setSearching(!isSearching, onClose);
  }

  return (
    <Card width={CardSizes.Medium}>
      <CardHeader>{t(`update_search_modal.${currentState}.title`)}</CardHeader>
      <CardContent>
        <Text>{t(`update_search_modal.${currentState}.description`)}</Text>
        {error && (
          <StatusMessage visible type={StatusTypes.Error}>
            {error.message}
          </StatusMessage>
        )}
      </CardContent>
      <CardFooter>
        <ButtonsContainer>
          <Button appearance={ButtonAppearance.Secondary} onClick={onClose}>
            {t(`update_search_modal.${currentState}.cancel_btn`)}
          </Button>
          <Button onClick={activateSearching}>
            {t(`update_search_modal.${currentState}.confirm_btn`)}
          </Button>
        </ButtonsContainer>
      </CardFooter>
    </Card>
  );
}

export default UpdateSearchStateCard;
