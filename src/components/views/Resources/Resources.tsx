import { last } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import styled from 'styled-components';

import {
  RESOURCES_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
} from '../../../router/routes.ts';
import ContentSelector from '../../blocks/ContentSelector.tsx';
import Beginners from './Beginners.tsx';
import German from './German.tsx';
import MyStory from './MyStory.tsx';
import Partner from './Partners/Partner.tsx';
import Partners from './Partners/Partners.tsx';
import Training from './Trainings/Training.tsx';
import Trainings from './Trainings/Trainings.tsx';

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

type Subpages =
  | 'trainings'
  | 'training'
  | 'beginners'
  | 'story'
  | 'partners'
  | 'partner'
  | 'german';

const ROOT_PATH = 'trainings';

const renderResourceContent = (page?: Subpages) => {
  if (page === 'training') return <Training />;
  if (page === 'trainings') return <Trainings />;
  if (page === 'german') return <German />;
  if (page === 'beginners') return <Beginners />;
  if (page === 'story') return <MyStory />;
  if (page === 'partners') return <Partners />;
  if (page === 'partner') return <Partner />;
  return null;
};

function Resources() {
  const { trainingSlug, partnerSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const subpage = useMemo(() => {
    if (trainingSlug) return 'training';
    if (partnerSlug) return 'partner';
    if (location.pathname === getAppRoute(RESOURCES_ROUTE)) return ROOT_PATH;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    return last(pathSegments) || ROOT_PATH;
  }, [location.pathname, trainingSlug, partnerSlug]);

  const handleSubpageSelect = useCallback(
    (page: Subpages) => {
      navigate(getAppSubpageRoute(RESOURCES_ROUTE, page));
    },
    [navigate],
  );

  const selectorSelection = useMemo(() => {
    if (subpage === 'training') return ROOT_PATH;
    if (subpage === 'partner') return 'partners';
    return subpage;
  }, [subpage]);

  return (
    <>
      <ContentSelector
        disableIfSelected={selectorSelection === subpage}
        selection={selectorSelection}
        setSelection={handleSubpageSelect}
        use="resources"
      />
      <Content>{renderResourceContent(subpage)}</Content>
    </>
  );
}

export default Resources;
