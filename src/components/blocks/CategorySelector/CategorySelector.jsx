import {
  ProfileIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  CategoryNote,
  CategorySelectorWrapper,
  SelectionPanel,
  TextSection,
} from './styles';

const CategorySelector = ({ categories, onUpdate }) => {
  const [panelSelected, setPanelSelected] = useState(null);

  const userData = useSelector(state => state.userData.user.profile);

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
          <ProfileIcon
            label={category.value}
            labelId={category.tag}
            color={category.color}
          />
          <TextSection>
            <Text type={TextTypes.Body4} bold color={category.color} tag="h4">
              {category.label}
            </Text>
            <Text type={TextTypes.Body5}>{category.description}</Text>
            <CategoryNote type={TextTypes.Body6} tag="h4" color="#A6A6A6">
              {category.note}
            </CategoryNote>
          </TextSection>
        </SelectionPanel>
      ))}
    </CategorySelectorWrapper>
  );
};

export default CategorySelector;
