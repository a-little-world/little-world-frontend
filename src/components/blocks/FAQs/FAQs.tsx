import { useMemo } from 'react';

import {
  Accordion,
  CardHeader,
  TeacherImage,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import {
  FAQContainer,
  FAQImageWrapper,
  FAQItems,
  FAQsCard,
  FAQsDescription,
  FAQSectionTitle,
} from './FAQs.styles';

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

const generateFAQItems = (t: TFunction, supportUrl: string) =>
  translationKeys.map(({ section, questions }) => ({
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

function FAQs({ supportUrl }: { supportUrl: string }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const faqs = useMemo(() => generateFAQItems(t, supportUrl), [t, supportUrl]);

  return (
    <FAQsCard>
      <CardHeader textColor={theme.color.text.title} marginBottom="0px">
        {t('nbt_faqs')}
      </CardHeader>
      <FAQContainer>
        <FAQImageWrapper>
          <TeacherImage label="image of woman holding book" />
        </FAQImageWrapper>
        <FAQsDescription type={TextTypes.Body5} center>
          {t('help.faqs_intro')}
        </FAQsDescription>
        {faqs.map(faq => (
          <FAQItems key={faq.section}>
            <FAQSectionTitle bold type={TextTypes.Heading5}>
              {faq.section}
            </FAQSectionTitle>
            <Accordion items={faq.items} />
          </FAQItems>
        ))}
      </FAQContainer>
    </FAQsCard>
  );
}

export default FAQs;
