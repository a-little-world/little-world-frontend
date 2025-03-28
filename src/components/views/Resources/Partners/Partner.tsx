import {
  ButtonAppearance,
  ButtonSizes,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';

import { PARTNERS_ROUTE, getAppRoute } from '../../../../router/routes.ts';
import Video from '../../../atoms/Video.tsx';
import { PARTNERS_DATA, getDataBySlug } from '../constants.ts';
import { Container, ContentCard, NotFoundCard } from '../shared.styles.tsx';
import {
  AdditionalImage,
  Cta,
  Description,
  Header,
  Image,
} from './Partners.styles.tsx';

const Partner: FC = () => {
  const { partnerSlug } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const partner = getDataBySlug(PARTNERS_DATA, partnerSlug);

  if (!partner)
    return (
      <NotFoundCard>
        <Text
          color={theme.color.text.title}
          type={TextTypes.Body2}
          bold
          tag="h2"
          center
        >
          {t('resources.partners.not_found')}
        </Text>
        <Link
          to={getAppRoute(PARTNERS_ROUTE)}
          buttonAppearance={ButtonAppearance.Primary}
        >
          {t('resources.partners.return')}
        </Link>
      </NotFoundCard>
    );

  return (
    <ContentCard>
      <Header>
        <Image src={partner.image} alt={`${partner.title} logo`} />
        {partner.additionalImage && (
          <AdditionalImage
            src={partner.additionalImage}
            alt={partner.additionalAltImage}
          />
        )}
      </Header>
      <Container>
        <Description>
          <Text>{t(`resources.partners.${partner.id}.text_content`)}</Text>
        </Description>

        <Cta
          href={partner.ctaLink}
          buttonAppearance={ButtonAppearance.Primary}
          buttonSize={ButtonSizes.Large}
        >
          {t(`resources.partners.${partner.id}.cta`)}
        </Cta>
        {/* {partner.displayEnglish && (
          <>
            <Divider />
            <Description>
              <Text>
                {t(`resources.partners.${partner.id}.text_content_secondary`)}
              </Text>
            </Description>

            <Cta
              href={partner.ctaLink}
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Large}
            >
              {t(`resources.partners.${partner.id}.cta`)}
            </Cta>
          </>
        )} */}
        {partner.videoId && (
          <Video src={partner.videoId} title={partner.videoTitle} />
        )}
      </Container>
    </ContentCard>
  );
};

export default Partner;
