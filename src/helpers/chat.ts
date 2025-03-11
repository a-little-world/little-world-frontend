
import {
  AttachmentWidget,
  CallWidget,
} from '@a-little-world/little-world-design-system';
import { initCallSetup } from '../features/userData.js';
import { AppDispatch } from '../app/store.js';


interface Message {
  sender: string;
}

interface ActiveChat {
  partner: {
    id: string;
  };
}

interface CustomChatElement {
  Component: React.ComponentType<any>;
  tag: string;
  props?: Record<string, any>;
}

interface GetCustomChatElementsParams {
  dispatch?: AppDispatch;
  isPreview?: boolean;
  message: Message;
  userId: string;
  activeChat?: ActiveChat;
}

export const getCustomChatElements = ({
  dispatch,
  isPreview,
  message,
  userId,
  activeChat,
}: GetCustomChatElementsParams): CustomChatElement[] => {
  const customChatElements = [
    {
      Component: CallWidget,
      tag: 'MissedCallWidget',
      props: {
        isMissed: true,
        isPreview,
        header:
          message.sender !== userId ? 'Anruf Verpasst' : 'Nicht beantwortet',
        description:
          message.sender !== userId ? 'Zurück Rufen' : 'Erneut anrufen',
        isOutgoing: message.sender === userId,
        onReturnCall: isPreview
          ? undefined
          : () => dispatch?.(initCallSetup({ userId: message.sender === userId
            ? activeChat?.partner?.id
            : message.sender })),
      },
    },
    {
      Component: CallWidget,
      tag: 'CallWidget',
      props: {
        isMissed: false,
        isPreview,
        header: 'Video Anruf',
        isOutgoing: message.sender === userId,
        onReturnCall: isPreview
          ? undefined
          : () => dispatch?.(initCallSetup({ userId: message.sender === userId
            ? activeChat?.partner?.id
            : message.sender })),
      },
    },
    {
      Component: AttachmentWidget,
      tag: 'AttachmentWidget',
      props: { isPreview },
    },
  ];
  return customChatElements;
};

const MAX_FILE_NAME_LENGTH = 15;

export const formatFileName = (fileName: string): string => {
  // Extract file extension (if any)
  const lastDotIndex = fileName.lastIndexOf('.');
  const hasExtension = lastDotIndex !== -1;
  
  const name = hasExtension ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = hasExtension ? fileName.substring(lastDotIndex) : '';
  
  if (name.length <= MAX_FILE_NAME_LENGTH) {
    return fileName;
  }
  
  // Calculate how many characters to keep on each side
  const endChars = Math.floor((MAX_FILE_NAME_LENGTH - 3) / 2); // 3 for the ellipsis
  const beginningChars = Math.ceil((MAX_FILE_NAME_LENGTH - 3) / 2); // Give an extra char to the start if needed
  
  const shortenedName = 
    `${name.substring(0, beginningChars)}...${name.substring(name.length - endChars)}`;
  
  return shortenedName + extension;
}

export const messageContainsWidget = (message: string): boolean =>
  /AttachmentWidget|CallWidget/.test(message);
