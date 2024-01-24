import {
  Button,
  Card,
  CardSizes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import ProfileImage from '../../atoms/ProfileImage';

const Centred = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;

  ${({ theme }) => `
  margin-bottom: ${theme.spacing.medium};

  @media (min-width: ${theme.breakpoints.small}) {
    margin-bottom: ${theme.spacing.large};
  }
  `}
`;

const NewMatchCard = ({ name, image, imageType, onExit }) => {
  const { t } = useTranslation();

  return (
    <Card width={CardSizes.Large}>
      <Centred>
        <Text tag="h2" type={TextTypes.Heading4}>
          {t('new_match_title')}
        </Text>

        <ProfileImage image={image} imageType={imageType} />
        <Text type={TextTypes.Body5}>
          {t('new_match_description', { name })}
        </Text>
        <Text tag="h3" type={TextTypes.Body5}>
          {t('new_match_instruction')}
        </Text>
      </Centred>
      <Button onClick={onExit}>{t('new_match_close_btn')}</Button>
    </Card>
  );
};

export default NewMatchCard;
