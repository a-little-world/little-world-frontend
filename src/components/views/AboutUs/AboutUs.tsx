import { last } from 'lodash';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  OUR_WORLD_ROUTE, //   getAboutUsRoute,
  getAppRoute,
  getAppSubpageRoute,
} from '../../../routes.ts';
import ContentSelector from '../../blocks/ContentSelector.tsx';
import SupportUs from './SupportUs.tsx';

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

type subpages = 'stories' | 'about' | 'support';

const renderResourceContent = (page: subpages) => {
  if (page === 'support') return <SupportUs />;
  return null;
};

function OurWorld() {
  const location = useLocation();
  const navigate = useNavigate();

  const subpage =
    location.pathname === getAppRoute(OUR_WORLD_ROUTE)
      ? 'support'
      : last(location.pathname.split('/'));

  const handleSubpageSelect = (subpage: subpages) => {
    navigate(getAppSubpageRoute(OUR_WORLD_ROUTE, subpage));
  };

  // useEffect(() => {
  //   selectSubpage(last(location.pathname.split('/')));
  // }, [location]);

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={handleSubpageSelect}
        use={'ourWorld'}
      />
      <Content>{renderResourceContent(subpage)}</Content>
    </>
  );
}

export default OurWorld;
