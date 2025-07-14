import {
  Accordion,
  ButtonAppearance,
  Card,
  ContentTypes,
  FriendshipImage,
  GroupHandsImage,
  LaptopWithPhoneImage,
  Link,
  LivingRoomImage,
  ManOnRocketImage,
  PaperPlaneImage,
  PeopleTogetherImage,
  RaisingMoneyImage,
  TeacherImage,
  Text,
  TextContent,
  TextTypes,
  TimeFlexibleImage,
  WomanOnRocketImage,
} from '@a-little-world/little-world-design-system';
import { Gradients } from '@a-little-world/little-world-design-system/dist/esm/components/Icon/IconGradient';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../features/swr/index.ts';
import Socials, { SOCIALS_LIST } from '../../atoms/Socials.tsx';
import MailingLists from '../../blocks/MailingLists/MailingLists.tsx';

const ACCORDION_CONTENT_CSS = css`
  background: white;
  gap: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;

  &[hidden] {
    display: none;
  }

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
        > div {
            &:nth-child(even) {
                & > div:first-child {
                  order: 1;
                }
            }
        }
    }
  `}
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
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px dashed ${({ theme }) => theme.color.border.subtle};
  gap: ${({ theme }) => theme.spacing.medium};
`;

const SegmentContent = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      width: 80%;
    }
  `}
`;

const ImageContainer = styled.div`
  display: flex;

  svg {
    height: 112px;
    max-height: 160px;
    width: auto;
  }

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      align-items: center;
      width: 20%;

      svg {
       height: auto;
       width: 90%;
      }
    }
  `}
`;

const SegmentDescription = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
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

const Ctas = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-wrap: wrap;
`;

const SECTIONS_WITH_TWO_CTAS = ['volunteer'];
const SECTION_IMAGES = {
  subscribe_to_newsletter: <WomanOnRocketImage />,
  share_improvements: <LaptopWithPhoneImage />,
  thank_your_partner: <FriendshipImage />,
  share_with_friends: <TeacherImage />,
  join_events: <PeopleTogetherImage />,
  organize_an_event: <GroupHandsImage />,
  write_a_review: <LivingRoomImage />,
  become_a_volunteer: <FriendshipImage />,
  donate: <RaisingMoneyImage />,
  get_interviewed: <LaptopWithPhoneImage />,
  distribute: <ManOnRocketImage />,
  corporate_involvement: <PeopleTogetherImage />,
  volunteer: <TimeFlexibleImage />,
};

const SECTIONS = [
  {
    title: 'simple_ways',
    items: [
      'subscribe_to_newsletter',
      'share_improvements',
      'thank_your_partner',
      'social_media',
      'join_groups',
      'share_with_friends',
      'join_events',
      'write_a_review',
    ],
  },
  {
    title: 'intermediate_ways',
    items: [
      'organize_an_event',
      'become_a_volunteer',
      'get_interviewed',
      'donate',
    ],
  },
  {
    title: 'advanced_ways',
    items: ['distribute', 'corporate_involvement', 'volunteer'],
  },
];

const SegmentCta = ({ label }: { label: string }) => {
  const { t } = useTranslation();
  const { data: userData } = useSWR(USER_ENDPOINT);
  const supportUrl = userData?.supportUrl;
  if (label === 'subscribe_to_newsletter') return <MailingLists hideLabel />;

  return SOCIALS_LIST[label] ? (
    <Socials
      type={label as 'social_media' | 'join_groups'}
      gradient={Gradients.Blue}
    />
  ) : (
    <Ctas>
      <SegmentLink
        href={t(`support_us.${label}.link_href`, { supportUrl })}
        buttonAppearance={ButtonAppearance.Secondary}
      >
        {t(`support_us.${label}.link_text`)}
      </SegmentLink>
      {SECTIONS_WITH_TWO_CTAS.includes(label) && (
        <SegmentLink
          href={t(`support_us.${label}.link_2_href`, { supportUrl })}
          buttonAppearance={ButtonAppearance.Secondary}
        >
          {t(`support_us.${label}.link_2_text`)}
        </SegmentLink>
      )}
    </Ctas>
  );
};

const SupportUsSegment = ({ label }: { label: string }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Segment>
      <SegmentContent>
        <Text type={TextTypes.Heading6} color={theme.color.text.title}>
          {t(`support_us.${label}.title`)}
        </Text>
        <SegmentDescription>
          {t(`support_us.${label}.description`)}
        </SegmentDescription>
        <SegmentCta label={label} />
      </SegmentContent>
      <ImageContainer>{SECTION_IMAGES[label] || ''}</ImageContainer>
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
        items={SECTIONS.map(section => ({
          header: t(`support_us.${section.title}.title`),
          content: section.items.map(label => (
            <SupportUsSegment key={label} label={label} />
          )),
        }))}
      />
      <PaperPlaneWrapper>
        <PaperPlaneImage />
      </PaperPlaneWrapper>
      <Text center>{t('support_us.thank_you.message')}</Text>
    </ContentCard>
  );
};

export default SupportUs;
