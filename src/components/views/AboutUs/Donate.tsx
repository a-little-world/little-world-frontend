import {
  Card,
  ContentTypes,
  Text,
  TextContent,
  TextTypes,
  WomanOnRocketImage,
} from '@a-little-world/little-world-design-system';
import React, { FC, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};

  > div:first-of-type {
    max-width: 720px;
  }
`;

const Title = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const EmbedContainer = styled.div`
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

const TwingleEmbed = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
        (function() {
          var u="https://spenden.twingle.de/embed/a-little-world-gemeinnutzige-ug-haftungsbeschrankt/sprache-schafft-heimat-toleranz-durch-dialog/tw66ebf16a1b2d3/widget";
          var id = '_' + Math.random().toString(36).substr(2, 9);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          d.getElementById('twingle-container').innerHTML = '<div id="twingle-public-embed-' + id + '"></div>';
          g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'/'+id; s.parentNode.insertBefore(g,s);
        })();
      `;

    containerRef.current?.appendChild(script);

    return () => {
      containerRef.current?.removeChild(script);
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
        type={TextTypes.Body2}
        color={theme.color.text.title}
        center
      >
        {t('donate.title')}
      </Title>
      <TextContent
        content={[
          {
            type: ContentTypes.Image,
            Image: WomanOnRocketImage,
            imageMaxWidth: '240px',
            imageWidth: '80%',
          },
          {
            type: ContentTypes.Subtitle,
            text: t('donate.subtitle'),
            style: { marginTop: theme.spacing.small },
          },
          {
            type: ContentTypes.Paragraph,
            text: t('donate.description'),
            style: { marginBottom: theme.spacing.medium },
          },
        ]}
      />

      <TwingleEmbed />
    </ContentCard>
  );
};

export default Donate;
