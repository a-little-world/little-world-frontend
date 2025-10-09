import { last } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  RESOURCES_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
} from '../../../router/routes';
import ContentSelector from '../../blocks/ContentSelector';
import Beginners from './Beginners';
import German from './German';
import MyStory from './MyStory';
import Partner from './Partners/Partner';
import Partners from './Partners/Partners';
import Training from './Trainings/Training';
import Trainings from './Trainings/Trainings';

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
