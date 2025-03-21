import {
  Card,
  ContentTypes,
  Text,
  TextContent,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { map } from 'lodash';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { TRAININGS_ROUTE, getAppSubpageRoute } from '../../../routes.ts';
import { TRAININGS_DATA } from '../../blocks/Training/constants.ts';

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) =>
    `
      gap: ${theme.spacing.small};

      @media (min-width: ${theme.breakpoints.medium}) {
        gap: ${theme.spacing.medium};
      }`};
`;

const Trainings: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <Text color={theme.color.text.title} type={TextTypes.Body2} bold tag="h2">
        {t('resources.trainings.title')}
      </Text>
      <Text type={TextTypes.Body5} bold tag="h2">
        {t('resources.trainings.description')}
      </Text>
      <Container>
        <TextContent
          content={[
            {
              type: ContentTypes.List,
              listItems: map(
                TRAININGS_DATA,
                training =>
                  `<a {"href": "${getAppSubpageRoute(
                    TRAININGS_ROUTE,
                    training.slug,
                  )}"}>${training.title}</a>`,
              ),
            },
            {
              type: ContentTypes.Paragraph,
              text: t(`resources.trainings.method`),
            },
          ]}
        />
      </Container>
    </ContentCard>
  );
};

export default Trainings;
