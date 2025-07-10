import {
  ButtonSizes,
  ButtonVariations,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';

import { getQuestionsEndpoint } from '../../../features/swr/index.ts';
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
  const { data: cards } = useSWR(getQuestionsEndpoint(false));
  const cardsByCategory = cards?.cards;

  const categoriesRef = useRef<HTMLDivElement>(null);

  const selfUserPreferedLang = 'de';
  const [selectedQuestionId, setQuestionId] = useState(null);

  const [selectedTopic, setTopic] = useState(
    cardsByCategory?.[0]?.uuid || null,
  );

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
    if (isEmpty(cardsByCategory)) {
      mutate(getQuestionsEndpoint(false));
    } else {
      setTopic(cardsByCategory?.[0]?.uuid);
    }
  }, [cardsByCategory]);

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
          {cards?.categories?.map(topic => (
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
                        mutate(getQuestionsEndpoint(false));
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
                        mutate(getQuestionsEndpoint(false));
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
