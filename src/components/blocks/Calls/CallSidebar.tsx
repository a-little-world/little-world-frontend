/* eslint-disable jsx-a11y/media-has-caption */
import { ButtonAppearance } from '@a-little-world/little-world-design-system';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import '../../../App.css';
import '../../../call.css';
import { getMatchByPartnerId } from '../../../features/userData';
import {
  addUserNote,
  deleteUserNote,
  getUserNotes,
  noteStatusUpdate,
} from '../../../services/userNotes';
import { Chat } from '../ChatCore/Chat';
import { StyledOption } from '../NbtSelector';
import QuestionCards from '../QuestionCards';
import TranslationTool from '../TranslationTool/TranslationTool.tsx';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  position: relative;
  background: #f9f9f9;
  border-radius: 20px;
  padding: 10px;
  color: #a6a6a6;
  box-sizing: content-box;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Buttons = styled.button``;

const AddNoteButton = styled.button`
  background: linear-gradient(
    43.07deg,
    #db590b -3.02%,
    #f39325 93.96%
  ) !important;
  border-radius: 100px;
  padding: 8px 6px;
  font-size: 14px;
  min-width: 66px;
  color: #f9f9f9;
  font-weight: 600;
  display: ${props => (props.show ? 'block' : 'none')};
`;

const WrapperContainer = styled.div`
  width: 100%;
`;

const UpdatedAtLabel = styled.div`
  font-size: ${({ theme }) => `${theme.spacing.xsmall}`};
  color: #626262;
  padding-bottom: ${({ theme }) => `${theme.spacing.xxxsmall}`};
  padding-right: ${({ theme }) => `${theme.spacing.xsmall}`};
  align-self: end;
`;

const QuestionActions = styled.div`
  height: ${({ theme }) => `${theme.spacing.medium}`};
  margin-top: ${({ theme }) => `${theme.spacing.xxxsmall}`};
  display: flex;
  gap: ${({ theme }) => `${theme.spacing.xxxsmall}`};
`;

const QuestionActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const CategoryButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xxsmall}`};
  border-radius: ${({ theme }) => `${theme.spacing.medium}`};
  font-style: normal;
  font-weight: 500;
  font-size: ${({ theme }) => `${theme.spacing.small}`};
  white-space: nowrap;
  border: 2px solid #ef8a21;
  margin: 0 4px;
  box-sizing: border-box;
  display: flex;
  ${({ selected }) =>
    selected &&
    `
      background: linear-gradient(43.07deg, #db590b -3.02%, #f39325 93.96%);
      color: white;
      `};
`;

const StyledImage = styled.img`
  height: 20px;
  width: 20px;
  ${({ selected }) => selected && ` filter: brightness(0) invert(1); `}
`;

const EditButton = styled.button`
  background: linear-gradient(
    43.07deg,
    #db590b -3.02%,
    #f39325 93.96%
  ) !important;
  border-radius: 100px;
  font-size: 14px;
  min-width: ${({ theme }) => `${theme.spacing.xxlarge}`};
  color: #f9f9f9;
  font-weight: 600;
  height: ${({ theme }) => `${theme.spacing.medium}`};
`;

const NoteCardTextArea = styled.textarea`
  border: none;
  background: #f9fafb;
  outline: none;

  &:focus {
    outline: none;
    border: none;
  }

  &:focus:not(:focus-visible) {
    outline: none;
    border: none;
  }
`;

const NotesCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const NotesCard = styled.div`
  border: 1px solid rgb(0 0 0 / 5%);
  box-sizing: border-box;
  border-radius: ${({ theme }) => `${theme.spacing.small}`};
  margin-top: ${({ theme }) => `${theme.spacing.xsmall}`};
  background: #f9fafb;
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${props =>
    props.selected &&
    `
      border-color: red;
    `}
`;

const CardButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.small}`};
  font-size: unset;
  width: 100%;
  border-radius: inherit;
  text-align: left;
  ${({ selected }) => selected && `  padding: 0; `}
`;

const CategoryWrapper = styled.div`
  display: flex;
  overflow-x: hidden;
  padding: 2px;
  margin-bottom: ${({ theme }) => `${theme.spacing.xxsmall}`};
`;

const SidebarSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => `${theme.spacing.xxxsmall}`};
`;

const SidebarSelectionContext = createContext();

function SidebarNotes() {
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedTopic, setTopic] = useState('All');
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);

  const { t } = useTranslation();

  const [note, setNote] = useState('');
  const [textareaContent, setTextareaContent] = useState('');
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [initialDataFetch, setInitialDataFetch] = useState(true);
  const selfUserPreferedLang = useSelector(
    state => state.userData.user.profile.display_language,
  );

  if (initialDataFetch) {
    getUserNotes()
      .then(response => {
        if (response.error) setInitialData(null);
        else setInitialData(response);
      })
      .catch(error => {
        console.log('error occured while fetching notes');
      });
    setInitialDataFetch(false);
  }

  useEffect(() => {
    let filteredData = [];
    if (selectedTopic === 'All') {
      filteredData = initialData?.filter(
        note => !note.is_archived && !note.is_deleted,
      );
    } else if (selectedTopic === 'is_favorite') {
      filteredData = initialData?.filter(
        note => !note.is_deleted && !note.is_archived && note.is_favorite,
      );
    } else {
      filteredData = initialData?.filter(note => note[selectedTopic]);
    }
    const sortedData = filteredData?.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    );
    setData(sortedData);
  }, [selectedTopic, initialData]);

  const handleAddNote = async () => {
    const [sourcelang, targetLang] =
      selfUserPreferedLang === 'de' ? ['de', 'en'] : ['en', 'de'];
    const response = await addUserNote(note, sourcelang, targetLang);
    setNote('');
    getUserNotes()
      .then(response => {
        if (response.error) setInitialData(null);
        else setInitialData(response);
      })
      .catch(error => {
        debugger;
      });
    setInitialDataFetch(false);
  };

  const handleNoteChange = event => {
    setNote(event.target.value);
  };

  const handleButtonClick = (id, content) => {
    setSelectedQuestionId(id);
    setTextareaContent(content);
    setIsContentChanged(false);
  };

  const handleTextareaChange = e => {
    setTextareaContent(e.target.value);
    setIsContentChanged(true);
  };

  const handleNoteEdit = async id => {
    const content = textareaContent;
    const [sourcelang, targetLang] =
      selfUserPreferedLang === 'de' ? ['de', 'en'] : ['en', 'de'];
    const FavoritedResponse = await noteStatusUpdate({
      note_id: id,
      note_text: content,
      source_language: sourcelang,
      target_language: targetLang,
    });
    if (FavoritedResponse.status === 200) {
      const noteIndex = initialData.findIndex(note => note.id === id);

      if (noteIndex !== -1) {
        const updatedNotesData = [...initialData];

        updatedNotesData[noteIndex] = {
          ...updatedNotesData[noteIndex],
          note: { en: content, de: content },
          updated_at: new Date().toISOString(),
        };
        setInitialData(updatedNotesData);
        setNote('');
        setIsContentChanged(false);
      }
    }
  };

  const renderButton = (topic, label, imageClass) => (
    <CategoryButton
      selected={selectedTopic === topic}
      value={topic}
      onClick={() => setTopic(topic)}
    >
      {imageClass && (
        <StyledImage
          className={`image-for-${topic}-notes`}
          selected={selectedTopic === topic}
          alt="category-icon"
          height={'20px'}
          width={'20px'}
        />
      )}
      {topic === 'All' ? (
        <span>{label}</span>
      ) : (
        <span className="responsive-text">{label}</span>
      )}
    </CategoryButton>
  );

  const handleNoteAction = async (id, actionType) => {
    const noteIndex = initialData.findIndex(note => note.id === id);
    if (noteIndex === -1) return;

    const updatedNotesData = [...initialData];

    try {
      let response;

      switch (actionType) {
        case 'favorite':
          response = await noteStatusUpdate({
            note_id: id,
            is_favorite: !updatedNotesData[noteIndex].is_favorite,
          });
          break;
        case 'remove':
          response = await deleteUserNote(id);
          break;
        case 'archive':
          response = await noteStatusUpdate({
            note_id: id,
            is_archived: !updatedNotesData[noteIndex].is_archived,
          });
          break;
        default:
          break;
      }

      if (response && response.status === 200) {
        const updatedField =
          actionType === 'remove'
            ? 'is_deleted'
            : actionType === 'favorite'
            ? 'is_favorite'
            : 'is_archived';

        updatedNotesData[noteIndex] = {
          ...updatedNotesData[noteIndex],
          [updatedField]: !updatedNotesData[noteIndex][updatedField],
        };

        setInitialData(updatedNotesData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <WrapperContainer className="rce-mlist" style={{ border: 'none' }}>
      <Container>
        <CategoryWrapper>
          {renderButton('All', t('all_notes_label'))}
          {renderButton('is_favorite', t('favorite_notes_label'), true)}
          {renderButton('is_archived', t('archived_notes_label'), true)}
        </CategoryWrapper>
      </Container>
      {selectedTopic === 'All' && (
        <form>
          <Container>
            <TextArea
              className="notes-text-area"
              rows="4"
              placeholder={t('notes_textarea_placeholder')}
              value={note}
              onChange={handleNoteChange}
            />
            <ButtonContainer>
              <AddNoteButton
                className="add-note-btn"
                type="button"
                show={note ? true : false}
                onClick={handleAddNote}
              >
                Add Note
              </AddNoteButton>
            </ButtonContainer>
          </Container>
        </form>
      )}
      <NotesCardWrapper>
        {data &&
          data
            ?.filter(note => !note['is_deleted'])
            ?.map(({ id, note, updated_at, is_favorite }) => (
              <NotesCard selected={selectedQuestionId === id} key={id}>
                {selectedQuestionId !== id && (
                  <CardButton
                    selected={selectedQuestionId === id}
                    onClick={() =>
                      handleButtonClick(id, note[selfUserPreferedLang])
                    }
                  >
                    {note[selfUserPreferedLang]}
                  </CardButton>
                )}

                {selectedQuestionId === id && (
                  <NoteCardTextArea
                    rows="4"
                    value={textareaContent}
                    onChange={handleTextareaChange}
                  />
                )}
                <QuestionActionsWrapper>
                  <WrapperContainer>
                    {selectedQuestionId === id && (
                      <QuestionActions>
                        <Buttons
                          className="add-fovorite"
                          onClick={() => handleNoteAction(id, 'favorite')}
                        >
                          {is_favorite ? (
                            <img
                              className="favorite-icon"
                              alt="fovorite note"
                            />
                          ) : (
                            <img
                              className="unfavorite-icon"
                              alt="unfovorite note"
                            />
                          )}
                        </Buttons>
                        <Buttons
                          className="add-archives"
                          onClick={() => handleNoteAction(id, 'archive')}
                        >
                          <img alt="archive note" />
                        </Buttons>
                        <Buttons
                          className="remove-note"
                          onClick={() => handleNoteAction(id, 'remove')}
                        >
                          <img alt="remove note" />
                        </Buttons>
                        <WrapperContainer>
                          {isContentChanged && (
                            <EditButton onClick={() => handleNoteEdit(id)}>
                              Save
                            </EditButton>
                          )}
                        </WrapperContainer>
                      </QuestionActions>
                    )}
                  </WrapperContainer>
                  <UpdatedAtLabel>
                    {new Date(updated_at).toLocaleDateString()}
                  </UpdatedAtLabel>
                </QuestionActionsWrapper>
              </NotesCard>
            ))}
      </NotesCardWrapper>
    </WrapperContainer>
  );
}

function MobileDrawer({ content, setOverlay }) {
  const location = useLocation();
  const { userPk } = location.state || {};
  const match = useSelector(state =>
    getMatchByPartnerId(state.userData.matches, userPk),
  );

  return (
    <div className={`call-drawer-container ${content}`}>
      <div className="call-drawer">
        <button
          className="arrow-down"
          type="button"
          onClick={() => setOverlay(null)}
        >
          <img alt="hide drawer" />
        </button>
        <div className="drawer-content">
          {content === 'chat' && (
            <Chat chatId={match.chatId} renderUserInfo={false} />
          )}
          {content === 'translate' && <TranslationTool />}
          {content === 'questions' && <QuestionCards />}
          {content === 'notes' && <SidebarNotes />}
        </div>
      </div>
    </div>
  );
}

function CallSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const { userPk } = location.state || {};
  const match = useSelector(state =>
    getMatchByPartnerId(state.userData.matches, userPk),
  );
  const sidebarTopics = ['chat', 'questions'];
  const { setSideSelection, sideSelection } = useContext(
    SidebarSelectionContext,
  );
  const disabled = ['notes'];

  return (
    <div className="call-sidebar">
      <SidebarSelector className="sidebar-selector">
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
      <div className="sidebar-content">
        {sideSelection === 'chat' && (
          <Chat
            chatId={match.chatId}
            chatId="f56c4595-2619-4143-983a-3c1c733f47ca"
          />
        )}
        {sideSelection === 'questions' && <QuestionCards />}
        {sideSelection === 'notes' && <SidebarNotes />}
      </div>
    </div>
  );
}

export const SidebarSelectionProvider = ({ children }) => {
  const [sideSelection, setSideSelection] = useState('chat');

  return (
    <SidebarSelectionContext.Provider
      value={{ sideSelection, setSideSelection }}
    >
      {children}
    </SidebarSelectionContext.Provider>
  );
};

export default CallSidebar;
