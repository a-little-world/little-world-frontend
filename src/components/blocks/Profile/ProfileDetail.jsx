import { ButtonVariations, PencilIcon, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  EditButton,
  Field,
  FieldTitle,
  ProfileSection,
} from './styles';

const ProfileDetail = ({
  content, children, editable = true, setEditingField,
}) => {
  const { t } = useTranslation();

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
            />
          </EditButton>
        )}
        {children}
      </Field>
    </ProfileSection>
  );
};

export default ProfileDetail;
