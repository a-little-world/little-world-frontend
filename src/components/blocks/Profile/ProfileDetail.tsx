import {
  ButtonVariations,
  PencilIcon,
  TextTypes,
  Tooltip,
} from '@a-little-world/little-world-design-system';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import {
  Description,
  EditButton,
  Field,
  FieldTitle,
  ProfileSection,
} from './styles';

interface ProfileDetailProps {
  content: {
    dataField: string;
  };
  children?: ReactNode;
  description?: string;
  editable?: boolean;
  setEditingField: (field: string) => void;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({
  content,
  children,
  description,
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
          <Tooltip
            text={t('profile.edit_button_tooltip')}
            trigger={
              <EditButton
                variation={ButtonVariations.Icon}
                onClick={() => setEditingField(content.dataField)}
              >
                <PencilIcon
                  label="edit interests button"
                  width="16"
                  height="16"
                  circular
                  color={theme.color.text.accent}
                  borderColor={theme.color.text.accent}
                />
              </EditButton>
            }
          />
        )}
        {description && <Description>{description}</Description>}
        {children}
      </Field>
    </ProfileSection>
  );
};

export default ProfileDetail;
