import { FC } from 'react';

import {
  ButtonAppearance,
  ButtonSizes,
  Link,
  Text,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getAppRoute, PARTNERS_ROUTE } from '../../../../router/routes';
import NotFoundCard from '../../../atoms/NotFound';
import Video from '../../../atoms/Video';
import { getDataBySlug, PARTNERS_DATA } from '../constants';
import { Container, ContentCard } from '../shared.styles';
import {
  AdditionalImage,
  Cta,
  Description,
  Header,
  Image,
} from './Partners.styles';

const Partner: FC = () => {
  const { partnerSlug } = useParams();
  const { t } = useTranslation();
  const partner = getDataBySlug(PARTNERS_DATA, partnerSlug);

  if (!partner)
    return (
      <NotFoundCard title={t('resources.partners.not_found')}>
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
        <Image
          src={partner.image}
          alt={`${partner.title} logo`}
          $withAdditionalImage={!!partner.additionalImage}
        />
        {partner.additionalImage && (
          <AdditionalImage
            src={partner.additionalImage}
            alt={partner.additionalAltImage}
            $withAdditionalImage
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
          target="_blank"
        >
          {t(`resources.partners.${partner.id}.cta`)}
        </Cta>
        {partner.videoId && (
          <Video src={partner.videoId} title={partner.videoTitle} />
        )}
      </Container>
    </ContentCard>
  );
};

export default Partner;
