import {
  ButtonSizes,
  ButtonVariations,
  Dropdown,
  SwapIcon,
  TextArea,
  TextAreaSize,
} from '@a-little-world/little-world-design-system';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AUTO_DETECT,
  SOURCE_LANGUAGES,
  TARGET_LANGUAGES,
  requestTranslation,
} from '../../../api/translator';
import {
  DesiredLanguage,
  OriginalLanguage,
  SwapBtn,
  ToolContainer,
} from './TranslationTool.styles';

function TranslationTool({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [fromLang, setFromLang] = useState<string>(AUTO_DETECT);
  const [toLang, setToLang] = useState('DE');
  const [error, setError] = useState<string | undefined>(undefined);

  const [leftText, setLeftText] = useState('');
  const [rigthText, setRightText] = useState('');

  const handleChangeLeft = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLeftText(event.target.value);
  };

  const onError = useCallback(
    (e: any) => {
      setError(e.message ? t(e.message) : t('validation.generic_try_again'));
    },
    [t],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (leftText === '') {
        return;
      }

      requestTranslation({
        sourceLang: fromLang,
        targetLang: toLang,
        text: leftText,
        onError,
        onSuccess: ({ translatedText, detectedSourceLanguage }) => {
          setRightText(translatedText);
          // If auto-detect was used, update fromLang to detected language
          if (fromLang === AUTO_DETECT && detectedSourceLanguage) {
            setFromLang(detectedSourceLanguage);
          }
        },
      });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [leftText, fromLang, toLang, onError]);

  // Can swap if fromLang is not AUTO_DETECT
  const canSwap = fromLang !== AUTO_DETECT;

  const swapLang = () => {
    if (!canSwap) return;

    // When swapping target to source, use swapsTo if it exists
    const targetLangData = TARGET_LANGUAGES.find(
      lang => lang.language === toLang,
    );
    const newSourceLang = targetLangData?.swapsTo || toLang;

    // When swapping source to target, use defaultTarget if it exists
    const sourceLangData = SOURCE_LANGUAGES.find(
      lang => lang.language === fromLang,
    );
    const newTargetLang = sourceLangData?.defaultTarget || fromLang;

    setFromLang(newSourceLang);
    setToLang(newTargetLang);
    setLeftText(rigthText);
    setRightText('');
  };

  return (
    <ToolContainer className={className}>
      <OriginalLanguage>
        <Dropdown
          key={fromLang}
          maxWidth="100%"
          placeholder={t('translator.language_placeholder')}
          onValueChange={setFromLang}
          value={fromLang}
          options={SOURCE_LANGUAGES.map(lang => ({
            value: lang.language,
            label: lang.name,
          }))}
        />
        <TextArea
          placeholder={t('translator.text_placeholder')}
          value={leftText}
          onChange={handleChangeLeft}
          size={TextAreaSize.Large}
          error={error}
        />
      </OriginalLanguage>
      <SwapBtn
        onClick={swapLang}
        variation={ButtonVariations.Circle}
        size={ButtonSizes.Small}
        disabled={!canSwap}
      >
        <SwapIcon
          label={t('translator.swap_languages')}
          width="16"
          height="16"
        />
      </SwapBtn>
      <DesiredLanguage>
        <Dropdown
          key={toLang}
          maxWidth="100%"
          placeholder={t('translator.language_placeholder')}
          onValueChange={setToLang}
          value={toLang}
          options={TARGET_LANGUAGES.map(lang => ({
            value: lang.language as string,
            label: lang.name,
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
