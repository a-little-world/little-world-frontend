import {
  ButtonAppearance,
  ButtonSizes,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React from 'react';
import styled, { css } from 'styled-components';

import { useSelector } from '../../hooks/index.ts';

const Banner = styled.div<{ $background: string }>`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  background: ${({ $background }) =>
    $background ? `url(${$background})` : '#053c56'};
  background-position: center;
  background-size: cover;
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.medium}`};
  color: ${({ theme }) => theme.color.text.reversed};
  min-height: 520px;
  width: 100%;
  justify-content: center;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.large};
      flex-direction: row;
      min-height: 272px;
    }
  `};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  max-width: 1200px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.xlarge};
  justify-content: space-between;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.large};
    }
  `};
`;

const Ctas = styled.div`
  display: flex;
  align-self: flex-end;
  gap: ${({ theme }) => theme.spacing.small};
  flex-direction: column;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      flex-wrap: wrap;
    }
  `};
`;

const Title = styled(Text)``;

const Cta = styled(Link)`
  align-self: flex-end;
`;

const Description = styled(Text)`
  max-width: 496px;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      max-width: 584px;
    }
  `};
`;

function CommsBanner() {
  const banner = useSelector(state => state.userData.user.banner);
  if (isEmpty(banner)) return null;

  return (
    <Banner $background={banner.image}>
      <Content>
        <Title tag="h3" type={TextTypes.Heading3} color={banner.text_color}>
          {banner.title}
        </Title>

        <Section>
          <Description color={banner.text_color}>{banner.text}</Description>
          <Ctas>
            {banner.cta_2_url && (
              <Cta
                to={banner.cta_2_url}
                buttonAppearance={ButtonAppearance.Secondary}
                buttonSize={ButtonSizes.Medium}
              >
                {banner.cta_2_text}
              </Cta>
            )}
            {banner.cta_1_url && (
              <Cta
                to={banner.cta_1_url}
                buttonAppearance={ButtonAppearance.Primary}
                buttonSize={ButtonSizes.Medium}
              >
                {banner.cta_1_text}
              </Cta>
            )}
          </Ctas>
        </Section>
      </Content>
    </Banner>
  );
}

export default CommsBanner;
