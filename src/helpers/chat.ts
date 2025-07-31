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
  initCallSetup?: (data: { userId: string }) => void;
  isPreview?: boolean;
  message: Message;
  userId: string;
  activeChat?: ActiveChat;
  inCall?: boolean;
}

export const getCustomChatElements = ({
  initCallSetup,
  isPreview,
  message,
  userId,
  activeChat,
  inCall,
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
        onReturnCall:
          isPreview || inCall
            ? undefined
            : () => {
                const targetUserId =
                  message.sender === userId
                    ? activeChat?.partner?.id
                    : message.sender;
                if (targetUserId) {
                  initCallSetup?.({ userId: targetUserId });
                }
              },
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
        onReturnCall:
          isPreview || inCall
            ? undefined
            : () => {
                const targetUserId =
                  message.sender === userId
                    ? activeChat?.partner?.id
                    : message.sender;
                if (targetUserId) {
                  initCallSetup?.({ userId: targetUserId });
                }
              },
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

  const shortenedName = `${name.substring(
    0,
    beginningChars,
  )}...${name.substring(name.length - endChars)}`;

  return shortenedName + extension;
};

export const messageContainsWidget = (message: string): boolean =>
  /AttachmentWidget|CallWidget/.test(message);

export const processAttachmentWidgets = (message: any, t: any): string => {
  let processedMessageText = message.text;

  if (message.parsable && messageContainsWidget(message.text)) {
    // Simple check: if the widget JSON is malformed, replace with error message
    const widgetStartTag = '<AttachmentWidget ';
    const widgetEndTag = ' ></AttachmentWidget>';

    const widgetStart = message.text.indexOf(widgetStartTag);
    const widgetEnd = message.text.indexOf(widgetEndTag);

    if (widgetStart !== -1 && widgetEnd > widgetStart) {
      const jsonStart = widgetStart + widgetStartTag.length;
      const jsonPart = message.text.substring(jsonStart, widgetEnd);

      try {
        // Try to parse the JSON - if it works, use as-is
        JSON.parse(jsonPart);
      } catch (_e) {
        // JSON is malformed, replace entire widget with error message
        const errorMessage = t('chat.attachment_parse_error');
        processedMessageText = message.text.replace(
          message.text.substring(widgetStart, widgetEnd + widgetEndTag.length),
          errorMessage,
        );
      }
    }
  }

  return processedMessageText;
};

// Test function to generate a message with problematic characters for testing
export const getTestMessageWithUnescapedCharacters =
  (): string => `Hello! Here's a test message with lots of "quotes" and 'single quotes' and some \\ backslashes.
Also newlines:
Line 1
Line 2

And special chars: @#$%^&*(){}[]|\\:;"'<>,.?/~\`!

JSON-like structure that's NOT a widget: {"key": "value with "nested quotes" and \\ backslashes"}

More text with "mixed quotes' and other weird & characters = test + more / less < greater > symbols.

End of test message.`;
