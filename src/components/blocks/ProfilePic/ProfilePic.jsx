import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Button,
  ButtonVariations,
  ImageIcon,
  InputError,
  Modal,
  PencilIcon,
  PlusIcon,
  QuestionIcon,
  Text,
  TextTypes,
  ToolTip,
  TrashIcon,
} from "@a-little-world/little-world-design-system";
import { isEmpty } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Avatar, { genConfig } from "react-nice-avatar";
import { useSelector } from "react-redux";

import { USER_FIELDS } from "../../../constants";
import theme from "../../../theme";
import AvatarEditor from "./AvatarEditor";
import {
  AvatarEditorButton,
  AvatarInfo,
  AvatarSelection,
  CircleButton,
  CircleImage,
  FileInput,
  ImageContainer,
  InteractiveArea,
  ProfilePicWrapper,
  SelectionPanel,
  TrashButton,
  UploadArea,
  UploadLabel,
} from "./styles";

const IMAGE_TYPES = {
  avatar: "avatar",
  image: "image",
};

const ProfilePic = ({ control, setValue }) => {
  const [imageType, setImageType] = useState(IMAGE_TYPES.image);
  const [avatarConfig, setAvatarConfig] = useState(genConfig());
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [avatarList, setAvatarList] = useState([]);
  const [uploadedImage, setUploadedImage] = useState("");
  const userData = useSelector((state) => state.userData.user.profile);
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const onImageUpload = (e) => {
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

  const onImageSelection = (type) => {
    setImageType(type);
    setValue(USER_FIELDS.imageType, type);
  };

  useEffect(() => {
    if (userData?.image_type) setImageType(userData?.image_type);
  }, [userData?.image_type]);

  useEffect(() => {
    if (!isEmpty(userData?.avatar_config)) {
      setValue(USER_FIELDS.avatar, userData.avatar_config);
      setAvatarConfig(userData.avatar_config);
    } else {
      setValue(USER_FIELDS.avatar, avatarConfig);
    }
  }, [userData?.avatar_config]);

  useEffect(() => {
    if (userData?.image) setUploadedImage(userData.image);
  }, [userData?.image]);

  const updateAvatar = (config) => {
    setAvatarConfig(config);
    setValue(USER_FIELDS.avatar, config);
    setValue(USER_FIELDS.imageType, imageType);
  };

  const onPrevAvatar = () => {
    updateAvatar(avatarList[avatarList.length - 1]);
  };

  const onNextAvatar = () => {
    setAvatarList((list) => [...list, avatarConfig]);
    updateAvatar(genConfig());
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
        render={({ field: { onChange, onBlur, name, value, ref }, fieldState: { error } }) => (
          <SelectionPanel
            onClick={() => onImageSelection(IMAGE_TYPES.image)}
            $selected={imageType === IMAGE_TYPES.image}
            $error={!isEmpty(error)}
          >
            <ImageContainer>
              {uploadedImage ? (
                <CircleImage $image={uploadedImage}>
                  <TrashButton onClick={onImageDelete} variation="Icon" type="button">
                    <TrashIcon color="white" />
                  </TrashButton>
                </CircleImage>
              ) : (
                <CircleButton
                  htmlFor="fileInput"
                  onClick={() => fileInputRef.current?.click()}
                  variation="Secondary"
                  type="button"
                >
                  <PlusIcon color="#36a9e0" />
                </CircleButton>
              )}
            </ImageContainer>
            <UploadArea>
              <UploadLabel htmlFor="fileInput">
                <ImageIcon />
                <Text color="#36a9e0" bold type={TextTypes.Body3} tag="h4">
                  {t("profile_pic.click_to_upload")}
                </Text>
                <Text color="#A6A6A6" type={TextTypes.Body3}>
                  {t("profile_pic.drop_image")}
                </Text>
              </UploadLabel>
              <FileInput
                value={undefined}
                ref={(e) => {
                  ref(e);
                  fileInputRef.current = e;
                }}
                type="file"
                name={name}
                id="fileInput"
                onBlur={onBlur}
                onChange={(e) => {
                  onChange(e);
                  onImageUpload(e);
                }}
                accept="image/x-png, image/png, image/jpeg"
              />
              <InputError
                bottom={theme.spacing.xxxsmall}
                right={theme.spacing.xxsmall}
                left={theme.spacing.small}
                visible={!isEmpty(error)}
              >
                {t("validation.image_upload_required")}
              </InputError>
            </UploadArea>
          </SelectionPanel>
        )}
      />
      <SelectionPanel
        onClick={() => onImageSelection(IMAGE_TYPES.avatar)}
        $selected={imageType === IMAGE_TYPES.avatar}
      >
        <AvatarInfo>
          <Text bold type={TextTypes.Body3} tag="h4" color="black">
            {t("profile_pic.avatar_selection")}
          </Text>
          <ToolTip
            text={t("profile_pic.avatar_tooltip")}
            trigger={
              <Button variation={ButtonVariations.Icon} type="button">
                <QuestionIcon
                  label="questionIcon"
                  labelId="questionIcon"
                  color="#36a9e0"
                  height={16}
                  width={16}
                />
              </Button>
            }
          />
        </AvatarInfo>
        <InteractiveArea>
          <AvatarSelection>
            <Button variation={ButtonVariations.Control} onClick={onPrevAvatar} type="button">
              <ArrowLeftIcon width={6} />
            </Button>
            <div>
              <Avatar style={{ width: "8rem", height: "8rem" }} {...avatarConfig} />
            </div>
            <Button variation={ButtonVariations.Control} onClick={onNextAvatar} type="button">
              <ArrowRightIcon width={6} />
            </Button>
          </AvatarSelection>

          <Text type={TextTypes.Body3} color="#A6A6A6" center>
            {t("profile_pic.randomize_avatar")}
          </Text>
          <AvatarEditorButton
            variation={ButtonVariations.Inline}
            onClick={openAvatarEditor}
            type="button"
          >
            <PencilIcon color="#36a9e0" width={12} />
            <Text type={TextTypes.Body3} bold color="#36a9e0" tag="h4">
              {t("profile_pic.edit_avatar")}
            </Text>
          </AvatarEditorButton>
        </InteractiveArea>
      </SelectionPanel>

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
