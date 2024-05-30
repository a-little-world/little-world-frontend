import "./style.css";
import React, { useState } from "react";
import AddToCalendarButtonTooltip from "./Tooltip/AddToCalendarButtonToolTip";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import {
  Button,
  ButtonVariations,
  ButtonAppearance,
  CalendarIcon
} from '@a-little-world/little-world-design-system';

const AddToCalendarWrapper = styled.div`
   align-content: center;
    position: relative;
    display: inline;
`

export default function AddToCalendarButton({ calendarEvent }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  return (
      <AddToCalendarWrapper>
        <Button
          type="button"
          variation={ButtonVariations.Circle}
          appearance={ButtonAppearance.Primary}
          onClick={handleClick}
          borderColor={theme.color.text.link}
          color={theme.color.text.link}
        >
          <CalendarIcon
            labelId="addToCalendar"
            label={t('new_translation')}
            width="20"/>
        </Button>
        {isTooltipVisible && (
          <AddToCalendarButtonTooltip calendarEvent={calendarEvent} />
        )}
      </AddToCalendarWrapper>
  );

  function handleClick(event) {
    event.preventDefault();
    setIsTooltipVisible(!isTooltipVisible);
  }
}
