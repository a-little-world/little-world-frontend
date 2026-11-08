import { useEffect, useMemo, useRef, useState } from 'react';

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
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { getPartnerLandingEndpoint } from '../../../api/endpoints';
import {
  fetchPartnerLanding,
  PartnerLanding,
  registerPartner,
} from '../../../api/partnerLanding';
import { LANGUAGES } from '../../../constants/index';
import { formatDate, toTimeZone } from '../../../helpers/date';
import { onFormError } from '../../../helpers/form';
import accentureLogo from '../../../images/partner-landing/accenture.png';
import fazalPhoto from '../../../images/partner-landing/fazal.webp';
import jamalPhoto from '../../../images/partner-landing/jamal.webp';
import joergPhoto from '../../../images/partner-landing/joerg.webp';
import monikaPhoto from '../../../images/partner-landing/monika.webp';
import peterPhoto from '../../../images/partner-landing/peter.webp';
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
import { eventFromLanding } from './constants';
import PartnerConfirmation, {
  PartnerConfirmationIntro,
} from './PartnerConfirmation';
import {
  BenefitCopy,
  BenefitList,
  BenefitRow,
  CardGrid,
  EyebrowPill,
  FaqAccordion,
  FaqAccordionContent,
  FaqInner,
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
  HeroContent,
  HeroLayout,
  HeroLead,
  HeroPills,
  HeroTitle,
  HomeLink,
  IconCircle,
  NavBar,
  Page,
  PageFooter,
  PartnerCoopLabel,
  PartnerLogo,
  PartnerName,
  PartnerPill,
  PersonCopy,
  PersonName,
  PersonRole,
  PersonRow,
  PhotoAvatar,
  QuoteCard,
  QuoteCompanyLogo,
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
  StoryNames,
  StoryQuote,
  StoryQuoteMark,
  StoryReadButton,
  StorySpeaker,
  WhiteLogo,
} from './PartnerLanding.styles';
import PartnerStoryModal, { StoryAvatars } from './PartnerStoryModal';
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
  {
    key: 'peter',
    photo: peterPhoto,
  },
  {
    key: 'sabine',
    logo: accentureLogo,
    logoAlt: 'Accenture',
  },
];
const STEP_KEYS = ['one', 'two', 'three'] as const;
const STORIES = [
  {
    key: 'jamal_monika',
    people: [
      { name: 'Jamal', letter: 'J', tone: 'bold' as const, photo: jamalPhoto },
      {
        name: 'Monika',
        letter: 'M',
        tone: 'highlight' as const,
        photo: monikaPhoto,
      },
    ],
  },
  {
    key: 'fazal_joerg',
    people: [
      {
        name: 'Fazal',
        letter: 'F',
        tone: 'highlight' as const,
        photo: fazalPhoto,
      },
      { name: 'Jörg', letter: 'J', tone: 'bold' as const, photo: joergPhoto },
    ],
  },
];
const FAQ_KEYS = [
  'level',
  'volunteer_level',
  'stay',
  'after_time',
  'privacy',
  'tech',
  'employer',
] as const;

const PartnerHeroChrome = ({ partner }: { partner: PartnerLanding }) => {
  const { t } = useTranslation();

  return (
    <>
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
        {partner.name ? (
          <PartnerPill>
            <PartnerCoopLabel>
              {t('partner_landing.in_partnership_with')}
            </PartnerCoopLabel>
            {partner.logo && <PartnerLogo src={partner.logo} alt="" />}
            <PartnerName>{partner.name}</PartnerName>
          </PartnerPill>
        ) : null}
      </NavBar>
    </>
  );
};

const PartnerLandingPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { partnerSlug } = useParams<{ partnerSlug: string }>();
  const counterpartRef = useRef<HTMLElement>(null);
  const finalBlockRef = useRef<HTMLElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [personalPath, setPersonalPath] = useState<string | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [openStoryKey, setOpenStoryKey] = useState<string | null>(null);

  const { data: landing, error: loadError } = useSWR(
    getPartnerLandingEndpoint(partnerSlug),
    () => fetchPartnerLanding(partnerSlug),
    { revalidateOnFocus: false },
  );
  const partner = landing;
  const event = landing ? eventFromLanding(landing) : null;

  useEffect(() => {
    const counterpart = counterpartRef.current;
    const finalBlock = finalBlockRef.current;
    if (!counterpart || !finalBlock) return undefined;

    const scrollRoot = document.getElementById('router-outlet-wrapper');

    const updateSticky = () => {
      const rootRect = scrollRoot?.getBoundingClientRect();
      const rootTop = rootRect?.top ?? 0;
      const rootBottom = rootRect?.bottom ?? window.innerHeight;
      const sectionTop = counterpart.getBoundingClientRect().top;
      const finalTop = finalBlock.getBoundingClientRect().top;
      const reachedCounterpart = sectionTop < rootBottom;
      const beforeFinal = finalTop > rootTop + (rootBottom - rootTop) * 0.6;
      setStickyVisible(reachedCounterpart && beforeFinal);
    };

    const target = scrollRoot ?? window;
    target.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky);
    updateSticky();
    return () => {
      target.removeEventListener('scroll', updateSticky);
      window.removeEventListener('resize', updateSticky);
    };
  }, [partner]);

  useEffect(() => {
    if (partnerSlug && !partner) return undefined;
    const previousTitle = document.title;
    document.title = partner?.name
      ? `${partner.name} · Little World`
      : t('partner_landing.page_title');
    return () => {
      document.title = previousTitle;
    };
  }, [partner, partnerSlug, t]);

  useEffect(() => {
    if (!success) return undefined;
    const scrollRoot = document.getElementById('router-outlet-wrapper');
    scrollRoot?.scrollTo({ top: 0 });
    return undefined;
  }, [success]);

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
    if (isSubmitting || success) return;
    if (partnerSlug && !partner) return;

    const code = validatePartnerEmail(email, partner?.email_domain ?? null);
    if (code) {
      setError(errorMessage(code));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerPartner(partnerSlug, {
        email: email.trim(),
        newsletter_subscribed: newsletter,
      });
      setPersonalPath(response.personal_path ?? null);
      setSuccess(true);
    } catch (submitError) {
      onFormError({
        e: submitError as { cause: string; message?: string; status?: number },
        formFields: { email },
        setError: (name, fieldError) => {
          if (name === 'email' || name === 'root.serverError') {
            setError(
              t(fieldError.message ?? 'partner_landing.error_invalid', {
                companyName: partner?.name ?? '',
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

  if (!partner || !event) {
    return (
      <StatusWrap>
        <Loading size={LoadingSizes.Medium} />
      </StatusWrap>
    );
  }

  const eventDateShort = formatDate(
    toTimeZone(event.startsAt, event.timeZone),
    'd. MMMM',
    i18n.language,
  );

  const cardProps = {
    event,
    partner,
    email,
    newsletter,
    error,
    isSubmitting,
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
        {success ? (
          <Hero>
            <PartnerHeroChrome partner={partner} />
            <PartnerConfirmationIntro
              event={event}
              hasPersonalLink={Boolean(personalPath)}
            />
            <PartnerConfirmation event={event} personalPath={personalPath} />
          </Hero>
        ) : (
          <>
            <Hero>
              <PartnerHeroChrome partner={partner} />
              <HeroLayout>
                <HeroContent>
                  <HeroPills>
                    <EyebrowPill>{event.campaignLabel}</EyebrowPill>
                  </HeroPills>
                  <HeroTitle>{t('partner_landing.hero_title')}</HeroTitle>
                  <HeroLead>
                    {partner.name
                      ? t('partner_landing.hero_lead', {
                          companyName: partner.name,
                          eventDate: eventDateShort,
                        })
                      : t('partner_landing.hero_lead_generic', {
                          eventDate: eventDateShort,
                        })}
                  </HeroLead>
                  <PartnerSignUpCard
                    {...cardProps}
                    inputId="partner-email-hero"
                  />
                </HeroContent>
              </HeroLayout>
            </Hero>

            <Section ref={counterpartRef} $tone="primary">
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
                        <PersonRow $spread={Boolean(quote.logo)}>
                          {quote.photo ? (
                            <PhotoAvatar
                              src={quote.photo}
                              alt={t(`partner_landing.quote.${quote.key}.name`)}
                            />
                          ) : null}
                          <PersonCopy>
                            <PersonName>
                              {t(`partner_landing.quote.${quote.key}.name`)}
                            </PersonName>
                            <PersonRole>
                              {t(`partner_landing.quote.${quote.key}.role`)}
                            </PersonRole>
                          </PersonCopy>
                          {quote.logo ? (
                            <QuoteCompanyLogo
                              src={quote.logo}
                              alt={quote.logoAlt}
                            />
                          ) : null}
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
                  <SectionTitle>
                    {t('partner_landing.stories.title')}
                  </SectionTitle>
                </SectionIntro>
                <StoriesGrid>
                  {STORIES.map(story => (
                    <StoryCard key={story.key}>
                      <StoryAvatars people={story.people} />
                      <StoryNames>
                        {t(`partner_landing.stories.${story.key}.names`)}
                      </StoryNames>
                      <StoryQuote>
                        <StoryQuoteMark aria-hidden="true">„</StoryQuoteMark>
                        {t(`partner_landing.stories.${story.key}.quote`)}
                        <StoryQuoteMark aria-hidden="true">
                          “
                        </StoryQuoteMark>{' '}
                        <StorySpeaker>
                          ({t(`partner_landing.stories.${story.key}.speaker`)})
                        </StorySpeaker>
                      </StoryQuote>
                      <StoryContext>
                        {t(`partner_landing.stories.${story.key}.context`)}
                      </StoryContext>
                      <StoryReadButton
                        type="button"
                        appearance={ButtonAppearance.Secondary}
                        size={ButtonSizes.Medium}
                        onClick={() => setOpenStoryKey(story.key)}
                      >
                        {t('partner_landing.stories.read')}
                      </StoryReadButton>
                    </StoryCard>
                  ))}
                </StoriesGrid>
              </SectionInner>
            </Section>

            <Section $tone="secondary">
              <FaqInner>
                <SectionTitle>{t('partner_landing.faq.title')}</SectionTitle>
                <FaqAccordion
                  headerType={TextTypes.Heading6}
                  headerColor={theme.color.text.bold}
                  ContentWrapper={FaqAccordionContent}
                  defaultValue={faqItems[0]?.header}
                  items={faqItems}
                />
              </FaqInner>
            </Section>

            <FinalBlock ref={finalBlockRef}>
              <FinalInner>
                <FinalTitle>{t('partner_landing.final_title')}</FinalTitle>
                <FinalLead>
                  {partner.name
                    ? t('partner_landing.final_lead', {
                        companyName: partner.name,
                        eventDate: eventDateShort,
                      })
                    : t('partner_landing.final_lead_generic', {
                        eventDate: eventDateShort,
                      })}
                </FinalLead>
                <div ref={finalCardRef}>
                  <PartnerSignUpCard
                    {...cardProps}
                    inputId="partner-email-final"
                  />
                </div>
              </FinalInner>
            </FinalBlock>
          </>
        )}

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

        {!success && (
          <>
            <PartnerStoryModal
              storyKey={openStoryKey}
              people={
                STORIES.find(story => story.key === openStoryKey)?.people ?? []
              }
              onClose={() => setOpenStoryKey(null)}
            />

            <StickyBar $visible={stickyVisible && !openStoryKey}>
              <StickyButton
                type="button"
                size={ButtonSizes.Stretch}
                onClick={scrollToFinalCard}
              >
                {t('partner_landing.submit')}
              </StickyButton>
            </StickyBar>
          </>
        )}
      </Page>
    </CustomThemeProvider>
  );
};

const PartnerLandingRoute = () => {
  const { i18n } = useTranslation();
  const germanI18n = useMemo(
    () => i18n.cloneInstance({ lng: LANGUAGES.de }),
    [i18n],
  );

  return (
    <I18nextProvider i18n={germanI18n}>
      <PartnerLandingPage />
    </I18nextProvider>
  );
};

export default PartnerLandingRoute;
