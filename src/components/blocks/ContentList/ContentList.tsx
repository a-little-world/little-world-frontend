import {
  ButtonSizes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { map } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  ContentListContainer,
  ImageWrapper,
  Info,
  ItemImage,
  ListItem,
  ListItemCta,
} from './ContentList.styles.tsx';

export enum ContentListLayouts {
  Stacked = 'Stacked',
  SideBySide = 'SideBySide',
}

type ItemType = {
  title: string;
  description: string;
  bio?: string;
  link: string;
  linkText: string;
  image: string;
  altImage: string;
};

interface ContentListItemProps {
  item: ItemType;
  layout: ContentListLayouts;
}

const ContentListItem = ({ item, layout }: ContentListItemProps) => {
  const { t } = useTranslation();

  return (
    <ListItem to={item.link} $layout={layout}>
      <ImageWrapper $layout={layout}>
        <ItemImage src={item.image} alt={item.altImage} $layout={layout} />
      </ImageWrapper>
      <Info>
        <Text tag="h3" type={TextTypes.Heading5}>
          {t(item.title)}
        </Text>
        <Text>{t(item.description)}</Text>
        {item.bio && <Text>{t(item.bio)}</Text>}
        <ListItemCta size={ButtonSizes.Small}>{t(item.linkText)}</ListItemCta>
      </Info>
    </ListItem>
  );
};

interface ContentListProps {
  content: ItemType[];
  itemLayout?: ContentListLayouts;
}

const ContentList = ({
  content,
  itemLayout = ContentListLayouts.SideBySide,
}: ContentListProps) => (
  <ContentListContainer $layout={itemLayout}>
    {map(content, item => (
      <ContentListItem item={item} key={item.title} layout={itemLayout} />
    ))}
  </ContentListContainer>
);

export default ContentList;
