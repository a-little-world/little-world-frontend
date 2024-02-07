import {
  Button,
  ButtonVariations,
  Card,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { questionsDuringCall } from '../../services/questionsDuringCall';

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
  const { t } = useTranslation();
  const questionDataFromApi = useSelector(
    state => state.userData?.questions?.data,
  );
  const questionTitleDataFromApi = useSelector(
    state => state.userData?.questions?.category,
  );
  const archivedQuestionsFromApi = useSelector(
    state => state.userData?.archivedQuestions,
  );

  const selfUserPreferedLang = localStorage.i18nextLng;
  const [selectedQuestionId, setQuestionId] = useState(null);

  const topicList = questionTitleDataFromApi?.map(
    item => item[selfUserPreferedLang],
  );
  const [selectedTopic, setTopic] = useState(topicList ? topicList[0] : null);

  const [archived, setArchived] = useState(
    archivedQuestionsFromApi ? archivedQuestionsFromApi : [],
  );
  const [unarchived, setUnarchived] = useState(questionDataFromApi);

  useEffect(() => {
    // condition for selecting the top item of the category
    if (selectedTopic === 'Archived') {
      if (archived.length !== 0) setQuestionId(archived[0]?.id);
    } else {
      const matchingQuestion = unarchived?.find(
        item => item?.category_name[selfUserPreferedLang] === selectedTopic,
      );
      if (matchingQuestion?.id) {
        setQuestionId(matchingQuestion?.id);
      }
    }
  }, [selectedTopic, unarchived, archived]);

  // function to archive the card and store the card in Archived list
  const archiveQuestion = async id => {
    const response = await questionsDuringCall.archiveQuestion(id);
    if (response === 'error') {
      console.log('Internal Server Error');
    } else {
      const questionToArchive = unarchived.find(question => question.id === id);
      if (questionToArchive) {
        setUnarchived(unarchived.filter(question => question.id !== id));
        setArchived([...archived, questionToArchive]);
      }
    }
  };

  // function to un-archive the card and store the card back to unarchived list
  const unArchiveQuestion = async id => {
    const response = await questionsDuringCall.unArchiveQuestion(id);

    if (response === 'error') {
      console.log('Internal Server Error');
    } else {
      const questionToUnarchive = archived.find(question => question.id === id);
      if (questionToUnarchive) {
        setArchived(prevArchived =>
          prevArchived.filter(question => question.id !== id),
        );
        setUnarchived(prevData => [...prevData, questionToUnarchive]);
      }
    }
  };
  const categoriesRef = useRef(null);

  const changeScroll = direction => {
    const scrollVelocity = {
      right: 100,
      left: -100,
    };
    if (categoriesRef.current) {
      categoriesRef.current.scrollLeft += scrollVelocity[direction];
    }
  };

  return (
    <SidebarCard>
      <QuestionCategories>
        <CategoryControl
          variation={ButtonVariations.Control}
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
          {topicList?.map(topic => (
            <TopicButton
              key={topic}
              type="button"
              selected={selectedTopic === topic}
              value={topic}
              onClick={() => setTopic(topic)}
            >
              {topic}
            </TopicButton>
          ))}

          <TopicButton
            key="Archived"
            type="button"
            selected={selectedTopic === 'Archived'}
            value="Archived"
            onClick={() => {
              setTopic('Archived');
            }}
          >
            {t('question_category_archived')}
          </TopicButton>
        </Categories>
        <CategoryControl
          variation={ButtonVariations.Control}
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
        {unarchived
          ?.filter(
            question =>
              question.category_name[selfUserPreferedLang] === selectedTopic,
          )
          ?.map(({ id, content }) => (
            <QuestionCard key={id} selected={selectedQuestionId === id}>
              <QuestionButton
                type="button"
                selected={selectedQuestionId === id}
                onClick={() => setQuestionId(id)}
              >
                {content[selfUserPreferedLang]}
              </QuestionButton>
              {selectedQuestionId === id && (
                <ArchiveButton>
                  <button
                    type="button"
                    className="yes"
                    onClick={() => archiveQuestion(id)}
                  >
                    <img
                      className="accept-question-icon"
                      alt="accept question"
                    />
                  </button>
                </ArchiveButton>
              )}
            </QuestionCard>
          ))}

        {selectedTopic == 'Archived' &&
          archived?.map(({ id, content }) => {
            return (
              <QuestionCard key={id} selected={selectedQuestionId === id}>
                <QuestionButton
                  type="button"
                  selected={selectedQuestionId === id}
                  onClick={() => setQuestionId(id)}
                >
                  {content[selfUserPreferedLang]}
                </QuestionButton>

                {selectedQuestionId === id && (
                  <ArchiveButton>
                    <button
                      type="button"
                      className="unarchive"
                      onClick={() => unArchiveQuestion(id)}
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
