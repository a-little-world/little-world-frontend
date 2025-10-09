import {
  Button,
  ButtonAppearance,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from 'react-nice-avatar';

import {
  AvatarContainer,
  Buttons,
  ColorPicker,
  ControlColumn,
  Controls,
  Editor,
  OptionToggle,
} from './styles';

const optionsKeys = {
  faceColor: 'faceColor',
  earSize: 'earSize',
  hairStyle: 'hairStyle',
  hairColor: 'hairColor',
  hatStyle: 'hatStyle',
  hatColor: 'hatColor',
  eyeStyle: 'eyeStyle',
  glassesStyle: 'glassesStyle',
  noseStyle: 'noseStyle',
  mouthStyle: 'mouthStyle',
  shirtStyle: 'shirtStyle',
  shirtColor: 'shirtColor',
  eyeBrowStyle: 'eyeBrowStyle',
  bgColor: 'bgColor',
} as const;

const translations = {
  faceColor: 'skin_tone',
  earSize: 'ears',
  hairStyle: 'hair_style',
  hairColor: 'hair_color',
  hatStyle: 'hat_style',
  hatColor: 'hat_color',
  eyeStyle: 'eyes',
  glassesStyle: 'glasses',
  noseStyle: 'nose',
  mouthStyle: 'mouth',
  shirtStyle: 'shirt_style',
  shirtColor: 'shirt_color',
  eyeBrowStyle: 'eyebrows',
  bgColor: 'background',
} as const;

const options: Record<string, any[]> = {
  faceColor: [
    '#F9C9B6',
    '#AC6651',
    '#8d5524',
    '#c68642',
    '#e0ac69',
    '#f1c27d',
    '#ffdbac',
  ],
  earSize: ['small', 'big'],
  hairColor: [
    '#000000',
    '#ffffff',
    '#77311D',
    '#FC909F',
    '#D2EFF3',
    '#506AF4',
    '#F48150',
    '#A8A8A8',
    '#E5C990',
    '#B88665',
  ],
  hairStyle: [
    'normal',
    'buzz',
    'bald',
    'womanLong',
    'womanShort',
    'thick',
    'mohawk',
  ],
  hairColorRandom: [false],
  hatColor: [
    '#000000',
    '#ffffff',
    '#77311D',
    '#FC909F',
    '#D2EFF3',
    '#506AF4',
    '#F48150',
    '#A8A8A8',
    '#E5C990',
    '#B88665',
  ],
  hatStyle: ['beanie', 'turban', 'hijab', 'none'],
  eyeStyle: ['circle', 'oval', 'smile'],
  glassesStyle: ['round', 'square', 'none'],
  noseStyle: ['short', 'long', 'round'],
  mouthStyle: ['laugh', 'smile', 'peace'],
  shirtStyle: ['hoody', 'short', 'polo'],
  eyeBrowStyle: ['up', 'upWoman'],
  shirtColor: ['#9287FF', '#6BD9E9', '#FC909F', '#F4D150', '#77311D'],
  bgColor: [
    '#9287FF',
    '#6BD9E9',
    '#FC909F',
    '#F4D150',
    '#E0DDFF',
    '#D2EFF3',
    '#FFEDEF',
    '#FFEBA4',
    '#506AF4',
    '#F48150',
    '#74D153',
  ],
  isGradient: [false],
};

const controls: Array<[string | null, string?]> = [
  [null, optionsKeys.faceColor],
  [optionsKeys.earSize],
  [optionsKeys.hairStyle, optionsKeys.hairColor],
  [optionsKeys.hatStyle, optionsKeys.hatColor],
  [optionsKeys.eyeStyle],
  [optionsKeys.eyeBrowStyle],
  [optionsKeys.glassesStyle],
  [optionsKeys.noseStyle],
  [optionsKeys.mouthStyle],
  [optionsKeys.shirtStyle, optionsKeys.shirtColor],
  [null, optionsKeys.bgColor],
];

interface AvatarEditorProps {
  config: any;
  onUpdate: (config: any) => void;
  closeEditor: () => void;
}

const AvatarEditor: React.FC<AvatarEditorProps> = ({
  config,
  onUpdate,
  closeEditor,
}) => {
  const [editorConfig, setEditorConfig] = useState(config);
  const { t } = useTranslation();

  const updateAvatar = (key: string) => {
    const maxVal = options[key].length - 1;
    const currentIndex = options[key].indexOf(editorConfig[key]);

    setEditorConfig(state => ({
      ...state,
      [key]:
        currentIndex >= maxVal ?
          options[key][0] :
          options[key][currentIndex + 1],
    }));
  };

  const handleSave = () => {
    onUpdate(editorConfig);
    closeEditor();
  };

  return (
    <Editor>
      <AvatarContainer>
        <Avatar style={{ width: '100%', height: '100%' }} {...editorConfig} />
      </AvatarContainer>
      <Controls>
        {controls.map(([optionKey, colorKey]) => (
          <ControlColumn key={`control ${optionKey} ${colorKey}`}>
            {optionKey && (
              <OptionToggle
                onClick={() => {
                  updateAvatar(optionKey);
                }}
              >
                {t(
                  `profile_pic.avatar_${
                    translations[optionKey as keyof typeof translations]
                  }`,
                )}
              </OptionToggle>
            )}
            {colorKey && (
              <ColorPicker
                background={editorConfig[colorKey]}
                ariaLabel={translations[colorKey as keyof typeof translations]}
                key={colorKey}
                onClick={() => {
                  updateAvatar(colorKey);
                }}
              />
            )}
          </ControlColumn>
        ))}
      </Controls>
      <Buttons>
        <Button appearance={ButtonAppearance.Secondary} onClick={closeEditor}>
          {t('profile_pic.discard_avatar')}
        </Button>
        <Button onClick={handleSave}>{t('profile_pic.save_avatar')}</Button>
      </Buttons>
    </Editor>
  );
};

export default AvatarEditor;
