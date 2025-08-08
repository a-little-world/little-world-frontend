import {
  Accordion,
  AccordionContent,
  ButtonAppearance,
  Card,
  ContentTypes,
  FriendshipImage,
  Gradients,
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
  tokens,
} from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../features/swr/index';
import Socials, { SOCIALS_LIST } from '../../atoms/Socials';
import MailingLists from '../../blocks/MailingLists/MailingLists';

const SupportUsAccordionContent = styled(AccordionContent)`
  background: ${({ theme }) => theme.color.surface.primary};
  gap: ${({ theme }) => theme.spacing.medium};

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
  subscribe_to_newsletter: <WomanOnRocketImage label="woman on rocket" />,
  share_improvements: (
    <LaptopWithPhoneImage
      label="laptop with phone"
      color={tokens.color.theme.light.text.heading}
    />
  ),
  thank_your_partner: <FriendshipImage label="friendship" />,
  share_with_friends: <TeacherImage label="teacher" />,
  join_events: <PeopleTogetherImage label="people together" />,
  organize_an_event: <GroupHandsImage label="group hands" />,
  write_a_review: <LivingRoomImage label="living room" />,
  become_a_volunteer: <FriendshipImage label="friendship" />,
  donate: <RaisingMoneyImage label="raising money" />,
  get_interviewed: (
    <LaptopWithPhoneImage
      label="laptop with phone"
      color={tokens.color.theme.light.text.heading}
    />
  ),
  distribute: <ManOnRocketImage label="man on rocket" />,
  corporate_involvement: <PeopleTogetherImage label="people together" />,
  volunteer: <TimeFlexibleImage label="time flexible" />,
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
        ContentWrapper={SupportUsAccordionContent}
        items={SECTIONS.map(section => ({
          header: t(`support_us.${section.title}.title`),
          content: section.items.map(label => (
            <SupportUsSegment key={label} label={label} />
          )),
        }))}
      />
      <PaperPlaneWrapper>
        <PaperPlaneImage label="paper plane" />
      </PaperPlaneWrapper>
      <Text center>{t('support_us.thank_you.message')}</Text>
    </ContentCard>
  );
};

export default SupportUs;
