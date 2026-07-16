import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  ChevronLeftIcon,
  ChevronRightIcon,
  Label,
  Modal,
  PencilIcon,
  PlusIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Avatar, { genConfig } from 'react-nice-avatar';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { USER_FIELDS } from '../../../../constants/index';
import { USER_ENDPOINT } from '../../../../features/swr/index';
import useImageCompression from '../../../../hooks/useImageCompression';
import useSystemModalBlocker from '../../../../hooks/useSystemModalBlocker';
import { ImageSizes } from '../../../atoms/ProfileImage';
import UploadImage from '../../../atoms/UploadImage';
import FileDropzone, { AcceptedFiles } from '../../FileDropzone/FileDropzone';
import AvatarEditor from './AvatarEditor';
import {
  AvatarEditorButton,
  AvatarSelection,
  ImageContainer,
  InteractiveArea,
  ProfilePicWrapper,
  SelectionPanel,
} from './styles';

const IMAGE_TYPES = {
  avatar: 'avatar',
  image: 'image',
} as const;

const MAX_IMAGE_SIZE = 1000000; // bytes

interface ProfilePicProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
}

const ProfilePic: React.FC<ProfilePicProps> = ({
  control,
  setValue,
  setError,
  clearErrors,
}) => {
  const [imageType, setImageType] = useState<keyof typeof IMAGE_TYPES>(
    IMAGE_TYPES.image,
  );
  const [avatarConfig, setAvatarConfig] = useState(genConfig());
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  useSystemModalBlocker(showAvatarEditor, 'profile-pic-avatar-editor');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [avatarList, setAvatarList] = useState<any[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>('');
  const { data: user } = useSWR(USER_ENDPOINT);
  const userData = user?.profile;

  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const { compressImage } = useImageCompression();

  // Needs to be async now, to wait for the compression
  const onImageUpload = async (file?: File) => {
    if (!file) return; // Guard clause for no file selected

    clearErrors(USER_FIELDS.image);

    try {
      // compress file if bigger than limit
      if (file.size > MAX_IMAGE_SIZE) {
        const compressedFile = await compressImage(file);
        const image = URL.createObjectURL(compressedFile);
        setUploadedImage(image);
        setValue(USER_FIELDS.image, compressedFile, {
          shouldDirty: true,
          shouldValidate: true,
        }); // Use compressed file here
      } else {
        const image = URL.createObjectURL(file);
        setUploadedImage(image);
        setValue(USER_FIELDS.image, file, {
          shouldDirty: true,
          shouldValidate: true,
        }); // Use original file here
      }
    } catch {
      setError(USER_FIELDS.image, {
        type: 'custom',
        message: 'validation.image_upload_error',
      });
    }
  };

  const onImageDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValue(USER_FIELDS.image, null);
    setValue(USER_FIELDS.imageType, imageType);
  };

  // Selection for the type the user is choosing (Own Image/ Avatar)
  const onImageSelection = (type: keyof typeof IMAGE_TYPES) => {
    if (type === imageType) return;
    clearErrors(USER_FIELDS.image);
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
  }, [userData?.avatar_config]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userData?.image) setUploadedImage(userData.image);
  }, [userData?.image]);

  const updateAvatar = (config: any) => {
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
        rules={{
          required:
            imageType === IMAGE_TYPES.image && !uploadedImage
              ? 'validation.image_upload_required'
              : false,
        }}
        render={({ field: { onBlur, name, ref }, fieldState: { error } }) => (
          <>
            <SelectionPanel
              onClick={() => onImageSelection(IMAGE_TYPES.image)}
              $selected={imageType === IMAGE_TYPES.image}
              $error={!isEmpty(error)}
            >
              <ImageContainer>
                <UploadImage
                  icon={
                    <PlusIcon
                      label="add image"
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
              <FileDropzone
                acceptedFiles={AcceptedFiles.Images}
                dropHint={t('profile_pic.drop_hint')}
                fileRef={element => {
                  ref(element);
                  fileInputRef.current = element;
                }}
                multiple={false}
                name={name}
                onBlur={onBlur}
                onFileChange={files => {
                  const file = files[0];

                  if (!file) {
                    return;
                  }

                  onImageSelection(IMAGE_TYPES.image);
                  onImageUpload(file);
                }}
                onImageDelete={onImageDelete}
                showSelectedFiles={false}
                uploadedImage={uploadedImage}
              />
            </SelectionPanel>
            <SelectionPanel
              onClick={() => onImageSelection(IMAGE_TYPES.avatar)}
              $selected={imageType === IMAGE_TYPES.avatar}
            >
              <InteractiveArea>
                <AvatarSelection>
                  <Button
                    color={theme.color.border.contrast}
                    variation={ButtonVariations.Circle}
                    appearance={ButtonAppearance.Secondary}
                    size={ButtonSizes.Medium}
                    disabled={avatarIndex === 0}
                    onClick={onPrevAvatar}
                    type="button"
                  >
                    <ChevronLeftIcon
                      label="previous avatar"
                      width={6}
                      height={10}
                    />
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
                    color={theme.color.border.contrast}
                    variation={ButtonVariations.Circle}
                    appearance={ButtonAppearance.Secondary}
                    onClick={onNextAvatar}
                    size={ButtonSizes.Medium}
                    type="button"
                  >
                    <ChevronRightIcon
                      label="next avatar"
                      width={6}
                      height={10}
                    />
                  </Button>
                </AvatarSelection>
                <Label
                  bold
                  tooltipText={t('profile_pic.avatar_tooltip')}
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
                  <PencilIcon
                    label="edit avatar"
                    color={theme.color.text.accent}
                    width={12}
                  />
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
