import {
  ButtonAppearance,
  ButtonSizes,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css, useTheme } from 'styled-components';

const Banner = styled.div<{ $background: string }>`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  background: ${({ $background, theme }) =>
    $background ? `url(${$background})` : '#053c56'};
  backgorund-position: center;
  background-size: cover;
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.medium}`};
  color: ${({ theme }) => theme.color.text.reversed};

  width: 100%;
  justify-content: center;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium} ${theme.spacing.medium};
      flex-direction: row;
    }
  `};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  max-width: 1000px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.large};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      justify-content: space-between;
    }
  `};
`;

const Ctas = styled.div`
  display: flex;
  align-self: flex-end;
  gap: ${({ theme }) => theme.spacing.small};
`;

const Title = styled(Text)``;

const Cta = styled(Link)`
  align-self: flex-end;
`;

const Description = styled(Text)`
  max-width: 500px;
`;

function CommsBanner() {
  const theme = useTheme();
  const banner = useSelector(state => state.userData.user.banner);
  if (isEmpty(banner)) return null;

  return (
    <Banner $background={banner.image}>
      <Content>
        <Title
          tag="h3"
          type={TextTypes.Heading3}
          color={theme.color.text.reversed}
        >
          {banner.title}
        </Title>

        <Section>
          <Description color={theme.color.text.reversed}>
            {banner.text}
          </Description>
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
