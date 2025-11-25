/* eslint-disable jsx-a11y/media-has-caption */
import { ButtonAppearance } from '@a-little-world/little-world-design-system';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../../App.css';
import '../../../call.css';
import Chat from '../ChatCore/Chat';
import { StyledOption } from '../ContentSelector';
import QuestionCards from '../QuestionCards/QuestionCards';
import {
  SidebarContent,
  SidebarSelector,
  SidebarWrapper,
} from './CallSidebar.styles';
import { SidebarNotes } from './SidebarNotes';

export const SidebarSelectionContext = createContext<{
  sideSelection: string;
  setSideSelection: (selection: string) => void;
} | null>(null);

function CallSidebar({
  isDisplayed,
  chatId,
}: {
  isDisplayed: boolean;
  chatId: string;
}) {
  const { t } = useTranslation();
  const sidebarTopics = ['chat', 'questions'];
  const context = useContext(SidebarSelectionContext);
  if (!context) {
    throw new Error('CallSidebar must be used within SidebarSelectionProvider');
  }
  const { setSideSelection, sideSelection } = context;

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
        {sideSelection === 'chat' && <Chat chatId={chatId} inCall />}
        {sideSelection === 'questions' && <QuestionCards />}
        {sideSelection === 'notes' && <SidebarNotes />}
      </SidebarContent>
    </SidebarWrapper>
  );
}

export const SidebarSelectionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value?: {
    sideSelection: string;
    setSideSelection: (selection: string) => void;
  };
}) => {
  const [internalSideSelection, setInternalSideSelection] = useState('chat');

  const contextValue = useMemo(
    () =>
      value || {
        sideSelection: internalSideSelection,
        setSideSelection: setInternalSideSelection,
      },
    [value, internalSideSelection],
  );

  return (
    <SidebarSelectionContext.Provider value={contextValue}>
      {children}
    </SidebarSelectionContext.Provider>
  );
};

export default CallSidebar;
