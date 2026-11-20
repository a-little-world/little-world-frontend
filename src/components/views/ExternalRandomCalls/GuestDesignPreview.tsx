import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  getAdventGuestAfterCallRoute,
  getAdventGuestStayRoute,
  getAppRandomCallAfterRoute,
} from '../../../router/routes';
import { Column, Page, Title } from '../RandomCalls/AfterRandomCall.styles';
import { DESIGN_PREVIEW_LOBBY } from './guestSession';

const Heading = styled(Title)`
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
`;

const Item = styled.a`
  color: ${({ theme }) => theme.color.text.heading};
  font-size: 1.125rem;
`;

const links = [
  {
    href: getAdventGuestAfterCallRoute(DESIGN_PREVIEW_LOBBY),
    label: 'Danach — window open',
  },
  {
    href: `${getAdventGuestAfterCallRoute(DESIGN_PREVIEW_LOBBY)}?window=closed`,
    label: 'Danach — window closed',
  },
  {
    href: getAppRandomCallAfterRoute(DESIGN_PREVIEW_LOBBY),
    label: 'Post-call',
  },
  {
    href: getAdventGuestStayRoute(DESIGN_PREVIEW_LOBBY),
    label: 'Session ended — one call',
  },
  {
    href: `${getAdventGuestStayRoute(DESIGN_PREVIEW_LOBBY)}?calls=3`,
    label: 'Session ended — several calls',
  },
  {
    href: `${getAdventGuestStayRoute(DESIGN_PREVIEW_LOBBY)}?calls=0`,
    label: 'Session ended — no calls',
  },
];

export const SessionEndedRedirect = () => {
  const { lobbyId = '' } = useParams();
  return <Navigate to={getAdventGuestStayRoute(lobbyId)} replace />;
};

const GuestDesignPreview = () => (
  <Page>
    <Column>
      <Heading>Page designs</Heading>
      <List>
        {links.map(link => (
          <li key={link.href}>
            <Item href={link.href}>{link.label}</Item>
          </li>
        ))}
      </List>
    </Column>
  </Page>
);

export default GuestDesignPreview;
