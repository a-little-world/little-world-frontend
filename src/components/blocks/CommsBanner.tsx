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

const BANNER_LARGE_BREAKPOINT = '960px';

const Banner = styled.div<{ $background: string }>`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  background: ${({ $background }) =>
    $background ? `${$background}` : '#053c56'};
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
  gap: ${({ theme }) => theme.spacing.large};
  max-width: 1200px;

  ${({ theme }) => css`
    @media (min-width: ${BANNER_LARGE_BREAKPOINT}) {
      flex-direction: row;
      gap: ${theme.spacing.xlarge};
      justify-content: space-between;
    }
  `};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.large};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      justify-content: center;
      gap: ${theme.spacing.large};
    }
  `};
`;

const TextContainer = styled(Container)`
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const Ctas = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  flex-direction: column;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      align-self: flex-end;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    @media (min-width: ${BANNER_LARGE_BREAKPOINT}) {
      justify-content: center;
    }
  `};
`;

const MobileBannerImage = styled.img`
  width: 100%;

  ${() => css`
    @media (min-width: ${BANNER_LARGE_BREAKPOINT}) {
      display: none;
    }
  `};
`;

const DesktopBannerImage = styled.img`
  display: none;

  ${() => css`
    @media (min-width: ${BANNER_LARGE_BREAKPOINT}) {
      display: block;
      min-width: 352px;
      width: 100%;
    }
  `};
`;

const Title = styled(Text)`
  line-height: 1;
`;

const Cta = styled(Link)`
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      align-self: flex-end;
    }
  `};
`;

const PrimaryCta = styled(Cta)<{ $hasBorder: boolean }>`
  ${({ $hasBorder }) => $hasBorder && `border: 2px solid #fff;`}
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
    <Banner $background={banner.background}>
      <Content>
        <TextContainer>
          {banner.image && (
            <MobileBannerImage src={banner.image} alt={banner.image_alt} />
          )}
          <Title tag="h3" type={TextTypes.Heading3} color={banner.text_color}>
            {banner.title}
          </Title>
          <Description color={banner.text_color}>{banner.text}</Description>
        </TextContainer>

        <Container>
          {banner.image && (
            <DesktopBannerImage src={banner.image} alt={banner.image_alt} />
          )}
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
              <PrimaryCta
                to={banner.cta_1_url}
                buttonAppearance={ButtonAppearance.Primary}
                buttonSize={ButtonSizes.Medium}
                $hasBorder={banner.name.includes('Learner')}
              >
                {banner.cta_1_text}
              </PrimaryCta>
            )}
          </Ctas>
        </Container>
      </Content>
    </Banner>
  );
}

export default CommsBanner;
