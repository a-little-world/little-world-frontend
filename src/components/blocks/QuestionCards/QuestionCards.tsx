import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DownloadIcon,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';

import { archieveQuestion } from '../../../api/questions.ts';
import { getQuestionsEndpoint } from '../../../features/swr/index.ts';
import {
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
    cards?.categories?.[0]?.uuid || null,
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
    if (isEmpty(cards)) {
      mutate(getQuestionsEndpoint(false));
    } else {
      setTopic(cards?.categories?.[0]?.uuid);
    }
  }, [cards]);

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
            width={6}
            height={10}
          />
        </CategoryControl>
        <Categories ref={categoriesRef}>
          {cards?.categories?.map(topic => (
            <TopicButton
              key={topic?.uuid}
              type="button"
              appearance={
                selectedTopic === topic?.uuid
                  ? ButtonAppearance.Primary
                  : ButtonAppearance.Secondary
              }
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
          <ChevronRightIcon label="next topics" width={6} height={10} />
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
              selectedTopic === 'archived' ? (
                <Button
                  variation={ButtonVariations.Icon}
                  onClick={() => {
                    archieveQuestion({
                      uuid: card.uuid,
                      archive: false,
                      onSuccess: () => mutate(getQuestionsEndpoint(false)),
                      onError: () => null,
                    });
                  }}
                >
                  <CloseIcon
                    label="unarchive question"
                    width={16}
                    height={16}
                  />
                </Button>
              ) : (
                <Button
                  variation={ButtonVariations.Icon}
                  onClick={() => {
                    archieveQuestion({
                      uuid: card.uuid,
                      archive: true,
                      onSuccess: () => mutate(getQuestionsEndpoint(false)),
                      onError: () => null,
                    });
                  }}
                >
                  <DownloadIcon
                    label="archive question"
                    width={16}
                    height={16}
                  />
                </Button>
              )}
            </QuestionCard>
          ))}
      </QuestionContentCard>
    </SidebarCard>
  );
}

export default QuestionCards;
