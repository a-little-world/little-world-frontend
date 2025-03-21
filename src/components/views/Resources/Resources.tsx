import { last } from 'lodash';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  RESOURCES_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
} from '../../../routes.ts';
import ContentSelector from '../../blocks/ContentSelector.tsx';
import Training from '../../blocks/Training/Training.tsx';
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

type subpages = 'trainings' | 'training' | 'beginners' | 'story' | 'partners';

const ROOT_PATH = 'trainings';

const renderResourceContent = (page?: subpages) => {
  if (page === 'training') return <Training />;
  if (page === 'trainings') return <Trainings />;
  if (page === 'beginners') return <Beginners />;
  if (page === 'story') return <MyStory />;
  if (page === 'partners') return <Partners />;
  return null;
};

function Resources() {
  const { trainingSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const subpage = trainingSlug
    ? 'training'
    : location.pathname === getAppRoute(RESOURCES_ROUTE)
    ? ROOT_PATH
    : last(location.pathname.split('/').filter(Boolean)); // filter out empty strings if trailing slash

  const handleSubpageSelect = (page: subpages) => {
    navigate(getAppSubpageRoute(RESOURCES_ROUTE, page));
  };

  return (
    <>
      <ContentSelector
        selection={subpage === 'training' ? ROOT_PATH : subpage}
        setSelection={handleSubpageSelect}
        use="resources"
      />
      <Content>{renderResourceContent(subpage)}</Content>
    </>
  );
}

export default Resources;
