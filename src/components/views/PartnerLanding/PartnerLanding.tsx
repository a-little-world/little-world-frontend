import { useEffect, useRef, useState } from 'react';

import {
  ButtonAppearance,
  ButtonSizes,
  CustomThemeProvider,
  HeartIcon,
  InclusiveIcon,
  Link,
  Loading,
  LoadingSizes,
  MessageIcon,
  PuzzleIcon,
  Text,
  TextTypes,
  ThemeVariants,
  TickIcon,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { getPartnerLandingEndpoint } from '../../../api/endpoints';
import {
  fetchPartnerLanding,
  registerPartner,
} from '../../../api/partnerLanding';
import { formatDate } from '../../../helpers/date';
import { onFormError } from '../../../helpers/form';
import {
  getAppRoute,
  getHomeRoute,
  PRIVACY_ROUTE,
  WP_HOME_ROUTE,
} from '../../../router/routes';
import Logo from '../../atoms/Logo';
import PartnerSignUpCard, {
  SUPPORT_EMAIL,
} from '../../blocks/PartnerSignUpCard/PartnerSignUpCard';
import { PARTNER_EVENT } from './constants';
import {
  AvatarStack,
  BenefitCopy,
  BenefitList,
  BenefitRow,
  CardGrid,
  EyebrowPill,
  FaqAccordion,
  FaqAccordionContent,
  FaqInner,
  FaqSection,
  FeatureCard,
  FeatureCopy,
  FeatureText,
  FeatureTitle,
  FinalBlock,
  FinalInner,
  FinalLead,
  FinalTitle,
  FooterBrand,
  FooterCopy,
  FooterLinks,
  Garland,
  GarlandLight,
  Hero,
  HeroBadge,
  HeroBadgeCopy,
  HeroBadgeText,
  HeroBadgeTitle,
  HeroContent,
  HeroDoor,
  HeroDoorNumber,
  HeroLayout,
  HeroLead,
  HeroMedia,
  HeroPills,
  HeroTitle,
  HomeLink,
  IconCircle,
  InitialsAvatar,
  NavBar,
  Page,
  PageFooter,
  PartnerDoorPill,
  PartnerLogo,
  PartnerName,
  PartnerPill,
  PersonCopy,
  PersonName,
  PersonRole,
  PersonRow,
  QuoteCard,
  QuoteMark,
  QuoteText,
  Section,
  SectionEyebrow,
  SectionInner,
  SectionIntro,
  SectionTitle,
  SplitColumn,
  SplitSection,
  StatusWrap,
  StepCard,
  StepNumber,
  StepsRow,
  StepText,
  StickyBar,
  StickyButton,
  StoriesGrid,
  StoryCard,
  StoryContext,
  StoryLink,
  StoryNames,
  StoryQuote,
  StoryQuoteMark,
  StorySpeaker,
  WhiteLogo,
} from './PartnerLanding.styles';
import { validatePartnerEmail } from './validation';

const GARLAND_TONES = ['highlight', 'accent', 'heading', 'title'] as const;
const GARLAND_COUNT = 34;

const COUNTERPART_ITEMS = [
  { key: 'speech', Icon: MessageIcon },
  { key: 'welcome', Icon: HeartIcon },
  { key: 'everyday', Icon: PuzzleIcon },
  { key: 'together', Icon: InclusiveIcon },
] as const;

const FOR_YOU_ITEMS = ['half_hour', 'you_decide'] as const;
const QUOTES = [
  { key: 'peter', initials: 'P', tone: 'bold' as const },
  { key: 'sabine', initials: 'S', tone: 'highlight' as const },
];
const STEP_KEYS = ['one', 'two', 'three'] as const;
const STORIES = [
  {
    key: 'jamal_monika',
    initials: [
      { letter: 'J', tone: 'bold' as const },
      { letter: 'M', tone: 'highlight' as const },
    ],
  },
  {
    key: 'fazal_joerg',
    initials: [
      { letter: 'F', tone: 'highlight' as const },
      { letter: 'J', tone: 'bold' as const },
    ],
  },
];
const FAQ_KEYS = ['level', 'stay', 'privacy', 'tech', 'employer'] as const;

const PartnerLandingPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { partnerSlug } = useParams<{ partnerSlug: string }>();
  const heroRef = useRef<HTMLElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const { data: partner, error: loadError } = useSWR(
    partnerSlug ? getPartnerLandingEndpoint(partnerSlug) : null,
    () => fetchPartnerLanding(partnerSlug as string),
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [partner]);

  useEffect(() => {
    if (!partner) return undefined;
    const previousTitle = document.title;
    document.title = `${partner.name} · Little World`;
    return () => {
      document.title = previousTitle;
    };
  }, [partner]);

  const exampleEmail = partner?.email_domain
    ? `vorname.name@${partner.email_domain}`
    : 'name@firma.de';

  const errorMessage = (code: 'empty' | 'invalid' | 'domain') => {
    if (code === 'empty') return t('partner_landing.error_empty');
    if (code === 'invalid') return t('partner_landing.error_invalid');
    return t('partner_landing.error_domain', {
      companyName: partner?.name ?? '',
      example: exampleEmail,
      supportEmail: SUPPORT_EMAIL,
    });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!partnerSlug || !partner || isSubmitting || success) return;

    const code = validatePartnerEmail(email, partner.email_domain);
    if (code) {
      setError(errorMessage(code));
      return;
    }

    setIsSubmitting(true);
    try {
      await registerPartner(partnerSlug, {
        email: email.trim(),
        newsletter_subscribed: newsletter,
      });
      setSuccess(true);
    } catch (submitError) {
      onFormError({
        e: submitError as { cause: string; message?: string; status?: number },
        formFields: { email },
        setError: (name, fieldError) => {
          if (name === 'email' || name === 'root.serverError') {
            setError(
              t(fieldError.message ?? 'partner_landing.error_invalid', {
                companyName: partner.name,
                example: exampleEmail,
                supportEmail: SUPPORT_EMAIL,
              }),
            );
          }
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToFinalCard = () => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    finalCardRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  if (loadError) {
    return (
      <StatusWrap>
        <Text type={TextTypes.Heading5} tag="h1">
          {t('partner_landing.not_found')}
        </Text>
        <Link to={getAppRoute()} buttonSize={ButtonSizes.Medium}>
          {t('partner_landing.back_home')}
        </Link>
      </StatusWrap>
    );
  }

  if (!partner) {
    return (
      <StatusWrap>
        <Loading size={LoadingSizes.Medium} />
      </StatusWrap>
    );
  }

  const eventDateShort = formatDate(
    PARTNER_EVENT.startsAt,
    'd. MMMM',
    i18n.language,
  );

  const cardProps = {
    partner,
    email,
    newsletter,
    error,
    isSubmitting,
    success,
    onEmailChange: handleEmailChange,
    onNewsletterChange: setNewsletter,
    onSubmit: handleSubmit,
  };

  const faqItems = FAQ_KEYS.map(key => ({
    header: t(`partner_landing.faq.${key}.question`),
    content: t(`partner_landing.faq.${key}.answer`),
  }));

  return (
    <CustomThemeProvider
      defaultMode={ThemeVariants.light}
      enableDarkMode={false}
    >
      <Page>
        <Hero ref={heroRef}>
          <Garland aria-hidden="true">
            {Array.from({ length: GARLAND_COUNT }, (_, index) => (
              <GarlandLight
                key={index}
                $tone={GARLAND_TONES[index % GARLAND_TONES.length]}
                $wave={Math.sin((index / (GARLAND_COUNT - 1)) * Math.PI * 2)}
              />
            ))}
          </Garland>
          <NavBar>
            <HomeLink href={WP_HOME_ROUTE} target="_blank" rel="noreferrer">
              <WhiteLogo stacked={false} asLink={false} />
            </HomeLink>
            <PartnerPill>
              <Text bold color={theme.color.text.info} type={TextTypes.Body6}>
                {t('partner_landing.in_partnership_with')}
              </Text>
              {partner.logo && <PartnerLogo src={partner.logo} alt="" />}
              <PartnerName>{partner.name}</PartnerName>
            </PartnerPill>
          </NavBar>
          <HeroLayout>
            <HeroContent>
              <HeroPills>
                <EyebrowPill>{PARTNER_EVENT.campaignLabel}</EyebrowPill>
                <PartnerDoorPill>
                  {t('partner_landing.hero_partner_opens', {
                    companyName: partner.name,
                  })}
                </PartnerDoorPill>
              </HeroPills>
              <HeroTitle>{t('partner_landing.hero_title')}</HeroTitle>
              <HeroLead>
                {t('partner_landing.hero_lead', {
                  companyName: partner.name,
                  eventDate: eventDateShort,
                })}
              </HeroLead>
              <PartnerSignUpCard {...cardProps} inputId="partner-email-hero" />
            </HeroContent>
            <HeroMedia>
              <HeroBadge>
                <HeroDoor>
                  <HeroDoorNumber>{PARTNER_EVENT.doorNumber}</HeroDoorNumber>
                </HeroDoor>
                <HeroBadgeCopy>
                  <HeroBadgeTitle>
                    {t('partner_landing.hero_badge_title')}
                  </HeroBadgeTitle>
                  <HeroBadgeText>
                    {t('partner_landing.hero_badge_text')}
                  </HeroBadgeText>
                </HeroBadgeCopy>
              </HeroBadge>
            </HeroMedia>
          </HeroLayout>
        </Hero>

        <Section $tone="primary">
          <SectionInner>
            <SectionIntro>
              <SectionEyebrow>
                {t('partner_landing.counterpart.eyebrow')}
              </SectionEyebrow>
              <SectionTitle>
                {t('partner_landing.counterpart.title')}
              </SectionTitle>
            </SectionIntro>
            <CardGrid>
              {COUNTERPART_ITEMS.map(({ key, Icon }) => (
                <FeatureCard key={key}>
                  <IconCircle>
                    <Icon
                      label={t(`partner_landing.counterpart.${key}.title`)}
                      width={24}
                      color={theme.color.text.title}
                    />
                  </IconCircle>
                  <FeatureCopy>
                    <FeatureTitle>
                      {t(`partner_landing.counterpart.${key}.title`)}
                    </FeatureTitle>
                    <FeatureText>
                      {t(`partner_landing.counterpart.${key}.text`)}
                    </FeatureText>
                  </FeatureCopy>
                </FeatureCard>
              ))}
            </CardGrid>
          </SectionInner>
        </Section>

        <Section $tone="secondary">
          <SectionInner>
            <SplitSection>
              <SplitColumn>
                <SectionIntro>
                  <SectionEyebrow>
                    {t('partner_landing.for_you.eyebrow')}
                  </SectionEyebrow>
                  <SectionTitle>
                    {t('partner_landing.for_you.title')}
                  </SectionTitle>
                </SectionIntro>
                <BenefitList>
                  {FOR_YOU_ITEMS.map(key => (
                    <BenefitRow key={key}>
                      <IconCircle $tone="success">
                        <TickIcon
                          label={t(`partner_landing.for_you.${key}.title`)}
                          width={24}
                          color={theme.color.text.success}
                        />
                      </IconCircle>
                      <BenefitCopy>
                        <FeatureTitle>
                          {t(`partner_landing.for_you.${key}.title`)}
                        </FeatureTitle>
                        <FeatureText>
                          {t(`partner_landing.for_you.${key}.text`)}
                        </FeatureText>
                      </BenefitCopy>
                    </BenefitRow>
                  ))}
                </BenefitList>
              </SplitColumn>
              <SplitColumn>
                {QUOTES.map(quote => (
                  <QuoteCard key={quote.key}>
                    <QuoteMark aria-hidden="true">„</QuoteMark>
                    <QuoteText>
                      {t(`partner_landing.quote.${quote.key}.text`)}
                    </QuoteText>
                    <PersonRow>
                      <InitialsAvatar $tone={quote.tone}>
                        {quote.initials}
                      </InitialsAvatar>
                      <PersonCopy>
                        <PersonName>
                          {t(`partner_landing.quote.${quote.key}.name`)}
                        </PersonName>
                        <PersonRole>
                          {t(`partner_landing.quote.${quote.key}.role`)}
                        </PersonRole>
                      </PersonCopy>
                    </PersonRow>
                  </QuoteCard>
                ))}
              </SplitColumn>
            </SplitSection>
          </SectionInner>
        </Section>

        <Section $tone="subtle">
          <SectionInner>
            <SectionTitle>{t('partner_landing.steps.title')}</SectionTitle>
            <StepsRow>
              {STEP_KEYS.map((key, index) => (
                <StepCard key={key}>
                  <StepNumber>{index + 1}</StepNumber>
                  <StepText>
                    {key === 'three'
                      ? t('partner_landing.steps.three', {
                          eventDate: eventDateShort,
                        })
                      : t(`partner_landing.steps.${key}`)}
                  </StepText>
                </StepCard>
              ))}
            </StepsRow>
          </SectionInner>
        </Section>

        <Section $tone="primary">
          <SectionInner>
            <SectionIntro>
              <SectionEyebrow>
                {t('partner_landing.stories.eyebrow')}
              </SectionEyebrow>
              <SectionTitle>{t('partner_landing.stories.title')}</SectionTitle>
            </SectionIntro>
            <StoriesGrid>
              {STORIES.map(story => (
                <StoryCard key={story.key}>
                  <AvatarStack>
                    {story.initials.map(person => (
                      <InitialsAvatar
                        key={person.letter}
                        $size="large"
                        $tone={person.tone}
                      >
                        {person.letter}
                      </InitialsAvatar>
                    ))}
                  </AvatarStack>
                  <StoryNames>
                    {t(`partner_landing.stories.${story.key}.names`)}
                  </StoryNames>
                  <StoryQuote>
                    <StoryQuoteMark aria-hidden="true">„</StoryQuoteMark>
                    {t(`partner_landing.stories.${story.key}.quote`)}
                    <StoryQuoteMark aria-hidden="true">“</StoryQuoteMark>{' '}
                    <StorySpeaker>
                      ({t(`partner_landing.stories.${story.key}.speaker`)})
                    </StorySpeaker>
                  </StoryQuote>
                  <StoryContext>
                    {t(`partner_landing.stories.${story.key}.context`)}
                  </StoryContext>
                  <StoryLink
                    href={t('support_us.stories.link_href')}
                    target="_blank"
                    buttonAppearance={ButtonAppearance.Secondary}
                    buttonSize={ButtonSizes.Medium}
                  >
                    {t('partner_landing.stories.read')}
                  </StoryLink>
                </StoryCard>
              ))}
            </StoriesGrid>
          </SectionInner>
        </Section>

        <FaqSection $tone="secondary">
          <FaqInner>
            <SectionTitle>{t('partner_landing.faq.title')}</SectionTitle>
            <FaqAccordion
              headerType={TextTypes.Heading7}
              headerColor={theme.color.text.bold}
              ContentWrapper={FaqAccordionContent}
              defaultValue={faqItems[0]?.header}
              items={faqItems}
            />
          </FaqInner>
        </FaqSection>

        <FinalBlock>
          <FinalInner>
            <FinalTitle>{t('partner_landing.final_title')}</FinalTitle>
            <FinalLead>
              {t('partner_landing.final_lead', {
                companyName: partner.name,
                eventDate: eventDateShort,
              })}
            </FinalLead>
            <div ref={finalCardRef}>
              <PartnerSignUpCard {...cardProps} inputId="partner-email-final" />
            </div>
          </FinalInner>
        </FinalBlock>

        <PageFooter>
          <FooterBrand>
            <HomeLink href={WP_HOME_ROUTE} target="_blank" rel="noreferrer">
              <Logo stacked={false} asLink={false} />
            </HomeLink>
            <FooterCopy>{t('partner_landing.footer.nonprofit')}</FooterCopy>
          </FooterBrand>
          <FooterLinks>
            <Link
              href={getHomeRoute('de', PRIVACY_ROUTE)}
              target="_blank"
              textType={TextTypes.Body6}
            >
              {t('header.privacy')}
            </Link>
            <Link
              href={getHomeRoute('de', 'impressum')}
              target="_blank"
              textType={TextTypes.Body6}
            >
              {t('partner_landing.footer.imprint')}
            </Link>
          </FooterLinks>
        </PageFooter>

        <StickyBar $visible={stickyVisible && !success}>
          <StickyButton
            type="button"
            size={ButtonSizes.Stretch}
            onClick={scrollToFinalCard}
          >
            {t('partner_landing.submit')}
          </StickyButton>
        </StickyBar>
      </Page>
    </CustomThemeProvider>
  );
};

export default PartnerLandingPage;
