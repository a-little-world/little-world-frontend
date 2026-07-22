import {
  Gradients,
  MailIcon,
} from '@a-little-world/little-world-design-system';
import { last } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { SWRConfig } from 'swr';

import { swrConfig } from '../../features/swr/index';
import useSupportChat, { type SupportMatch } from '../../hooks/useSupportChat';
import {
  HELP_CONTACT_ROUTE,
  HELP_FAQS_ROUTE,
  getAppRoute,
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

type HelpSubpage = 'contact' | 'faqs';

const HELP_SUBPAGE_ROUTES: Record<HelpSubpage, string> = {
  contact: HELP_CONTACT_ROUTE,
  faqs: HELP_FAQS_ROUTE,
};

interface SupportMatchProps {
  supportMatch?: SupportMatch;
  isLoading?: boolean;
}

export function Contact({ supportMatch, isLoading }: SupportMatchProps) {
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
  const {
    supportMatch,
    supportUrl,
    isLoading: isMatchesLoading,
  } = useSupportChat({
    revalidateOnMount: true,
  });

  const subpage = useMemo<HelpSubpage>(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = last(pathSegments);

    if (lastSegment === 'faqs' || lastSegment === 'contact') {
      return lastSegment;
    }

    return 'contact';
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

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={handleSubpageSelect}
        use="help"
      />

      {subpage === 'faqs' && <FAQs supportUrl={supportUrl ?? ''} />}
      {subpage === 'contact' && (
        <Contact supportMatch={supportMatch} isLoading={isMatchesLoading} />
      )}
    </>
  );
}

export default Help;
