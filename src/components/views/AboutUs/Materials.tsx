import {
  Card,
  CardContent,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

const POSTER_LINK =
  'https://home.little-world.com/wp-content/uploads/2026/07/Home-print-version-Poster-LW.pdf';
const PRESENTATION_LINK = 'https://canva.link/coilm6mm19t47ur';
const MINI_GUIDE_LINK =
  'https://home.little-world.com/wp-content/uploads/2026/07/Mini-Guide-um-Little-World-mit-anderen-zu-teilen.pdf';
const MATERIAL_PACK_FORM = 'https://forms.gle/Kmm6vJRW99nbTu1F8';

const ContentCard = styled(Card)`
  display: flex;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => `@media (min-width: ${theme.breakpoints.medium}) {
    gap: ${theme.spacing.medium};
  }`}
`;

const Container = styled(CardContent)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => `@media (min-width: ${theme.breakpoints.medium}) {
    flex-direction: row;
  }`}
`;

const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Segment = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px dashed ${({ theme }) => theme.color.border.subtle};
  gap: ${({ theme }) => theme.spacing.xsmall};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Description = styled(Text)`
  max-width: 400px;
`;

const SegmentLink = styled(Link)`
  width: fit-content;
`;

const SECTIONS: { key: string; href?: string }[] = [
  { key: 'miniguide', href: MINI_GUIDE_LINK },
  { key: 'material_pack', href: MATERIAL_PACK_FORM },
  { key: 'poster', href: POSTER_LINK },
  { key: 'overview', href: PRESENTATION_LINK },
];

const MaterialsSegment = ({
  sectionKey,
  href,
}: {
  sectionKey: string;
  href?: string;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const description = t(`materials.${sectionKey}.description`, {
    defaultValue: '',
  });

  return (
    <Segment>
      <Text type={TextTypes.Heading6} color={theme.color.text.title}>
        {t(`materials.${sectionKey}.title`)}
      </Text>
      {description && <Text>{description}</Text>}
      <SegmentLink href={href} target="_blank">
        {t(`materials.${sectionKey}.link_text`)}
      </SegmentLink>
    </Segment>
  );
};

const Materials: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <ContentCard>
      <Text tag="h1" type={TextTypes.Heading4} color={theme.color.text.title}>
        {t('materials.title')}
      </Text>
      <Container align="flex-start">
        <Description>{t('materials.description')}</Description>
        <Sections>
          {SECTIONS.map(({ key, href }) => (
            <MaterialsSegment key={key} sectionKey={key} href={href} />
          ))}
        </Sections>
      </Container>
    </ContentCard>
  );
};

export default Materials;
