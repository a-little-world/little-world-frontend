import {
  ButtonSizes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  ContentListContainer,
  ContentListLayouts,
  ImageWrapper,
  Info,
  ItemBadge as ItemBadgeEl,
  ItemBadgeType,
  ItemImage,
  ListItem,
  ListItemCta,
} from './ContentList.styles';

export type ItemBadgeMeta = {
  type: ItemBadgeType;
  label: string;
};

export type ItemType = {
  title: string;
  description: string;
  bio?: string;
  link: string;
  linkText: string;
  image?: string;
  altImage?: string;
  badge?: ItemBadgeMeta;
};

interface ContentListItemProps {
  item: ItemType;
  layout: ContentListLayouts;
}

const BADGE_ICONS: Record<ItemBadgeType, string> = {
  interactive: '◆',
  video: '▶',
};

const ContentListItem = ({ item, layout }: ContentListItemProps) => {
  const { t } = useTranslation();

  return (
    <ListItem to={item.link} $layout={layout}>
      {item.image && (
        <ImageWrapper $layout={layout}>
          <ItemImage
            src={item.image}
            alt={item.altImage ?? ''}
            $layout={layout}
          />
        </ImageWrapper>
      )}
      <Info>
        <Text tag="h3" type={TextTypes.Heading5}>
          {t(item.title)}
        </Text>
        {item.badge && (
          <ItemBadgeEl $type={item.badge.type}>
            {BADGE_ICONS[item.badge.type]} {t(item.badge.label)}
          </ItemBadgeEl>
        )}
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
