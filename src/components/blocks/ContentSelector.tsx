import {
  Button,
  ButtonAppearance,
  ButtonVariations,
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
  overflow-x: scroll;
  text-wrap: nowrap;

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
  transition: none;

  ${({ theme, variation }) =>
    variation === ButtonVariations.Inline &&
    css`
      margin: 0 ${theme.spacing.small};
      color: ${theme.color.text.link};
    `};

  &:disabled {
    color: ${({ theme }) => theme.color.text.button};
    border: none;
    background: ${({ theme }) => theme.color.gradient.blue10};
  }
`;

export const StyledLink = styled(Link)`
  margin: 0 ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxxxsmall} 0;
`;

const nbtTopics = {
  ourWorld: ['support', 'donate', 'about', 'stories'],
  main: ['conversation_partners', 'events'],
  help: ['contact', 'faqs'],
  resources: ['trainings', 'beginners', 'story', 'partners'],
};

const externalLinksTopics = {
  about: 'https://home.little-world.com/ueber-uns',
  stories: 'https://home.little-world.com/stories',
};

type ContentSelectorProps = {
  selection?: string;
  setSelection: (selection: string) => void;
  use: string;
};

function ContentSelector({
  selection,
  setSelection,
  use,
}: ContentSelectorProps) {
  const { t } = useTranslation();
  if (!['ourWorld', 'main', 'help', 'resources'].includes(use)) {
    return null;
  }

  const topics = nbtTopics[use];

  return (
    <Selector>
      {topics.map((topic: string) =>
        externalLinksTopics[topic] ? (
          <StyledLink key={topic} href={externalLinksTopics[topic]}>
            {t(`nbt_${topic}`)}
          </StyledLink>
        ) : (
          <StyledOption
            variation={
              selection === topic
                ? ButtonVariations.Basic
                : ButtonVariations.Inline
            }
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
