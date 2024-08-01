import {
  Accordion,
  ButtonAppearance,
  Card,
  ContentTypes,
  Link,
  PaperPlaneImage,
  Text,
  TextContent,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { Gradients } from '@a-little-world/little-world-design-system/dist/esm/components/Icon/IconGradient';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled, { css, useTheme } from 'styled-components';

import Socials, { SOCIALS_LIST } from '../../atoms/Socials.tsx';

const ACCORDION_CONTENT_CSS = css`
  background: white;
  gap: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;

  &[hidden] {
    display: none;
  }

  > div {
    &:nth-child(even) {
      align-items: flex-end;
      align-self: flex-end;
    }

    &:nth-child(odd) a {
      align-self: flex-start;
    }
  }
`;

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const Title = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const Segment = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px dashed ${({ theme }) => theme.color.border.subtle};
`;

const SegmentDescription = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  width: 80%;
`;

const SegmentLink = styled(Link)`
  width: auto;
`;

const SupportUsAccordion = styled(Accordion)`
  margin: ${({ theme }) => theme.spacing.medium} 0;
`;

const PaperPlaneWrapper = styled.div`
  width: 80%;
  max-width: 720px;
  margin: ${({ theme }) => theme.spacing.large} auto;
`;

const SECTIONS = [
  {
    title: 'simple_ways',
    items: [
      'subscribe_to_newsletter',
      'report_bugs',
      'share_improvements',
      'thank_your_partner',
      'social_media',
      'join_groups',
      'share_with_friends',
      'write_a_review',
      'join_events',
    ],
  },
  {
    title: 'intermediate_ways',
    items: [
      'organize_an_event',
      'become_a_volunteer',
      'share_improvements',
      'get_interviewed',
      'donate',
    ],
  },
  {
    title: 'advanced_ways',
    items: ['distribute', 'corporate_involvement', 'volunteer'],
  },
];

const SupportUsSegment = ({ label }: { label: string }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const supportUrl = useSelector(state => state.userData.supportUrl);

  return (
    <Segment>
      <Text type={TextTypes.Heading6} color={theme.color.text.title}>
        {t(`support_us.${label}.title`)}
      </Text>
      <SegmentDescription>
        {t(`support_us.${label}.description`)}
      </SegmentDescription>
      {SOCIALS_LIST[label] ? (
        <Socials
          type={label as 'social_media' | 'join_groups'}
          gradient={Gradients.Blue}
        />
      ) : (
        <SegmentLink
          href={t(`support_us.${label}.link_href`)}
          buttonAppearance={ButtonAppearance.Secondary}
        >
          {t(`support_us.${label}.link_text`, { supportUrl })}
        </SegmentLink>
      )}
    </Segment>
  );
};

const SupportUs: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <Title
        tag="h1"
        bold
        type={TextTypes.Body2}
        color={theme.color.text.title}
      >
        {t('support_us.title')}
      </Title>
      <TextContent
        content={[
          {
            type: ContentTypes.Paragraph,
            text: t('support_us.description'),
          },
        ]}
      />
      <SupportUsAccordion
        headerColor={theme.color.text.bold}
        contentCss={ACCORDION_CONTENT_CSS}
        items={SECTIONS.map(section => {
          return {
            header: t(`support_us.${section.title}.title`),
            content: section.items.map(label => (
              <SupportUsSegment key={label} label={label} />
            )),
          };
        })}
      />
      <PaperPlaneWrapper>
        <PaperPlaneImage />
      </PaperPlaneWrapper>
      <Text center>{t('support_us.thank_you.message')}</Text>
    </ContentCard>
  );
};

export default SupportUs;
