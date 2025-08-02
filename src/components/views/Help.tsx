import {
  Accordion,
  Button,
  Gradients,
  ImageIcon,
  ImageSearchIcon,
  Label,
  MessageIcon,
  StatusTypes,
  PhoneIcon,
  StatusMessage,
  TeacherImage,
  Text,
  TextArea,
  TextAreaSize,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { I18nextProvider, TFunction, useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR, { SWRConfig } from 'swr';

import { submitHelpForm } from '../../api/index';
import { MATCHES_ENDPOINT, swrConfig } from '../../features/swr/index';
import { onFormError, registerInput } from '../../helpers/form';
import i18n from '../../i18n';
import { MESSAGES_ROUTE, getAppSubpageRoute } from '../../router/routes';
import Logo from '../atoms/Logo';
import MenuLink from '../atoms/MenuLink';
import Socials from '../atoms/Socials';
import ContentSelector from '../blocks/ContentSelector';
import { FileInput, UploadArea } from '../blocks/Profile/ProfilePic/styles';
import {
  BusinessName,
  ContactButtons,
  ContactForm,
  ContactInfo,
  ContactLink,
  Contacts,
  ContentTitle,
  ContentWrapper,
  DropZoneContainer,
  FAQContainer,
  FAQImageWrapper,
  FAQItems,
  FAQSectionTitle,
  FileName,
  FileText,
  HelpContainer,
  HelpPanel,
  HelpSupport,
  StyledIntro,
  SupportTeam,
  Topper,
} from './Help.styles';
import './help.css';

const generateFAQItems = (t: TFunction, supportUrl: string) => {
  const translationKeys = [
    {
      section: 'before_talk',
      questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'],
    },
    {
      section: 'during_talk',
      questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
    },
    {
      section: 'after_talk',
      questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
    },
  ];

  return translationKeys.map(({ section, questions }) => ({
    section: t(`faq::section_title::${section}`),
    items: questions.map(question => ({
      header: t(`faq::section_content::${section}::${question}::question`),
      content: (
        <Text>
          {t(`faq::section_content::${section}::${question}::answer`, {
            supportUrl,
          })}
        </Text>
      ),
    })),
  }));
};

export const FileDropzone = ({
  fileRef,
  onFileChange,
  label,
}: {
  fileRef?: HTMLInputElement;
  onFileChange: (files: any) => void;
  label: string;
}) => {
  const { t } = useTranslation();
  const [filenames, setFilenames] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const theme = useTheme();

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fileList = [...e.dataTransfer.items]
      .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
      .map(item => item.getAsFile().name);
    onFileChange?.(fileList);
    setFilenames(current => [...current, fileList]);
    setDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDragEnter = () => setDragOver(true);
  const handleDragLeave = () => setDragOver(false);

  const handleChange = () => {
    const fileList = [...fileRef.current.files].map(file => file.name);
    onFileChange?.(fileList);
    setFilenames(fileList);
  };

  return (
    <DropZoneContainer>
      <Label bold>{label}</Label>
      <UploadArea
        $dragging={dragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        htmlFor="fileInput"
        $padding={theme.spacing.xlarge}
      >
        <FileInput
          type="file"
          id="fileInput"
          ref={fileRef}
          multiple
          accept="image/*"
          onChange={handleChange}
        />

        {filenames.length === 0 ? (
          <>
            <ImageSearchIcon
              label="file input icon"
              labelId="fileInputIcon"
              width={32}
              height={32}
              color={theme.color.text.accent}
            />
            <FileText tag="span">{t('help.contact_picture_btn')}</FileText>
          </>
        ) : (
          <>
            {filenames.map(name => (
              <FileName key={name}>
                <ImageIcon
                  label="uploaded file"
                  labelId="uploadedFileIcon"
                  width="24"
                  height="24"
                />
                {name}
              </FileName>
            ))}
            <FileText tag="span">{t('help.contact_change_files')}</FileText>
          </>
        )}

        <Text color={theme.color.text.secondary} tag="span">
          {t('help.contact_picture_drag')}
        </Text>
      </UploadArea>
    </DropZoneContainer>
  );
};

export const NativeWebWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => <SWRConfig value={swrConfig}>{children}</SWRConfig>;


export function Faqs() {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const { data: matches, error } = useSWR(MATCHES_ENDPOINT, {
    revalidateOnMount: true,
  });

  console.log('Message route', MESSAGES_ROUTE);
  console.log('Matches', matches, error);
  console.log('FAQ', t('nbt_faqs'));

  const adminUser = matches?.support?.results?.[0];
  const supportUrl = getAppSubpageRoute(
    MESSAGES_ROUTE,
    adminUser?.chatId ?? '',
  );

  useEffect(() => {
    if (!faqs.length) {
      setFaqs(generateFAQItems(t, supportUrl));
    }
  }, [t, supportUrl]);

  return (
    <FAQContainer>
      <ContentTitle tag="h2" type={TextTypes.Body2} bold>
        {t('nbt_faqs')}
      </ContentTitle>
      <Text>{t('help.faqs_intro')}</Text>
      <FAQImageWrapper>
        <TeacherImage />
      </FAQImageWrapper>
      {faqs.map(faq => (
        <FAQItems key={faq.section}>
          <FAQSectionTitle bold type={TextTypes.Body3}>
            {faq.section}
          </FAQSectionTitle>
          <Accordion items={faq.items} />
        </FAQItems>
      ))}
    </FAQContainer>
  );
}

export function Contact() {
  const { t } = useTranslation();

  const [requestSuccessful, setRequestSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onError = (e: any) => {
    onFormError({ e, formFields: getValues(), setError });
    setIsSubmitting(false);
  };

  const onSuccess = () => {
    setIsSubmitting(false);
    setRequestSuccessful(true);
  };

  const onSubmit = formData => {
    setIsSubmitting(true);
    const data = new FormData();
    for (let i = 0; i < fileRef.current.files.length; i += 1) {
      const file = fileRef.current.files.item(i);
      const { name } = file;

      data.append('file', file, name);
    }
    data.append('message', formData.message);
    submitHelpForm(data, onSuccess, onError);
  };

  return (
    <ContactForm onSubmit={handleSubmit(onSubmit)}>
      <ContentTitle tag="h2" type={TextTypes.Body2} bold>
        {t('nbt_contact')}
      </ContentTitle>
      <Text>{t('help.contact_intro_line1')}</Text>
      <StyledIntro>{t('help.contact_intro_line2')}</StyledIntro>
      <TextArea
        {...registerInput({
          register,
          name: 'message',
          options: { required: 'error.required' },
        })}
        label={t('help.contact_problem_label')}
        inputMode="text"
        size={TextAreaSize.Medium}
        error={t(errors?.message?.message)}
        placeholder={t('help.contact_problem_placeholder')}
      />
      <FileDropzone fileRef={fileRef} label={t('help.contact_picture_label')} />

      <StatusMessage
        $visible={Boolean(requestSuccessful || errors?.root?.serverError)}
        $type={requestSuccessful ? StatusTypes.Success : StatusTypes.Error}
      >
        {requestSuccessful ?
          t('help.contact_form_submitted') :
          t(errors?.root?.serverError?.message)}
      </StatusMessage>
      <Button
        type="submit"
        style={{ maxWidth: '100%' }}
        disabled={isSubmitting}
      >
        {t('help.contact_submit')}
      </Button>
    </ContactForm>
  );
}

function Help() {
  const { t } = useTranslation();
  const [subpage, selectSubpage] = useState('contact');
  const { data: matches } = useSWR(MATCHES_ENDPOINT, {
    revalidateOnMount: false,
  });

  const adminUser = matches?.support?.results?.[0];
  const supportUrl = getAppSubpageRoute(
    MESSAGES_ROUTE,
    adminUser?.chatId ?? '',
  );

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={selectSubpage}
        use="help"
      />
      <HelpContainer>
        <HelpPanel>
          {subpage === 'faqs' && <Faqs />}
          {subpage === 'contact' && <Contact />}
        </HelpPanel>

        <HelpSupport>
          <Topper>
            <Logo />
            <SupportTeam>
              <h2>{t('help.support_header')}</h2>
              <div>{t('help.support_slogan')}</div>
            </SupportTeam>
          </Topper>

          <ContactButtons>
            {adminUser?.partner?.id && (
              <MenuLink to={supportUrl}>
                <MessageIcon
                  gradient={Gradients.Orange}
                  label="message support"
                  labelId="message_support"
                />
                <Text tag="span" center>
                  {t('help.support_message_btn')}
                </Text>
              </MenuLink>
            )}
            <MenuLink to="tel:+4915234777471">
              <PhoneIcon
                gradient={Gradients.Orange}
                label="call support"
                labelId="call_support"
              />
              <Text tag="span" center>
                {t('help.support_call_btn')}
              </Text>
            </MenuLink>
          </ContactButtons>

          <ContactInfo>
            <ContentWrapper>
              <BusinessName bold>A Little World gUG</BusinessName>
            </ContentWrapper>
            <Contacts>
              <ContactLink href="mailto:support@little-world.com">
                <img className="email-icon" alt="e-mail" />
                support@little-world.com
              </ContactLink>
              <ContactLink href="tel:+4915234777471">
                <img className="mobile-icon" alt="mobile" />
                +49 152 34 777 471
              </ContactLink>
            </Contacts>
            <Socials type="social_media" gradient={Gradients.Blue} />
          </ContactInfo>
        </HelpSupport>
      </HelpContainer>
    </>
  );
}

export function FaqsNativeWeb() {
  return (
    <I18nextProvider i18n={i18n}>
      <NativeWebWrapper>
        <Faqs />
      </NativeWebWrapper>
    </I18nextProvider>
  );
}

export default Help;
