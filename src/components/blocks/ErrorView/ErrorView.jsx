import {
  Button,
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled from 'styled-components';
import Layout from '../Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ButtonSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Button/Button';

const ErrorCard = styled(Card)`
  text-align: center;
  align-items: center;
  justif-content: space-between;
  padding: ${({ theme }) => theme.spacing.xxlarge};
  gap: ${({ theme }) => theme.spacing.large};
  max-width: 800px;
  margin: 0 auto;
`;

const RouterError = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Layout>
      <ErrorCard>
        <Text type={TextTypes.Heading2}>{t('error_view.title')}</Text>
        <Button size={ButtonSizes.Large} onClick={() => navigate('/')}>
          {t('error_view.button')}
        </Button>
      </ErrorCard>
    </Layout>
  );
};

export default RouterError;
