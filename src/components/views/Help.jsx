import {
  Accordion,
  Button,
  Card,
  CardSizes,
  Gradients,
  Label,
  MessageIcon,
  PhoneIcon,
  Text,
  TextArea,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { CHAT_ROUTE, getAppRoute } from '../../routes';
import Logo from '../atoms/Logo';
import MenuLink from '../atoms/MenuLink';
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

const HelpPanel = styled(Card)``;

const HelpSupport = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  width: 100%;
  max-width: ${CardSizes.Large};

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
const ContactButtons = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;

  ${({ theme }) => `
    gap: ${theme.spacing.small};
    padding: 0 ${theme.spacing.xxxsmall} ${theme.spacing.medium};

    @media (min-width: ${theme.breakpoints.small}) {
      gap: ${theme.spacing.medium};
      padding: 0 ${theme.spacing.xxxsmall} ${theme.spacing.medium};
    }`}
`;

const ContactInfo = styled.div`
  display: flex;
  background: rgba(230, 232, 236, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: ${({ theme }) => `${theme.spacing.xxsmall} `};
  width: 100%;

  ${({ theme }) =>
    `
    padding: ${theme.spacing.medium};
    gap: ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.small}) {
      padding: ${theme.spacing.medium};
      gap: ${theme.spacing.xlarge};
    }`}
`;
const Contacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `${theme.spacing.xxsmall} `};
  white-space: nowrap;
`;

const SocialLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `${theme.spacing.xxsmall} `};
  margin-left: auto;
  justify-content: end;

  img {
    display: flex;
    padding: ${({ theme }) => `${theme.spacing.xxxsmall} `};
  }
`;
const BusinessName = styled.div`
  color: rgb(54, 169, 224);
  font-size: ${({ theme }) => `${theme.spacing.xsmall} `};
  margin: ${({ theme }) =>
    `${theme.spacing.xxsmall}  ${theme.spacing.xxxsmall}`};
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
const SupportButtonText = styled.span`
  font-size: 1rem;
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

const FAQItems = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => `${theme.spacing.medium} `};
`;

const FAQSectionTitle = styled(Text)`
  margin-bottom: ${({ theme }) => `${theme.spacing.xxsmall} `};
`;

const generateFAQItems = t => {
  const translationKeys = [
    {
      section: 'before_talk',
      questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'],
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
      content: t(`faq::section_content::${section}::${question}::answer`),
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
      <Text tag="h2" type={TextTypes.Heading2}>
        {t('nbt_faqs')}
      </Text>
      <Text>{t('help_faqs_intro')}</Text>
      {faqs.map(faq => (
        <FAQItems key={faq.section}>
          <FAQSectionTitle bold type={TextTypes.Body2} color="black">
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
  const [helpMessage, setHelpMessage] = useState('');
  const [formState, setFormState] = useState('idle');
  const fileRef = useRef();

  const handleSubmit = () => {
    setFormState('pending');
    const data = new FormData();
    for (let i = 0; i < fileRef.current.files.length; ++i) {
      const file = fileRef.current.files.item(i);
      const { name } = file;

      data.append('file', file, name);
    }
    data.set('message', helpMessage);
    fetch('/api/help_message/', {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': true,
      },
      method: 'POST',
      body: data,
    }).then(res => {
      if (res.ok) {
        setFormState('submitted');
      } else {
        setFormState('error');
      }
    });
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

  if (formState === 'pending') {
    return <h2>Sending you message</h2>;
  }
  if (formState === 'submitted') {
    return <h2>Your message has been submitted, thanks for your feedback!</h2>;
  }
  if (formState === 'error') {
    return (
      <h2>
        There has been an error submitting your message, please try sending an
        email.
      </h2>
    );
  }

  return (
    <form className="help-contact">
      <Text tag="h2" type={TextTypes.Heading2}>
        {t('nbt_contact')}
      </Text>
      <Text>{t('help_contact_intro_line1')}</Text>
      <Text>{t('help_contact_intro_line2')}</Text>
      <TextArea
        label={t('help_contact_problem_label')}
        name="problem"
        inputMode="text"
        maxLength="300"
        placeholder={t('help_contact_problem_placeholder')}
        onChange={e => {
          setHelpMessage(e.target.value);
        }}
      />
      <DropZoneLabel>
        <Label bold>{t('help_contact_picture_label')}</Label>
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
                <span className="text">{t('help_contact_picture_btn')}</span>
              </>
            )}
            {filenames.length > 0 && (
              <span className="text">click to change files</span>
            )}
          </HelpButton>
          <DragText>{t('help_contact_picture_drag')}</DragText>
        </div>
      </DropZoneLabel>
      <Button onClick={handleSubmit}>{t('help_contact_submit')}</Button>
    </form>
  );
}

function Help({ selection }) {
  const { t } = useTranslation();
  const adminUser = useSelector(
    state => state.userData.matches.support.items[0],
  );

  return (
    <HelpContainer>
      <HelpPanel width={CardSizes.Large}>
        {selection === 'faqs' && <Faqs />}
        {selection === 'contact' && <Contact />}
      </HelpPanel>

      <HelpSupport>
        <Topper>
          <Logo />
          <SupportTeam>
            <h2>{t('help_support_header')}</h2>
            <div className="sub">{t('help_support_slogan')}</div>
          </SupportTeam>
        </Topper>

        <ContactButtons>
          {adminUser?.partner?.id && (
            <MenuLink
              to={getAppRoute(CHAT_ROUTE)}
              // state={{ userPk: adminUser.partner.id }}
            >
              <MessageIcon
                gradient={Gradients.Orange}
                label="message support"
                labelId="message_support"
              />
              <SupportButtonText>
                {t('help_support_message_btn')}
              </SupportButtonText>
            </MenuLink>
          )}
          <MenuLink to="tel:+4915234777471">
            <PhoneIcon
              gradient={Gradients.Orange}
              label="call support"
              labelId="call_support"
            />
            <SupportButtonText>{t('help_support_call_btn')}</SupportButtonText>
          </MenuLink>
        </ContactButtons>

        <ContactInfo>
          <ContentWrapper>
            <ContentWrapper>
              <Logo size="small" stacked={false} />
              <BusinessName>A Little World gUG</BusinessName>
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
          </ContentWrapper>
          <SocialLinks>
            <a href="https://www.linkedin.com/company/76488145/">
              <img className="icon-linkedin" alt="linked in" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100071509163812">
              <img className="icon-facebook" alt="facebook" />
            </a>
            <a href="https://www.instagram.com/littleworld_de/">
              <img className="icon-instagram" alt="instagram" />
            </a>
          </SocialLinks>
        </ContactInfo>
      </HelpSupport>
    </HelpContainer>
  );
}

export default Help;
