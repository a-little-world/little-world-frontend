import { FC, useEffect, useRef } from 'react';

import {
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
  max-width: 900px;
  margin: auto;
  align-items: center;

  > div:first-of-type {
    max-width: 720px;
  }
`;

const Title = styled(Text)`
  max-width: 700px;
`;

const EmbedContainer = styled.div`
  width: 100%;

  h1 {
    margin-bottom: 0px !important;
  }

  .widget-header.widget {
    padding-bottom: 0px !important;
    padding-top: 0px !important;
  }

  .widget-header {
    display: none !important;
  }
`;

const TWINGLE_WIDGET_URL =
  'https://spenden.twingle.de/embed/a-little-world-gemeinnutzige-ug-haftungsbeschrankt/sprache-schafft-heimat-toleranz-durch-dialog/tw66ebf16a1b2d3/widget';

const TwingleEmbed = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return () => {};

    const id = `_${Math.random().toString(36).slice(2, 11)}`;
    container.innerHTML = `<div id="twingle-public-embed-${id}"></div>`;

    const script = document.createElement('script');
    script.async = true;
    script.src = `${TWINGLE_WIDGET_URL}/${id}`;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <EmbedContainer id="twingle-container" ref={containerRef} />;
};

const Donate: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <Title
        tag="h1"
        bold
        type={TextTypes.Heading4}
        color={theme.color.text.title}
        center
      >
        {t('donate.title')}
      </Title>
      <TwingleEmbed />
    </ContentCard>
  );
};

export default Donate;
