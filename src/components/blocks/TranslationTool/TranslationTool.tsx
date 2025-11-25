import {
  AddToChatIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  CopyIcon,
  Dropdown,
  SwapIcon,
  TextAreaSize,
  Tooltip,
} from '@a-little-world/little-world-design-system';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AUTO_DETECT,
  SOURCE_LANGUAGES,
  TARGET_LANGUAGES,
  requestTranslation,
} from '../../../api/translator';
import { useChatInputStore } from '../../../features/stores';
import {
  DropdownsRow,
  ErrorBoxSpacer,
  SwapBtn,
  TextAreaContainer,
  TextAreasRow,
  ToolContainer,
  Toolbar,
  TranslatedTextArea,
  TranslatedTextAreaWrapper,
  TranslationInput,
} from './TranslationTool.styles';

function TranslationTool({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { addTextToChat } = useChatInputStore();
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

  const handleCopy = () => {
    navigator.clipboard.writeText(rigthText);
  };

  const handleCopyToChat = () => {
    addTextToChat(rigthText);
  };

  return (
    <ToolContainer className={className}>
      <DropdownsRow>
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
      </DropdownsRow>
      <TextAreasRow>
        <TranslationInput
          placeholder={t('translator.text_placeholder')}
          value={leftText}
          onChange={handleChangeLeft}
          size={TextAreaSize.Large}
          error={error}
        />
        <TranslatedTextAreaWrapper>
          <TextAreaContainer>
            <TranslatedTextArea
              readOnly
              value={rigthText}
              size={TextAreaSize.Large}
              placeholder={t('translator.translated_placeholder')}
            />
            <Toolbar>
              <Tooltip
                text={t('translator.copy_to_clipboard_label')}
                trigger={
                  <Button
                    variation={ButtonVariations.Icon}
                    size={ButtonSizes.Medium}
                    onClick={handleCopy}
                  >
                    <CopyIcon label={t('translator.copy_to_clipboard_label')} />
                  </Button>
                }
              />
              <Tooltip
                text={t('translator.add_to_chat_label')}
                trigger={
                  <Button
                    variation={ButtonVariations.Icon}
                    size={ButtonSizes.Medium}
                    onClick={handleCopyToChat}
                  >
                    <AddToChatIcon label={t('translator.add_to_chat_label')} />
                  </Button>
                }
              />
            </Toolbar>
          </TextAreaContainer>
          <ErrorBoxSpacer />
        </TranslatedTextAreaWrapper>
      </TextAreasRow>
    </ToolContainer>
  );
}

export default TranslationTool;
