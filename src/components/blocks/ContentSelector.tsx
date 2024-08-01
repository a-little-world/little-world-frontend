import {
  Button,
  ButtonAppearance,
  Link,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Selector = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  gap: ${({ theme }) => theme.spacing.xsmall};
  width: 100%;
  background: ${({ theme }) => theme.color.surface.primary};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      display: flex;
    }

    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
      border: 1px solid ${theme.color.border.subtle};
      border-radius: 30px;
      box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
    }
  `}
`;

export const StyledOption = styled(Button)`
  border-color: transparent;

  &:disabled {
    color: ${({ theme }) => theme.color.text.button};
    border: none;
    background: ${({ theme }) => theme.color.gradient.blue10};
  }
`;

const nbtTopics = {
  ourWorld: ['support', 'about', 'stories'],
  main: ['conversation_partners', 'events'],
  help: ['contact', 'faqs'],
  resources: ['trainings', 'beginners'],
};

const externalLinksTopics = {
  about: 'https://home.little-world.com/ueber-uns',
  stories: 'https://home.little-world.com/stories',
};

type ContentSelector = {
  selection: string;
  setSelection: (selection: string) => void;
  use: string;
};

function ContentSelector({ selection, setSelection, use }: ContentSelector) {
  const { t } = useTranslation();
  if (!['ourWorld', 'main', 'help', 'resources'].includes(use)) {
    return null;
  }

  const topics = nbtTopics[use];

  return (
    <Selector>
      {topics.map((topic: string) =>
        externalLinksTopics[topic] ? (
          <Link href={externalLinksTopics[topic]}>{t(`nbt_${topic}`)}</Link>
        ) : (
          <StyledOption
            appearance={
              selection === topic
                ? ButtonAppearance.Primary
                : ButtonAppearance.Secondary
            }
            key={topic}
            onClick={() => setSelection(topic)}
            disabled={selection === topic}
          >
            {t(`nbt_${topic}`)}
          </StyledOption>
        ),
      )}
    </Selector>
  );
}

export default ContentSelector;
