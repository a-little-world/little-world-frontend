import {
  Button,
  ButtonVariations,
  Card,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { FetchQuestionsDataAsync } from '../../features/userData';
import { postArchieveQuestion } from '../../features/userData';

const SidebarCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: ${({ theme }) => theme.spacing.xxsmall};
`;

const TopicButton = styled.button`
  font-size: 1rem;
  font-weight: normal;
  min-width: fit-content;
  padding: ${({ theme }) => theme.spacing.xsmall};
  border-radius: 23px;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  white-space: nowrap;
  border: 2px solid #ef8a21;
  margin: 0px ${({ theme }) => theme.spacing.xxxsmall};
  box-sizing: border-box;
  ${props =>
    props.selected &&
    `
    background: linear-gradient(43.07deg, #db590b -3.02%, #f39325 93.96%);
    color: white;
  `}
`;

const QuestionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-sizing: border-box;
  border-radius: 18px;
  margin-top: ${({ theme }) => theme.spacing.xsmall};
  background: ${({ theme }) => theme.color.surface.primary};
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ selected, theme }) =>
    selected &&
    `
    border-color: ${theme.color.border.selected};
  `}
`;

const QuestionContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: transparent;
  border: none;
  box-shadow: none;
  @media (min-width: 500px) {
    padding: 0px;
  }
`;

const QuestionButton = styled(Button)`
  padding: 0px;
  background: transparent;
  color: black;
  padding: ${({ theme }) => theme.spacing.xsmall};
  height: fit-content;
  font-size: 16px;
  font-weight: normal;
`;

const ArchiveButton = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxxsmall};
  padding: 0px ${({ theme }) => theme.spacing.xsmall};
`;

const Categories = styled.div`
  display: flex;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.xxxsmall};

  ${({ selected, theme }) =>
    selected &&
    ` border-color: ${theme.color.border.selected};
      padding: 15px;
    `}
`;

const QuestionCategories = styled.div`
  display: flex;
  align-items: center;
`;

const CategoryControl = styled(Button)`
  flex-shrink: 0;
`;

function QuestionCards() {
  const dispatch = useDispatch();
  const cardsByCategory = useSelector(
    state => state.userData?.questions?.cards,
  );

  const cardCategories = useSelector(
    state => state.userData?.questions?.categories,
  );

  const categoriesRef = useRef(null);

  // TODO: locked to only german untill we have a translation button, then use: i18n.language;
  const selfUserPreferedLang = 'de';
  const [selectedQuestionId, setQuestionId] = useState(null);

  const [selectedTopic, setTopic] = useState(cardCategories?.[0]?.uuid || null);
  console.log({ selectedTopic, cardCategories });
  const changeScroll = direction => {
    const scrollVelocity = {
      right: 100,
      left: -100,
    };
    if (categoriesRef.current) {
      categoriesRef.current.scrollLeft += scrollVelocity[direction];
    }
  };

  useEffect(() => {
    if (isEmpty(cardCategories)) {
      dispatch(FetchQuestionsDataAsync());
    } else {
      setTopic(cardCategories?.[0]?.uuid);
    }
  }, [cardCategories]);

  return (
    <SidebarCard>
      <QuestionCategories>
        <CategoryControl
          variation={ButtonVariations.Circle}
          onClick={() => changeScroll('left')}
        >
          <ChevronLeftIcon
            label="prev conversation topics"
            labelId="topics left control"
            width={6}
            height={10}
          />
        </CategoryControl>
        <Categories ref={categoriesRef}>
          {cardCategories?.map(topic => (
            <TopicButton
              key={topic?.uuid}
              type="button"
              selected={selectedTopic === topic?.uuid}
              value={topic?.uuid}
              onClick={() => setTopic(topic?.uuid)}
            >
              {topic.content[`${selfUserPreferedLang}`]}
            </TopicButton>
          ))}
        </Categories>
        <CategoryControl
          variation={ButtonVariations.Circle}
          onClick={() => changeScroll('right')}
        >
          <ChevronRightIcon
            label="next topics"
            labelId="topics right control"
            width={6}
            height={10}
          />
        </CategoryControl>
      </QuestionCategories>
      <QuestionContentCard>
        {cardsByCategory?.[selectedTopic]?.length > 0 &&
          cardsByCategory[selectedTopic]?.map(card => {
            return (
              <QuestionCard
                key={card?.uuid}
                selected={selectedQuestionId === card?.uuid}
              >
                <QuestionButton
                  type="button"
                  selected={selectedQuestionId === card?.uuid}
                  onClick={() => {
                    setQuestionId(card?.uuid);
                  }}
                >
                  {card?.content[selfUserPreferedLang]}
                </QuestionButton>
                {selectedQuestionId === card?.uuid &&
                  selectedTopic !== 'archived' && (
                    <ArchiveButton>
                      <button
                        type="button"
                        className="yes"
                        onClick={() => {
                          dispatch(postArchieveQuestion(card, true));
                        }}
                      >
                        <img
                          className="accept-question-icon"
                          alt="accept question"
                        />
                      </button>
                    </ArchiveButton>
                  )}
                {selectedQuestionId === card?.uuid &&
                  selectedTopic === 'archived' && (
                    <ArchiveButton>
                      <button
                        type="button"
                        className="unarchive"
                        onClick={() => {
                          dispatch(postArchieveQuestion(card, false));
                        }}
                      >
                        <img
                          className="unarchive-question-icon"
                          alt="accept question"
                        />
                      </button>
                    </ArchiveButton>
                  )}
              </QuestionCard>
            );
          })}
      </QuestionContentCard>
    </SidebarCard>
  );
}

export default QuestionCards;
