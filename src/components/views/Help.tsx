import {
  Gradients,
  MailIcon,
} from '@a-little-world/little-world-design-system';
import { last } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR, { SWRConfig } from 'swr';

import { MATCHES_ENDPOINT, swrConfig } from '../../features/swr/index';
import {
  HELP_CONTACT_ROUTE,
  HELP_FAQS_ROUTE,
  MESSAGES_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
} from '../../router/routes';
import Logo from '../atoms/Logo';
import Socials from '../atoms/Socials';
import ChatWithUserInfo from '../blocks/ChatCore/ChatWithUserInfo';
import ContentSelector from '../blocks/ContentSelector';
import FAQs from '../blocks/FAQs/FAQs';
import {
  BusinessName,
  ContactInfo,
  ContactLink,
  ContactUsContainer,
  Contacts,
  ContentWrapper,
  SupportCard,
  SupportChatWrapper,
  SupportTeam,
  Topper,
} from './Help.styles';

export const NativeWebWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => <SWRConfig value={swrConfig}>{children}</SWRConfig>;

type HelpSubpage = 'contact-us' | 'faqs';

const HELP_SUBPAGE_ROUTES: Record<HelpSubpage, string> = {
  'contact-us': HELP_CONTACT_ROUTE,
  faqs: HELP_FAQS_ROUTE,
};

interface SupportMatch {
  chatId?: string;
  partner?: {
    id: string;
    first_name: string;
    image: string;
    image_type: string;
    avatar_config: object;
  };
}

export function Contact({
  supportMatch,
  isLoading,
}: {
  supportMatch?: SupportMatch;
  isLoading?: boolean;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContactUsContainer>
      <SupportChatWrapper>
        <ChatWithUserInfo
          isLoading={isLoading}
          isSupportChat
          chatId={supportMatch?.chatId}
          partner={supportMatch?.partner}
        />
      </SupportChatWrapper>
      <SupportCard>
        <Topper>
          <Logo />
          <SupportTeam>
            <h2>{t('help.support_header')}</h2>
            <div>{t('help.support_slogan')}</div>
          </SupportTeam>
        </Topper>
        <ContactInfo>
          <ContentWrapper>
            <BusinessName center bold>
              A Little World gUG
            </BusinessName>
          </ContentWrapper>
          <Contacts>
            <ContactLink href="mailto:support@little-world.com">
              <MailIcon
                circular
                label="e-mail"
                backgroundColor={theme.color.surface.quaternary}
                borderColor={theme.color.border.subtle}
                color={theme.color.text.reversed}
                width={12}
                height={12}
              />
              support@little-world.com
            </ContactLink>
          </Contacts>
          <Socials type="social_media" gradient={Gradients.Blue} />
        </ContactInfo>
      </SupportCard>
    </ContactUsContainer>
  );
}

function Help() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: matches, isLoading: isMatchesLoading } = useSWR(
    MATCHES_ENDPOINT,
    {
      revalidateOnMount: true,
    },
  );

  const subpage = useMemo<HelpSubpage>(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = last(pathSegments);

    if (lastSegment === 'faqs' || lastSegment === 'contact-us') {
      return lastSegment;
    }

    return 'contact-us';
  }, [location.pathname]);

  const handleSubpageSelect = useCallback(
    (page: string) => {
      const route = HELP_SUBPAGE_ROUTES[page as HelpSubpage];

      if (route) {
        navigate(getAppRoute(route));
      }
    },
    [navigate],
  );

  const supportUser = matches?.support?.results?.[0];
  const supportChatId = supportUser?.chatId;
  const supportUrl = getAppSubpageRoute(MESSAGES_ROUTE, supportChatId ?? '');

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={handleSubpageSelect}
        use="help"
      />

      {subpage === 'faqs' && <FAQs supportUrl={supportUrl} />}
      {subpage === 'contact-us' && (
        <Contact supportMatch={supportUser} isLoading={isMatchesLoading} />
      )}
    </>
  );
}

export default Help;
