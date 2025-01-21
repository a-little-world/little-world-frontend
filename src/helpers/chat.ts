import {
  AttachmentWidget,
  CallWidget,
} from '@a-little-world/little-world-design-system';

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
  isPreview?: boolean;
  message: Message;
  userId: string;
  activeChat?: ActiveChat;
}

export const getCustomChatElements = ({
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
        returnCallLink: isPreview
          ? undefined
          : `/call-setup/${
              message.sender === userId
                ? activeChat?.partner?.id
                : message.sender
            }`,
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
        returnCallLink: isPreview
          ? undefined
          : `/call-setup/${
              message.sender === userId
                ? activeChat?.partner?.id
                : message.sender
            }`,
      },
    },
    {
      Component: AttachmentWidget,
      tag: 'AttachmentWidget',
      isPreview,
    },
  ];
  return customChatElements;
};

export const messageContainsWidget = (message: string): boolean =>
  /AttachmentWidget|CallWidget/.test(message);
