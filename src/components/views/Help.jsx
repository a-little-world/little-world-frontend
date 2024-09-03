import {
  Accordion,
  Button,
  Card,
  CardSizes,
  Gradients,
  Label,
  MessageIcon,
  PhoneIcon,
  StatusMessage,
  TeacherImage,
  Text,
  TextArea,
  TextAreaSize,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { MessageTypes } from '@a-little-world/little-world-design-system/dist/esm/components/StatusMessage/StatusMessage';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { submitHelpForm } from '../../api/index.js';
import { onFormError, registerInput } from '../../helpers/form.js';
import Logo from '../atoms/Logo.tsx';
import MenuLink from '../atoms/MenuLink';
import Socials from '../atoms/Socials.tsx';
import ContentSelector from '../blocks/ContentSelector.tsx';
import './help.css';

const HelpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;

  ${({ theme }) => `
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.medium};

    @media (min-width: ${theme.breakpoints.large}) {
      justify-content: flex-start;
      flex-wrap: nowrap;
      padding: ${theme.spacing.xxsmall};
  }`}
`;

const HelpPanel = styled(Card)`
  ${({ theme }) => `
  @media (min-width: ${theme.breakpoints.medium}) {
    max-width: ${CardSizes.Large};
  }`}
`;

const HelpSupport = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  width: 100%;
  max-width: ${CardSizes.Medium};

  ${({ theme }) => `
    padding: ${theme.spacing.medium} ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.large};
      width: unset;
      max-width: unset;
    }`}
`;
const Topper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto ${({ theme }) => theme.spacing.medium};
`;
const SupportTeam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    margin: 0;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const ContactButtons = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  ${({ theme }) => `
    gap: ${theme.spacing.small};
    padding: 0 ${theme.spacing.xxxsmall} ${theme.spacing.medium};

    @media (min-width: ${theme.breakpoints.small}) {
      gap: ${theme.spacing.small};
      padding: 0 ${theme.spacing.xxxsmall} ${theme.spacing.medium};
    }`}
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(230, 232, 236, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: ${({ theme }) => `${theme.spacing.xxsmall} `};
  width: 100%;
  justify-content: space-between;

  ${({ theme }) =>
    `
    padding: ${theme.spacing.medium};
    gap: ${theme.spacing.small};

    @media (min-width: ${theme.breakpoints.small}) {
      padding: ${theme.spacing.medium};
    }`}
`;
const Contacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  white-space: nowrap;
`;

const BusinessName = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
`;

const ContentWrapper = styled.div``;
const DropZoneLabel = styled.div``;
const HelpButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xxsmall} `};
  color: #36a9e0;
  font-weight: 600;
  font-size: ${({ theme }) => `${theme.spacing.small} `};
`;

const ContactLink = styled.a`
  display: flex;
  text-align: center;
  gap: 0.3rem;
`;

const DragText = styled.div`
  font-weight: 300;
  font-size: ${({ theme }) => `${theme.spacing.small} `};
  color: #5f5f5f;
`;
const FileName = styled.div`
  display: flex;
  align-items: center;
`;

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

const FAQImageWrapper = styled.div`
  width: 80%;
  max-width: 200px;
  margin: 0 auto;
`;

const FAQItems = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => `${theme.spacing.medium} `};
`;

const FAQSectionTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

const ContentTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.title};
  text-align: center;

  ${({ theme }) => `
  @media (min-width: ${theme.breakpoints.small}) {
    text-align: left;
  }`}
`;

const StyledIntro = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const generateFAQItems = t => {
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
      questions: ['q1', 'q2', 'q3', 'q4', 'q5'],
    },
  ];

  return translationKeys.map(({ section, questions }) => ({
    section: t(`faq::section_title::${section}`),
    items: questions.map(question => ({
      header: t(`faq::section_content::${section}::${question}::question`),
      content: (
        <Text>
          {t(`faq::section_content::${section}::${question}::answer`)}
        </Text>
      ),
    })),
  }));
};

function Faqs() {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    setFaqs(generateFAQItems(t));
  }, [t]);

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

function Contact() {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [filenames, setFilenames] = useState([]);
  const [requestSuccessful, setRequestSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRef = useRef();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onError = e => {
    onFormError({ e, formFields: getValues(), setError });
    setIsSubmitting(false);
  };

  const onSuccess = response => {
    setIsSubmitting(false);
    setRequestSuccessful(true);
  };

  const onSubmit = formData => {
    setIsSubmitting(true);
    const data = new FormData();
    for (let i = 0; i < fileRef.current.files.length; ++i) {
      const file = fileRef.current.files.item(i);
      const { name } = file;

      data.append('file', file, name);
    }
    data.append('message', formData.message);
    submitHelpForm(data, onSuccess, onError);
  };

  const handleDrop = e => {
    e.preventDefault();
    const fileList = [...e.dataTransfer.items]
      .filter(item => item.kind === 'file' && item.type.startsWith('image/'))
      .map(item => item.getAsFile().name);
    setFilenames(fileList);
    setDragOver(false);
  };

  const handleDragOver = e => e.preventDefault();
  const handleDragEnter = () => setDragOver(true);
  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => fileRef.current.click();

  const handleChange = () => {
    const fileList = [...fileRef.current.files].map(file => file.name);
    setFilenames(fileList);
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
        maxLength="300"
        size={TextAreaSize.Medium}
        error={t(errors?.message?.message)}
        placeholder={t('help.contact_problem_placeholder')}
      />
      <DropZoneLabel>
        <Label bold>{t('help.contact_picture_label')}</Label>
        <div
          className={
            dragOver ? 'picture-drop-zone dragover' : 'picture-drop-zone'
          }
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            ref={fileRef}
            multiple
            accept="image/*"
            onChange={handleChange}
          />
          <HelpButton type="button" onClick={handleClick}>
            {filenames.map(name => {
              return (
                <FileName key={name}>
                  <img alt="" />
                  {name}
                </FileName>
              );
            })}
            {filenames.length === 0 && (
              <>
                <img alt="" />
                <span className="text">{t('help.contact_picture_btn')}</span>
              </>
            )}
            {filenames.length > 0 && (
              <span className="text">click to change files</span>
            )}
          </HelpButton>
          <DragText>{t('help.contact_picture_drag')}</DragText>
        </div>
      </DropZoneLabel>
      <StatusMessage
        $visible={requestSuccessful || errors?.root?.serverError}
        $type={requestSuccessful ? MessageTypes.Success : MessageTypes.Error}
      >
        {requestSuccessful
          ? t('help.contact_form_submitted')
          : t(errors?.root?.serverError?.message)}
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
  const adminUser = useSelector(
    state => state.userData.matches.support.items[0],
  );
  const supportUrl = useSelector(state => state.userData.supportUrl);

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={selectSubpage}
        use={'help'}
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
              <div className="sub">{t('help.support_slogan')}</div>
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

export default Help;
