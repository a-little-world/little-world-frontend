import { last } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  OUR_WORLD_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
} from '../../../router/routes';
import ContentSelector from '../../blocks/ContentSelector';
import Donate from './Donate';
import Materials from './Materials';
import SupportUs from './SupportUs';

const Content = styled.div`
  ${({ theme }) =>
    `
    width: 100%;
    max-width: 1200px;
    padding: ${theme.spacing.xxsmall};

    @media (min-width: ${theme.breakpoints.medium}) {
     padding: 0;
    }`};
`;

type subpages = 'about' | 'support' | 'donate' | 'materials';

const renderResourceContent = (page?: subpages | string) => {
  if (page === 'support') return <SupportUs />;
  if (page === 'donate') return <Donate />;
  if (page === 'materials') return <Materials />;
  return null;
};

function OurWorld() {
  const location = useLocation();
  const navigate = useNavigate();

  const subpage =
    location.pathname === getAppRoute(OUR_WORLD_ROUTE)
      ? 'support'
      : last(location.pathname.split('/'));

  const handleSubpageSelect = (page: subpages) => {
    navigate(getAppSubpageRoute(OUR_WORLD_ROUTE, page));
  };

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={handleSubpageSelect}
        use="ourWorld"
      />
      <Content>{renderResourceContent(subpage)}</Content>
    </>
  );
}

export default OurWorld;
