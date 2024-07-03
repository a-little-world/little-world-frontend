import { last } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  RESOURCES_ROUTE,
  getAppRoute,
  getResourcesRoute,
} from '../../../routes.ts';
import ContentSelector from '../../blocks/ContentSelector.tsx';
import Beginners from './Beginners.tsx';
import Trainings from './Trainings.tsx';

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

const resourcesPages = {
  trainings: Trainings,
  beginners: Beginners,
};

type subpages = 'trainings' | 'beginners';

const renderResourceContent = (page: subpages) => {
  if (page === 'trainings') return <Trainings />;
  if (page === 'beginners') return <Beginners />;
  return null;
};

function Resources() {
  const location = useLocation();
  const navigate = useNavigate();

  const subpage =
    location.pathname === getAppRoute(RESOURCES_ROUTE)
      ? 'trainings'
      : last(location.pathname.split('/'));

  const handleSubpageSelect = (subpage: subpages) => {
    navigate(getResourcesRoute(subpage));
  };

  // useEffect(() => {
  //   selectSubpage(last(location.pathname.split('/')));
  // }, [location]);

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={handleSubpageSelect}
        use={'resources'}
      />
      <Content>{renderResourceContent(subpage)}</Content>
    </>
  );
}

export default Resources;
