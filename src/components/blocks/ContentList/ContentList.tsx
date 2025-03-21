import {
  Button,
  ButtonSizes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { map } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ContentListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

const ListItem = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.xxsmall};
  padding: ${({ theme }) => theme.spacing.small};
  align-items: flex-start;
  justify-content: flex-start;
  height: auto;
  cursor: pointer;
  text-decoration: none;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    flex-direction: row;
  }
`;

const ImageWrapper = styled.div`
  max-height: 100%;
  max-width: min(40%, 280px);
  background: #263850;
  border: 1px solid ${({ theme }) => theme.color.border.minimal};
  border-radius: ${({ theme }) => theme.radius.small};
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemImage = styled.img`
  height: auto;
  max-height: 100%;
  width: 100%;
  object-fit: contain;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  flex: 1;
  flex-grow: 1;
`;

const ListItemCta = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.small};
`;

interface ContentListItemProps {
  item: {
    image: string;
    altImage: string;
    title: string;
    description: string;
    bio: string;
    link: string;
    linkText: string;
  };
}

const ContentListItem = ({ item }: ContentListItemProps) => {
  const { t } = useTranslation();
  return (
    <ListItem to={item.link}>
      <ImageWrapper>
        <ItemImage src={item.image} alt={item.altImage} />
      </ImageWrapper>
      <Info>
        <Text tag="h3" type={TextTypes.Heading5}>
          {t(item.title)}
        </Text>
        <Text>{t(item.description)}</Text>
        <Text>{t(item.bio)}</Text>
        <ListItemCta size={ButtonSizes.Small}>{t(item.linkText)}</ListItemCta>
      </Info>
    </ListItem>
  );
};

interface ContentListProps {
  content: any[] | { [key: string]: any };
}

const ContentList = ({ content }: ContentListProps) => {
  return (
    <ContentListContainer>
      {map(content, item => (
        <ContentListItem item={item} key={item.title} />
      ))}
    </ContentListContainer>
  );
};

export default ContentList;
