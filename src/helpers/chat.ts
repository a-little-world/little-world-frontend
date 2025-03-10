
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
export const processFileName = (fileName: string): string => fileName.length > MAX_FILE_NAME_LENGTH ? `${fileName.slice(0, MAX_FILE_NAME_LENGTH).trim()}...` : fileName;

export const messageContainsWidget = (message: string): boolean =>
  /AttachmentWidget|CallWidget/.test(message);
