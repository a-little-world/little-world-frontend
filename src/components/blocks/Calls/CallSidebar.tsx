/* eslint-disable jsx-a11y/media-has-caption */
import { ButtonAppearance } from '@a-little-world/little-world-design-system';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../App.css';
import '../../../call.css';
import { Chat } from '../ChatCore/Chat';
import { StyledOption } from '../ContentSelector.tsx';
import QuestionCards from '../QuestionCards/QuestionCards.tsx';
import {
  SidebarContent,
  SidebarSelector,
  SidebarWrapper,
} from './CallSidebar.styles.tsx';
import { SidebarNotes } from './SidebarNotes.tsx';

const SidebarSelectionContext = createContext();

function CallSidebar({ isDisplayed, chatId }) {
  const { t } = useTranslation();
  const sidebarTopics = ['chat', 'questions'];
  const { setSideSelection, sideSelection } = useContext(
    SidebarSelectionContext,
  );

  return (
    <SidebarWrapper $isDisplayed={isDisplayed}>
      <SidebarSelector>
        {sidebarTopics.map(topic => (
          <StyledOption
            appearance={
              sideSelection === topic
                ? ButtonAppearance.Primary
                : ButtonAppearance.Secondary
            }
            key={topic}
            onClick={() => setSideSelection(topic)}
            disabled={sideSelection === topic}
          >
            {t(`vc_btn_${topic}`)}
          </StyledOption>
        ))}
      </SidebarSelector>
      <SidebarContent>
        {sideSelection === 'chat' && <Chat chatId={chatId} />}
        {sideSelection === 'questions' && <QuestionCards />}
        {sideSelection === 'notes' && <SidebarNotes />}
      </SidebarContent>
    </SidebarWrapper>
  );
}

export const SidebarSelectionProvider = ({ children }) => {
  const [sideSelection, setSideSelection] = useState('chat');

  const value = useMemo(
    () => ({ sideSelection, setSideSelection }),
    [sideSelection, setSideSelection],
  );

  return (
    <SidebarSelectionContext.Provider value={value}>
      {children}
    </SidebarSelectionContext.Provider>
  );
};

export default CallSidebar;
