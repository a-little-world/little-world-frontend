import {
  Button,
  ButtonVariations,
  Dropdown,
  SendIcon,
  SwapIcon,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BACKEND_URL } from '../../../ENVIRONMENT.js';
import {
  DesiredLanguage,
  OriginalLanguage,
  SwapBtn,
  ToolContainer,
} from './TranslationTool.styles.tsx';

import { LANGUAGES, requestTranslation } from '../../../api/googletrans.js';

function TranslationTool({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('de');
  const [isSwapped, setIsSwapped] = useState(false);

  const [leftText, setLeftText] = useState('');
  const [rigthText, setRightText] = useState('');

  const handleChangeLeft = event => {
    setLeftText(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (leftText === '') {
        return;
      }


      requestTranslation({
        sourceLang: fromLang,
        targetLang: toLang,
        text: leftText,
      }).then(({ translatedText }) => setRightText(translatedText))
        .catch(error => console.error(error));
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [leftText]);

  const swapLang = () => {
    const oldFromLang = fromLang;
    const oldToLang = toLang;
    setFromLang(oldToLang);
    setToLang(oldFromLang);
    const tmpLeftText = leftText;
    setRightText(tmpLeftText);
    setLeftText(rigthText);
    setIsSwapped(!isSwapped);
  };

  return (
    <ToolContainer className={className}>
      <OriginalLanguage>
        <Dropdown
          maxWidth="100%"
          placeholder={t('translator.language_placeholder')}
          onValueChange={setFromLang}
          value={fromLang}
          options={LANGUAGES.map(lang => ({
            value: lang.language,
            label: `${lang.name} - ${lang.language}`
          }))}
        />
        <TextArea
          placeholder={t('translator.text_placeholder')}
          value={leftText}
          onChange={handleChangeLeft}
          size={TextAreaSize.Large}
        />
      </OriginalLanguage>
      <SwapBtn onClick={swapLang} variation={ButtonVariations.Icon}>
        <SwapIcon
          label={t('translator.swap_languages')}
          labelId={'swap_translations'}
          width="16"
          height="16"
        />
      </SwapBtn>
      <DesiredLanguage>
        <Dropdown
          maxWidth="100%"
          placeholder={t('translator.language_placeholder')}
          onValueChange={setToLang}
          value={toLang}
          options={LANGUAGES.map(lang => ({
            value: lang.language,
            label: `${lang.name} - ${lang.language}`
          }))}
        />
        <TextArea
          readOnly
          value={rigthText}
          size={TextAreaSize.Large}
          placeholder={t('translator.translated_placeholder')}
        />
      </DesiredLanguage>
    </ToolContainer>
  );
}

export default TranslationTool;
