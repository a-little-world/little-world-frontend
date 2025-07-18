import {
  Button,
  ButtonSizes,
  Card,
  ContentTypes,
  MessageTypes,
  StatusMessage,
  TextContent,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { submitHelpForm } from '../../../api/index';
import { FileDropzone } from '../Help';

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const UploadContainer = styled.div`
  max-width: 720px;
  width: 100%;
`;

const UploadButton = styled(Button)`
  max-width: 100%;
  margin: ${({ theme }) => theme.spacing.small} 0;
`;

const MyStory: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [requestSuccessful, setRequestSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hasFiles, setHasFiles] = useState(false);

  const onError = e => {
    setIsSubmitting(false);
    setError(t(e?.message || 'resources.my_story.submit_error'));
  };

  const onSuccess = () => {
    setIsSubmitting(false);
    setRequestSuccessful(true);
  };

  const onFileUpload = () => {
    setError(null);
    setIsSubmitting(true);
    const data = new FormData();
    for (let i = 0; i < fileRef.current.files.length; i += 1) {
      const file = fileRef.current.files.item(i);
      const { name } = file;

      data.append('file', file, name);
    }
    data.append('message', 'My Story: Image Upload');
    submitHelpForm(data, onSuccess, onError);
  };

  return (
    <ContentCard>
      <TextContent
        content={[
          {
            type: ContentTypes.Title,
            text: t('resources.my_story.title'),
            color: theme.color.text.title,
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.intro'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.description'),
            style: { marginBottom: theme.spacing.small },
          },
          {
            type: ContentTypes.Subtitle,
            text: t('resources.my_story.subtitle'),
          },
          {
            type: ContentTypes.Sentence,
            text: t('resources.my_story.steps_intro'),
          },
          {
            type: ContentTypes.OrderedList,
            listItems: [
              t('resources.my_story.step_1'),
              t('resources.my_story.step_2'),
              t('resources.my_story.step_3'),
            ],
            style: { marginBottom: theme.spacing.medium },
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.outro_1'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.outro_2'),
          },
          {
            type: ContentTypes.Paragraph,
            text: t('resources.my_story.disclaimer'),
            style: { marginBottom: theme.spacing.medium },
          },
          {
            type: ContentTypes.Sentence,
            text: t('resources.my_story.examples'),
            style: { marginBottom: theme.spacing.medium },
          },
        ]}
      />
      <UploadContainer>
        <FileDropzone
          label={t('resources.my_story.dropzone_label')}
          fileRef={fileRef}
          onFileChange={files => setHasFiles(!isEmpty(files))}
        />
        <UploadButton
          onClick={onFileUpload}
          size={ButtonSizes.Stretch}
          disabled={isSubmitting || !hasFiles}
        >
          {t('resources.my_story.upload_button')}
        </UploadButton>
        <StatusMessage
          $visible={requestSuccessful || !!error}
          $type={requestSuccessful ? MessageTypes.Success : MessageTypes.Error}
        >
          {requestSuccessful ? t('resources.my_story.submit_success') : error}
        </StatusMessage>
      </UploadContainer>
    </ContentCard>
  );
};

export default MyStory;
