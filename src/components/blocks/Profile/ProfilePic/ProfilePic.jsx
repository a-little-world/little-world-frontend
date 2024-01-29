import {
  Button,
  ButtonVariations,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageSearchIcon,
  InputError,
  Label,
  Modal,
  PencilIcon,
  PlusIcon,
  Text,
  TextTypes,
  TrashIcon,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Avatar, { genConfig } from 'react-nice-avatar';
import { useSelector } from 'react-redux';
import styled, { css, useTheme } from 'styled-components';

import { USER_FIELDS } from '../../../../constants';
import ProfileImage from '../../../atoms/ProfileImage';
import AvatarEditor from './AvatarEditor';
import {
  AvatarEditorButton,
  AvatarSelection,
  CircleButton,
  FileInput,
  ImageContainer,
  InteractiveArea,
  ProfilePicWrapper,
  SelectionPanel,
  StyledFileIcon,
  TrashButton,
  UploadArea,
  UploadLabel,
} from './styles';

const IMAGE_TYPES = {
  avatar: 'avatar',
  image: 'image',
};

const CircleImage = ({
  className,
  icon,
  fileInputRef,
  uploadedImage,
  onImageDelete,
}) => {
  const theme = useTheme();
  return uploadedImage ? (
    <ProfileImage
      className={className}
      image={uploadedImage}
      size="medium"
      circle
    >
      <TrashButton
        onClick={onImageDelete}
        variation={ButtonVariations.Icon}
        type="button"
      >
        <TrashIcon color={theme.color.surface.disabled} />
      </TrashButton>
    </ProfileImage>
  ) : (
    <CircleButton
      className={className}
      htmlFor="fileInput"
      onClick={() => fileInputRef.current?.click()}
      variation="Secondary"
      type="button"
    >
      {icon}
    </CircleButton>
  );
};

const MobileCircleImage = styled(CircleImage)`
  ${({ theme }) => css`
    display: flex;
    margin-bottom: ${theme.spacing.xsmall};

    @media (min-width: ${theme.breakpoints.small}) {
      display: none;
    }
  `}
`;

const ProfilePic = ({ control, setValue }) => {
  const [imageType, setImageType] = useState(IMAGE_TYPES.image);
  const [avatarConfig, setAvatarConfig] = useState(genConfig());
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [avatarList, setAvatarList] = useState([]);
  const [uploadedImage, setUploadedImage] = useState('');
  const userData = useSelector(state => state.userData.user.profile);
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const onImageUpload = e => {
    const file = e.target.files[0];
    const image = URL.createObjectURL(file);

    setUploadedImage(image);
    setValue(USER_FIELDS.image, file);
  };

  const onImageDelete = () => {
    setUploadedImage(null);
    setValue(USER_FIELDS.image, null);
    setValue(USER_FIELDS.imageType, imageType);
  };

  const onImageSelection = type => {
    if (type === imageType) return;
    setImageType(type);
    setValue(USER_FIELDS.imageType, type);
    // remove other image type value
    if (type === IMAGE_TYPES.image) {
      setValue(USER_FIELDS.avatar, null);
      setValue(USER_FIELDS.image, uploadedImage);
    } else {
      setValue(USER_FIELDS.avatar, avatarConfig);
      setValue(USER_FIELDS.image, null);
    }
  };

  useEffect(() => {
    if (userData?.image_type) setImageType(userData?.image_type);
  }, [userData?.image_type]);

  useEffect(() => {
    if (!isEmpty(userData?.avatar_config)) {
      setValue(USER_FIELDS.avatar, userData.avatar_config);
      setAvatarConfig(userData.avatar_config);
      setAvatarList([userData.avatar_config]);
    } else {
      setValue(USER_FIELDS.avatar, avatarConfig);
      setAvatarList([avatarConfig]);
    }
  }, [userData?.avatar_config]);

  useEffect(() => {
    if (userData?.image) setUploadedImage(userData.image);
  }, [userData?.image]);

  const updateAvatar = config => {
    setAvatarConfig(config);
    setValue(USER_FIELDS.avatar, config);
    setValue(USER_FIELDS.imageType, imageType);
  };

  const onPrevAvatar = () => {
    updateAvatar(avatarList[avatarIndex - 1]);
    setAvatarIndex(index => index - 1);
  };

  const onNextAvatar = () => {
    if (avatarIndex === avatarList.length - 1) {
      const newConfig = genConfig();
      updateAvatar(newConfig);
      setAvatarList(list => [...list, newConfig]);
    } else {
      updateAvatar(avatarList[avatarIndex + 1]);
    }
    setAvatarIndex(index => index + 1);
  };

  const openAvatarEditor = () => setShowAvatarEditor(true);
  const closeAvatarEditor = () => setShowAvatarEditor(false);

  return (
    <ProfilePicWrapper>
      <Controller
        defaultValue={undefined}
        name={USER_FIELDS.image}
        control={control}
        rules={{ required: imageType === IMAGE_TYPES.image && !uploadedImage }}
        render={({
          field: { onChange, onBlur, name, ref },
          fieldState: { error },
        }) => (
          <>
            <SelectionPanel
              onClick={() => onImageSelection(IMAGE_TYPES.image)}
              $selected={imageType === IMAGE_TYPES.image}
              $error={!isEmpty(error)}
            >
              <ImageContainer>
                <CircleImage
                  icon={<PlusIcon color="#36a9e0" width={48} height={48} />}
                  onImageDelete={onImageDelete}
                  fileInputRef={fileInputRef}
                  uploadedImage={uploadedImage}
                />
              </ImageContainer>
              <UploadArea>
                <UploadLabel htmlFor="fileInput">
                  <MobileCircleImage
                    icon={<ImageSearchIcon color="#36a9e0" width={56} height={56} />}
                    onImageDelete={onImageDelete}
                    fileInputRef={fileInputRef}
                    uploadedImage={uploadedImage}
                  />
                  <StyledFileIcon width={56} height={56} />
                  <Text color="#36a9e0" bold type={TextTypes.Body5} tag="h4">
                    {t('profile_pic.click_to_upload')}
                  </Text>
                  <Text color="#A6A6A6" type={TextTypes.Body5}>
                    {t('profile_pic.drop_image')}
                  </Text>
                </UploadLabel>
                <FileInput
                  value={undefined}
                  ref={e => {
                    ref(e);
                    fileInputRef.current = e;
                  }}
                  type="file"
                  name={name}
                  id="fileInput"
                  onBlur={onBlur}
                  onChange={e => {
                    onChange(e);
                    onImageUpload(e);
                  }}
                  accept="image/x-png, image/png, image/jpeg"
                />
              </UploadArea>
            </SelectionPanel>
            <SelectionPanel
              onClick={() => onImageSelection(IMAGE_TYPES.avatar)}
              $selected={imageType === IMAGE_TYPES.avatar}
            >
              <InteractiveArea>
                <AvatarSelection>
                  <Button
                    variation={ButtonVariations.Control}
                    disabled={avatarIndex === 0}
                    onClick={onPrevAvatar}
                    type="button"
                  >
                    <ChevronLeftIcon width={6} />
                  </Button>
                  <div>
                    <Avatar
                      style={{ width: '8rem', height: '8rem' }}
                      {...avatarConfig}
                    />
                  </div>
                  <Button
                    variation={ButtonVariations.Control}
                    onClick={onNextAvatar}
                    type="button"
                  >
                    <ChevronRightIcon width={6} />
                  </Button>
                </AvatarSelection>
                <Label
                  bold
                  toolTipText={t('profile_pic.avatar_tooltip')}
                  marginBottom="0"
                >
                  {t('profile_pic.avatar_selection')}
                </Label>

                <Text type={TextTypes.Body5} color="#A6A6A6" center>
                  {t('profile_pic.randomize_avatar')}
                </Text>
                <AvatarEditorButton
                  variation={ButtonVariations.Inline}
                  onClick={openAvatarEditor}
                  type="button"
                  color="#36a9e0"
                >
                  <PencilIcon color="#36a9e0" width={12} />
                  <Text type={TextTypes.Body5} bold color="#36a9e0" tag="h4">
                    {t('profile_pic.edit_avatar')}
                  </Text>
                </AvatarEditorButton>
              </InteractiveArea>
            </SelectionPanel>
            <InputError
              right={0}
              bottom="-16px"
              textAlign="left"
              textType={TextTypes.Body5}
              visible={!isEmpty(error)}
              style={{ fontSize: '1rem' }}
            >
              {t('validation.image_upload_required')}
            </InputError>
          </>
        )}
      />

      <Modal open={showAvatarEditor} onClose={closeAvatarEditor}>
        <AvatarEditor
          config={avatarConfig}
          onUpdate={updateAvatar}
          closeEditor={closeAvatarEditor}
        />
      </Modal>
    </ProfilePicWrapper>
  );
};

export default ProfilePic;
