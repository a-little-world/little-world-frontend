import {
  DragEvent,
  FocusEventHandler,
  MouseEvent,
  Ref,
  useId,
  useRef,
  useState,
} from 'react';

import {
  ImageIcon,
  ImageSearchIcon,
  Label,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { MobileUploadImage } from '../../atoms/UploadImage';
import {
  DesktopUploadIcon,
  DropZoneContainer,
  FileInput,
  FileName,
  UploadArea,
} from './FileDropzone.styles';

export enum AcceptedFiles {
  Generic = `application/pdf,.pdf,
                    application/msword,.doc,
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,
                    text/plain,.txt,
                    application/rtf,.rtf,
                    application/vnd.oasis.opendocument.text,.odt,
                    text/csv,.csv,
                    application/vnd.ms-excel,.xls,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx,
                    application/vnd.ms-powerpoint,.ppt,
                    application/vnd.openxmlformats-officedocument.presentationml.presentation,.pptx,
                    image/*,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif,.heic,.heif,
                    video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v,.3gp,
                    audio/*,.mp3,.wav,.m4a,.aac,.ogg,.oga,.flac`,
  Images = 'image/*,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.tif,.heic,.heif',
  Videos = 'video/*,.mp4,.mov,.avi,.mkv,.webm,.m4v,.3gp',
  Audio = 'audio/*,.mp3,.wav,.m4a,.aac,.ogg,.oga,.flac',
  Documents = `application/pdf,.pdf,
                    application/msword,.doc,
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,
                    text/plain,.txt,
                    application/rtf,.rtf,
                    application/vnd.oasis.opendocument.text,.odt,
                    text/csv,.csv,
                    application/vnd.ms-excel,.xls,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx,
                    application/vnd.ms-powerpoint,.ppt,
                    application/vnd.openxmlformats-officedocument.presentationml.presentation,.pptx`,
}

interface FileDropzoneProps {
  acceptedFiles?: AcceptedFiles;
  label?: string;
  dropHint?: string;
  fileRef?: Ref<HTMLInputElement>;
  multiple?: boolean;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFileChange?: (files: File[]) => void;
  onImageDelete?: (e: MouseEvent) => void;
  showSelectedFiles?: boolean;
  uploadedImage?: string | null;
}

const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (!ref) return;

  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  const mutableRef = ref as { current: T | null };
  mutableRef.current = value;
};

const matchesAcceptedFile = (file: File, acceptedFiles: string) => {
  const acceptedEntries = acceptedFiles
    .split(',')
    .map(entry => entry.trim().toLowerCase())
    .filter(Boolean);

  if (!acceptedEntries.length) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return acceptedEntries.some(entry => {
    if (entry === '*/*') {
      return true;
    }

    if (entry.startsWith('.')) {
      return fileName.endsWith(entry);
    }

    if (entry.endsWith('/*')) {
      return fileType.startsWith(entry.replace('*', ''));
    }

    return fileType === entry;
  });
};

const FileDropzone = ({
  acceptedFiles = AcceptedFiles.Generic,
  dropHint,
  fileRef,
  multiple = true,
  name,
  onFileChange,
  onBlur,
  label,
  onImageDelete,
  showSelectedFiles = true,
  uploadedImage,
}: FileDropzoneProps) => {
  const { t } = useTranslation();
  const [filenames, setFilenames] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const theme = useTheme();
  const fileInputId = useId();
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const hasSelectedFiles = filenames.length > 0 || Boolean(uploadedImage);
  const ctaKey = hasSelectedFiles ? 'change_files' : 'click_to_upload';

  const updateSelectedFiles = (files: File[]) => {
    setFilenames(files.map(file => file.name));
    onFileChange?.(files);
  };

  const normalizeFiles = (files: File[]) => {
    const filteredFiles = files.filter(file =>
      matchesAcceptedFile(file, acceptedFiles),
    );

    return multiple ? filteredFiles : filteredFiles.slice(0, 1);
  };

  const syncInputFiles = (files: File[]) => {
    if (!inputElementRef.current || typeof DataTransfer === 'undefined') {
      return;
    }

    const dataTransfer = new DataTransfer();

    files.forEach(file => dataTransfer.items.add(file));
    inputElementRef.current.files = dataTransfer.files;
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const fileList = normalizeFiles(Array.from(e.dataTransfer.files ?? []));

    if (fileList.length) {
      syncInputFiles(fileList);
      updateSelectedFiles(fileList);
    }

    setDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => e.preventDefault();
  const handleDragEnter = () => setDragOver(true);
  const handleDragLeave = () => setDragOver(false);

  const handleInputRef = (node: HTMLInputElement | null) => {
    inputElementRef.current = node;
    assignRef(fileRef, node);
  };

  const handleChange = () => {
    updateSelectedFiles(
      normalizeFiles(Array.from(inputElementRef.current?.files ?? [])),
    );
  };

  const handleImageDelete = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFilenames([]);

    if (inputElementRef.current) {
      inputElementRef.current.value = '';
    }

    onFileChange?.([]);
    onImageDelete?.(e);
  };

  return (
    <DropZoneContainer>
      {label && <Label bold>{label}</Label>}
      <UploadArea
        $dragging={dragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        htmlFor={fileInputId}
      >
        <FileInput
          type="file"
          id={fileInputId}
          ref={handleInputRef}
          multiple={multiple}
          accept={acceptedFiles}
          name={name}
          onBlur={onBlur}
          onChange={handleChange}
        />

        <MobileUploadImage
          fileInputRef={inputElementRef}
          icon={
            <ImageSearchIcon
              label="file input icon"
              width={56}
              height={56}
              color={theme.color.text.accent}
            />
          }
          onImageDelete={handleImageDelete}
          uploadedImage={uploadedImage}
        />
        <DesktopUploadIcon label="file input icon" width={56} height={56} />
        <Text
          color={theme.color.text.accent}
          bold
          type={TextTypes.Body5}
          tag="h4"
        >
          {t(`file_upload.${ctaKey}`)}
        </Text>
        {showSelectedFiles && filenames.length > 0 ? (
          <FileName>
            <ImageIcon label="uploaded file" width="16" height="16" />
            {filenames.map(fileName => fileName).join(', ')}
          </FileName>
        ) : (
          <Text color={theme.color.text.quaternary} type={TextTypes.Body5}>
            {dropHint || t('file_upload.drop_hint')}
          </Text>
        )}
      </UploadArea>
    </DropZoneContainer>
  );
};

export default FileDropzone;
