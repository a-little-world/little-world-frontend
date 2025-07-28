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
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../features/swr/index';

export enum BannerTypes {
  Small = 'small',
  Large = 'large',
}

const Banner = styled.div<{ $background: string; $isLarge: boolean }>`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  background: ${({ $background, theme }) =>
    $background ? `${$background}` : theme.color.surface.accent};
  background-position: center;
  background-size: cover;
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.color.text.reversed};
  width: 100%;
  justify-content: center;

  ${({ theme, $isLarge }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
    }

    ${$isLarge &&
    css`
      min-height: 520px;
      padding: ${theme.spacing.large} ${theme.spacing.medium};

      @media (min-width: ${theme.breakpoints.medium}) {
        min-height: 272px;
        padding: ${theme.spacing.large};
      }
    `}
  `};
`;

const Content = styled.div<{ $isLarge: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme, $isLarge }) =>
    $isLarge ? theme.spacing.large : theme.spacing.medium};
  max-width: 1200px;

  ${({ theme, $isLarge }) => css`
    @media (min-width: ${$isLarge
        ? theme.breakpoints.large
        : theme.breakpoints.medium}) {
      flex-direction: row;
      gap: ${$isLarge ? theme.spacing.xlarge : theme.spacing.large};
      justify-content: ${$isLarge ? 'space-between' : 'center'};
    }
  `};
`;

const Container = styled.div<{ $hasImage?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.large};
  justify-content: ${({ $hasImage }) =>
    $hasImage ? 'flex-start' : 'flex-end'};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.large};
    }
  `};
`;

const LeftContainer = styled(Container)`
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const RightContainer = styled(Container)<{ $ctasOnLHS: boolean }>`
  ${({ $ctasOnLHS, theme }) => css`
    display: ${$ctasOnLHS ? 'none' : 'flex'};

    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
  `}
`;

const MobileBannerImage = styled.img<{ $isLarge: boolean }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.small};
  object-fit: cover;
  align-self: center;

  ${({ theme, $isLarge }) => css`
    display: ${$isLarge ? 'flex' : 'none'};
    max-height: ${$isLarge ? '240px' : '120px'};
    @media (min-width: ${$isLarge
        ? theme.breakpoints.large
        : theme.breakpoints.medium}) {
      display: none;
    }
  `};
`;

const DesktopBannerImage = styled.img<{ $isLarge: boolean }>`
  display: none;
  border-radius: ${({ theme }) => theme.radius.small};

  ${({ theme, $isLarge }) => css`
    @media (min-width: ${$isLarge
        ? theme.breakpoints.large
        : theme.breakpoints.medium}) {
      display: block;
      width: auto;
      height: auto;
      max-height: ${$isLarge ? '480px' : '180px'};
      object-fit: contain;
      align-self: flex-start;
    }
  `};
`;

const Title = styled(Text)`
  line-height: 1;
`;

const Ctas = styled.div<{ $isRHS?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  flex-direction: column;

  ${({ theme, $isRHS }) => css`
    margin-top: ${$isRHS ? '0' : theme.spacing.xxsmall};

    @media (min-width: ${theme.breakpoints.small}) {
      flex-direction: row;
      flex-wrap: wrap;

      ${$isRHS &&
      `      
      align-self: flex-end;
      justify-content: flex-end;
      `}
    }

    @media (min-width: ${theme.breakpoints.medium}) {
      margin-top: auto;
    }
  `};
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
  const banner = useSWR(USER_ENDPOINT).data?.banner;
  if (isEmpty(banner)) return null;
  const isLarge = banner.type === BannerTypes.Large;
  // depending on the type and image, we want to show the ctas on LHS
  const showCtasOnLHS = banner.type === BannerTypes.Small && banner.image;

  return (
    <Banner $background={banner.background} $isLarge={isLarge}>
      <Content $isLarge={isLarge}>
        <LeftContainer>
          {banner.image && (
            <MobileBannerImage
              src={banner.image}
              alt={banner.image_alt}
              $isLarge={isLarge}
            />
          )}
          <Title
            tag="h3"
            type={isLarge ? TextTypes.Heading3 : TextTypes.Heading5}
            color={banner.text_color}
          >
            {banner.title}
          </Title>
          <Description color={banner.text_color}>{banner.text}</Description>
          {showCtasOnLHS && (
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
          )}
        </LeftContainer>

        <RightContainer $hasImage={!!banner.image} $ctasOnLHS={showCtasOnLHS}>
          {banner.image && (
            <DesktopBannerImage
              src={banner.image}
              alt={banner.image_alt}
              $isLarge={isLarge}
            />
          )}
          {!showCtasOnLHS && (
            <Ctas $isRHS>
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
          )}
        </RightContainer>
      </Content>
    </Banner>
  );
}

export default CommsBanner;
