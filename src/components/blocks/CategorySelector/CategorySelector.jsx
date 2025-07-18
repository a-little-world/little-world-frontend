import {
  ProfileChatIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../features/swr/index';
import {
  CategoryNote,
  CategorySelectorWrapper,
  SelectionPanel,
  TextSection,
} from './styles';

const CategorySelector = ({ categories, onUpdate }) => {
  const [panelSelected, setPanelSelected] = useState(null);

  const { data: user } = useSWR(USER_ENDPOINT);
  const userData = user?.profile;

  useEffect(() => {
    setPanelSelected(userData?.user_type);
  }, [userData]);

  const onSelection = value => {
    setPanelSelected(value);
    onUpdate(value);
  };

  return (
    <CategorySelectorWrapper>
      {categories.map(category => (
        <SelectionPanel
          key={category.label}
          onClick={() => onSelection(category.value)}
          $selected={panelSelected === category.value}
          type="button"
        >
          <ProfileChatIcon
            label={category.value}
            labelId={category.tag}
            gradient={category.gradient}
          />
          <TextSection>
            <Text type={TextTypes.Body3} bold color={category.color} tag="h4">
              {category.label}
            </Text>
            <Text type={TextTypes.Body5}>{category.description}</Text>
            <CategoryNote type={TextTypes.Body6} tag="h4">
              {category.note}
            </CategoryNote>
          </TextSection>
        </SelectionPanel>
      ))}
    </CategorySelectorWrapper>
  );
};

export default CategorySelector;
