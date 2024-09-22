import { TextTypes } from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  addUserNote,
  deleteUserNote,
  getUserNotes,
  noteStatusUpdate,
} from '../../../services/userNotes';
import {
  AddNoteButton,
  ButtonContainer,
  Buttons,
  CardButton,
  CategoryButton,
  CategoryLabel,
  CategoryWrapper,
  Container,
  EditButton,
  NoteCardTextArea,
  NotesCard,
  NotesCardWrapper,
  QuestionActions,
  QuestionActionsWrapper,
  StyledImage,
  TextArea,
  UpdatedAtLabel,
  WrapperContainer,
} from './CallSidebar.styles.tsx';

export function SidebarNotes() {
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
    const [sourcelang, targetLang] =      selfUserPreferedLang === 'de' ? ['de', 'en'] : ['en', 'de'];
    await addUserNote(note, sourcelang, targetLang);
    setNote('');
    getUserNotes()
      .then(response => {
        if (response.error) setInitialData(null);
        else setInitialData(response);
      })
      .catch(error => console.log({ error }));
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
    const [sourcelang, targetLang] =      selfUserPreferedLang === 'de' ? ['de', 'en'] : ['en', 'de'];
    const FavoritedResponse = await noteStatusUpdate({
      note_id: id,
      note_text: content,
      source_language: sourcelang,
      target_language: targetLang,
    });
    if (FavoritedResponse.status === 200) {
      const noteIndex = initialData?.findIndex(note => note.id === id);

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

  const renderButton = ({
    topic,
    label,
    showImage,
  }: {
    topic: string;
    label: string;
    showImage?: boolean;
  }) => (
    <CategoryButton
      selected={selectedTopic === topic}
      value={topic}
      onClick={() => setTopic(topic)}
    >
      {showImage && (
        <StyledImage
          className={`image-for-${topic}-notes`}
          selected={selectedTopic === topic}
          alt="category-icon"
          height="20px"
          width="20px"
        />
      )}

      <CategoryLabel
        tag="span"
        $desktopOnly={topic !== 'All'}
        type={TextTypes.Body4}
      >
        {label}
      </CategoryLabel>
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
        const updatedField =          actionType === 'remove' ?
            'is_deleted' :
            actionType === 'favorite' ?
            'is_favorite' :
            'is_archived';

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
          {renderButton({ topic: 'All', label: t('all_notes_label') })}
          {renderButton({
            topic: 'is_favorite',
            label: t('favorite_notes_label'),
            showImage: true,
          })}
          {renderButton({
            topic: 'is_archived',
            label: t('archived_notes_label'),
            showImage: true,
          })}
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
                show={Boolean(note)}
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
            ?.filter(note => !note.is_deleted)
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

export default SidebarNotes;
