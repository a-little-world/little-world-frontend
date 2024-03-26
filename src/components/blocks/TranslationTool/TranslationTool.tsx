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

const languages = [
  'en',
  'sa',
  'bg',
  'ma',
  'ca',
  'fr',
  'gr',
  'in',
  'it',
  'kr',
  'ir',
  'pl',
  'ru',
  'es',
  'tr',
  'uk',
  'vn',
  'de',
];

function TranslationTool() {
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

      fetch(`${BACKEND_URL}/api/user/translate/`, {
        method: 'POST',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          source_lang: fromLang,
          target_lang: toLang,
          text: leftText,
        }).toString(),
      })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          console.error('server error', response.status, response.statusText);
          return false;
        })
        .then(({ trans }) => setRightText(trans))
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
    <ToolContainer>
      <OriginalLanguage>
        <Dropdown
          maxWidth="100%"
          placeholder={t('translation.language_placeholder')}
          onValueChange={setFromLang}
          value={fromLang}
          options={languages.map(lang => ({
            value: lang,
            label: t(`lang-${lang}`),
          }))}
        />
        <TextArea
          placeholder={t('translations.text_placeholder')}
          value={leftText}
          onChange={handleChangeLeft}
          size={TextAreaSize.Large}
        />
      </OriginalLanguage>
      <SwapBtn onClick={swapLang} variation={ButtonVariations.Icon}>
        <SwapIcon
          label={t('translation.swap_languages')}
          labelId={'swap_translations'}
          width="16"
          height="16"
        />
      </SwapBtn>
      <DesiredLanguage>
        <Dropdown
          maxWidth="100%"
          placeholder={t('translation.language_placeholder')}
          onValueChange={setToLang}
          value={toLang}
          options={languages.map(lang => ({
            value: lang,
            label: t(`lang-${lang}`),
          }))}
        />
        <TextArea readOnly value={rigthText} size={TextAreaSize.Large} />
      </DesiredLanguage>
    </ToolContainer>
  );
}

export default TranslationTool;
