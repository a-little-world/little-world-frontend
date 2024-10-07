import { last } from 'lodash';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  RESOURCES_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
} from '../../../routes.ts';
import ContentSelector from '../../blocks/ContentSelector.tsx';
import Beginners from './Beginners.tsx';
import MyStory from './MyStory.tsx';
import Partners from './Partners.tsx';
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

type subpages = 'trainings' | 'beginners' | 'story' | 'partners';

const renderResourceContent = (page: subpages) => {
  if (page === 'trainings') return <Trainings />;
  if (page === 'beginners') return <Beginners />;
  if (page === 'story') return <MyStory />;
  if (page === 'partners') return <Partners />;
  return null;
};

function Resources() {
  const location = useLocation();
  const navigate = useNavigate();

  const subpage =
    location.pathname === getAppRoute(RESOURCES_ROUTE)
      ? 'trainings'
      : last(location.pathname.split('/'));

  const handleSubpageSelect = (page: subpages) => {
    navigate(getAppSubpageRoute(RESOURCES_ROUTE, page));
  };

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={handleSubpageSelect}
        use="resources"
      />
      <Content>{renderResourceContent(subpage)}</Content>
    </>
  );
}

export default Resources;
