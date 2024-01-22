import React from "react";
import { Button, ButtonAppearance } from '@a-little-world/little-world-design-system'
import { useTranslation } from "react-i18next";
import styled, { css, useTheme } from "styled-components";

const Selector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  gap: ${({ theme }) => theme.spacing.xsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      justify-content: flex-start;
      display: flex;
    }
  `}
`;

const StyledOption = styled(Button)`
  border-color: transparent;
  &:disabled {
    color: ${({ theme }) =>
      theme.color.text.button
    };
    border: none;
    background: ${({ theme }) =>
      theme.color.gradient.blue10
    };
  }
`

function NbtSelector({ selection, setSelection, use }) {
  const { t } = useTranslation();
  const theme = useTheme();
  if (!["main", "help"].includes(use)) {
    return null;
  }

  const nbtTopics = {
    main: ["conversation_partners", "community_calls"],
    help: ["faqs", "contact"],
  };
  const topics = nbtTopics[use];

  return (
    <Selector className="selector">
      {topics.map((topic) => (
        <StyledOption appearance={selection === topic ? ButtonAppearance.Primary : ButtonAppearance.Secondary} key={topic} onClick={() => setSelection(topic)} disabled={selection === topic}>
          {t(`nbt_${topic}`)}
        </StyledOption>
      ))}
    </Selector>
  );
}

export default NbtSelector;
