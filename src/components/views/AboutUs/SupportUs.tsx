import { FC } from 'react';

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
  ManOnRocketImage,
  PaperPlaneImage,
  PeopleTogetherImage,
  RaisingMoneyImage,
  TeacherImage,
  Text,
  TextContent,
  TextTypes,
  TimeFlexibleImage,
  tokens,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import useSupportChat from '../../../hooks/useSupportChat';
import Socials, { SOCIALS_LIST } from '../../atoms/Socials';
import MailingLists from '../../blocks/MailingLists/MailingLists';

const SupportUsAccordionContent = styled(AccordionContent)`
  background: ${({ theme }) => theme.color.surface.primary};
  gap: ${({ theme }) => theme.spacing.medium};
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
  join_events: <PeopleTogetherImage label="people together" />,
  organize_an_event: <GroupHandsImage label="group hands" />,
  become_a_volunteer: <FriendshipImage label="friendship" />,
  stories: <TeacherImage label="stories" />,
  donate: <RaisingMoneyImage label="raising money" />,
  get_interviewed: (
    <LaptopWithPhoneImage
      label="laptop with phone"
      color={tokens.color.theme.light.text.heading}
    />
  ),
  distribute: <ManOnRocketImage label="man on rocket" />,
  volunteer: <TimeFlexibleImage label="time flexible" />,
};

const SECTIONS = [
  {
    title: 'share',
    items: ['distribute', 'subscribe_to_newsletter', 'stories', 'social_media'],
  },
  {
    title: 'community',
    items: ['join_events', 'organize_an_event', 'get_interviewed'],
  },
  {
    title: 'advanced_ways',
    items: ['donate', 'volunteer'],
  },
];

const SegmentCta = ({ label }: { label: string }) => {
  const { t } = useTranslation();
  const { supportUrl } = useSupportChat();
  if (label === 'subscribe_to_newsletter') return <MailingLists hideLabel />;

  return SOCIALS_LIST[label] ? (
    <Socials
      align="flex-start"
      type={label as 'social_media'}
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
        type={TextTypes.Heading4}
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
