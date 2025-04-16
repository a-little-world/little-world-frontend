import {
  Button,
  ButtonVariations,
  Text,
} from '@a-little-world/little-world-design-system';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

interface ShowMoreTextProps {
  text: string;
  maxLength?: number;
}

const ShowMoreText: React.FC<ShowMoreTextProps> = ({
  text,
  maxLength = 200,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = text.length > maxLength;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedText = useMemo(
    () => (needsTruncation ? `${text.slice(0, maxLength)}...` : text),
    [text, maxLength, needsTruncation],
  );

  return (
    <>
      <Text>{isExpanded ? text : truncatedText}</Text>
      {needsTruncation && (
        <Button
          color={theme.color.text.link}
          variation={ButtonVariations.Inline}
          onClick={toggleExpanded}
        >
          {t(`community_events.show_${isExpanded ? 'less' : 'more'}`)}
        </Button>
      )}
    </>
  );
};

export default ShowMoreText;
