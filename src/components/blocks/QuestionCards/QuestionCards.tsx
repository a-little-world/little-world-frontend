import {
  ButtonSizes,
  ButtonVariations,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  FetchQuestionsDataAsync,
  postArchieveQuestion,
} from '../../../features/userData';
import {
  ArchiveButton,
  Categories,
  CategoryControl,
  QuestionButton,
  QuestionCard,
  QuestionCategories,
  QuestionContentCard,
  SidebarCard,
  TopicButton,
} from './QuestionCards.styles.tsx';

function QuestionCards() {
  const dispatch = useDispatch();
  const cardsByCategory = useSelector(
    state => state.userData?.questions?.cards,
  );

  const cardCategories = useSelector(
    state => state.userData?.questions?.categories,
  );

  const categoriesRef = useRef<HTMLDivElement>(null);

  // TODO: locked to only german untill we have a translation button, then use: i18n.language;
  const selfUserPreferedLang = 'de';
  const [selectedQuestionId, setQuestionId] = useState(null);

  const [selectedTopic, setTopic] = useState(cardCategories?.[0]?.uuid || null);

  const changeScroll = (direction: 'left' | 'right') => {
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
          size={ButtonSizes.Medium}
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
              $selected={selectedTopic === topic?.uuid}
              value={topic?.uuid}
              onClick={() => setTopic(topic?.uuid)}
            >
              {topic.content[`${selfUserPreferedLang}`]}
            </TopicButton>
          ))}
        </Categories>
        <CategoryControl
          size={ButtonSizes.Medium}
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
          cardsByCategory[selectedTopic]?.map(card => (
            <QuestionCard
              key={card?.uuid}
              $selected={selectedQuestionId === card?.uuid}
            >
              <QuestionButton
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
          ))}
      </QuestionContentCard>
    </SidebarCard>
  );
}

export default QuestionCards;
