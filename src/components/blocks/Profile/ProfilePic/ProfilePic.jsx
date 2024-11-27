import {
  Button,
  ButtonSizes,
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

import { USER_FIELDS } from '../../../../constants/index.ts';
import useImageCompression from '../../../../hooks/useImageCompression.tsx';
import { ImageSizes } from '../../../atoms/ProfileImage';
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
  StyledProfileImage,
  TrashButton,
  UploadArea,
} from './styles';

const IMAGE_TYPES = {
  avatar: 'avatar',
  image: 'image',
};

const MAX_IMAGE_SIZE = 1000000; // bytes

const CircleImage = ({
  className,
  icon,
  fileInputRef,
  uploadedImage,
  onImageDelete,
}) => {
  const theme = useTheme();
  return uploadedImage ? (
    <StyledProfileImage
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
    </StyledProfileImage>
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

    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `}
`;

const ProfilePic = ({ control, setValue, setError }) => {
  const [imageType, setImageType] = useState(IMAGE_TYPES.image);
  const [avatarConfig, setAvatarConfig] = useState(genConfig());
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [avatarList, setAvatarList] = useState([]);
  const [uploadedImage, setUploadedImage] = useState('');
  const userData = useSelector(state => state.userData.user.profile);
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const { compressImage } = useImageCompression();

  // Needs to be async now, to wait for the compression
  const onImageUpload = async e => {
    // Imagefile the user wants to upload
    const file = e.target.files[0];

    if (!file) return; // Guard clause for no file selected

    try {
      // compress file if bigger than limit
      if (file.size > MAX_IMAGE_SIZE) {
        const compressedFile = await compressImage(file);
        const image = URL.createObjectURL(compressedFile);
        setUploadedImage(image);
        setValue(USER_FIELDS.image, compressedFile); // Use compressed file here
      } else {
        const image = URL.createObjectURL(file);
        setUploadedImage(image);
        setValue(USER_FIELDS.image, file); // Use original file here
      }
    } catch (error) {
      setError(USER_FIELDS.image);
      // Handle error (e.g., show a notification to the user)
    }
  };

  const onImageDelete = e => {
    e.preventDefault();
    setUploadedImage(null);
    fileInputRef.current.value = '';
    setValue(USER_FIELDS.image, null);
    setValue(USER_FIELDS.imageType, imageType);
  };

  // Selection for the type the user is choosing (Own Image/ Avatar)
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

  const handleDrop = event => {
    event.preventDefault();
    const files = event?.dataTransfer?.files;
    const isValidFile = ['image/x-png', 'image/png', 'image/jpeg'].includes(
      files?.[0].type,
    );
    if (isValidFile) {
      onImageSelection(IMAGE_TYPES.image);
      onImageUpload({ target: { files } });
    }
  };

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
                  icon={
                    <PlusIcon
                      color={theme.color.text.accent}
                      width={48}
                      height={48}
                    />
                  }
                  onImageDelete={onImageDelete}
                  fileInputRef={fileInputRef}
                  uploadedImage={uploadedImage}
                />
              </ImageContainer>
              <UploadArea
                onDrop={handleDrop}
                onDragOver={event => event.preventDefault()}
                htmlFor="fileInput"
              >
                <MobileCircleImage
                  icon={
                    <ImageSearchIcon
                      color={theme.color.text.accent}
                      width={56}
                      height={56}
                    />
                  }
                  onImageDelete={onImageDelete}
                  fileInputRef={fileInputRef}
                  uploadedImage={uploadedImage}
                />
                <StyledFileIcon width={56} height={56} />
                <Text
                  color={theme.color.text.accent}
                  bold
                  type={TextTypes.Body5}
                  tag="h4"
                >
                  {t('profile_pic.click_to_upload')}
                </Text>
                <Text color="#A6A6A6" type={TextTypes.Body5}>
                  {t('profile_pic.drop_image')}
                </Text>

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
                    backgroundColor={theme.color.surface.primary}
                    borderColor={theme.color.border.contrast}
                    variation={ButtonVariations.Circle}
                    size={ButtonSizes.Medium}
                    disabled={avatarIndex === 0}
                    onClick={onPrevAvatar}
                    type="button"
                  >
                    <ChevronLeftIcon width={6} height={10} />
                  </Button>
                  <div>
                    <Avatar
                      style={{
                        width: ImageSizes.small,
                        height: ImageSizes.small,
                      }}
                      {...avatarConfig}
                    />
                  </div>
                  <Button
                    backgroundColor={theme.color.surface.primary}
                    borderColor={theme.color.border.contrast}
                    variation={ButtonVariations.Circle}
                    onClick={onNextAvatar}
                    size={ButtonSizes.Medium}
                    type="button"
                  >
                    <ChevronRightIcon width={6} height={10} />
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
                  color={theme.color.text.accent}
                >
                  <PencilIcon color={theme.color.text.accent} width={12} />
                  <Text
                    type={TextTypes.Body5}
                    bold
                    color={theme.color.text.accent}
                    tag="h4"
                  >
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
