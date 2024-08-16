import {
  ButtonVariations,
  PencilIcon,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { EditButton, Field, FieldTitle, ProfileSection } from './styles';

const ProfileDetail = ({
  content,
  children,
  editable = true,
  setEditingField,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ProfileSection>
      <FieldTitle tag="h3" type={TextTypes.Body3} bold>
        {t(`profile.${content.dataField}_title`)}
      </FieldTitle>
      <Field>
        {editable && (
          <EditButton
            variation={ButtonVariations.Icon}
            onClick={() => setEditingField(content.dataField)}
          >
            <PencilIcon
              label="edit interests button"
              labelId="edit-interests-btn"
              width="16"
              height="16"
              circular
              color={theme.color.text.accent}
              borderColor={theme.color.text.accent}
            />
          </EditButton>
        )}
        {children}
      </Field>
    </ProfileSection>
  );
};

export default ProfileDetail;
