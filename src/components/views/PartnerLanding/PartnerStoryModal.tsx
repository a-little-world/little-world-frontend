import {
  CardFooter,
  CardSizes,
  Link,
  Modal,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import { WP_HOME_ROUTE } from '../../../router/routes';
import {
  AvatarStack,
  InitialsAvatar,
  PhotoAvatar,
  StoryModalBody,
  StoryModalCard,
  StoryModalHeader,
  StoryModalHeading,
  StoryModalKicker,
  StoryModalParagraph,
  StoryModalSection,
  StoryModalTitle,
} from './PartnerLanding.styles';

export type PartnerStoryPerson = {
  name: string;
  letter: string;
  tone: 'bold' | 'highlight';
  photo?: string;
};

type PartnerStoryModalProps = {
  storyKey: string | null;
  people: PartnerStoryPerson[];
  onClose: () => void;
};

const STORY_SECTIONS: Record<
  string,
  ReadonlyArray<{ id: string; hasHeading?: boolean }>
> = {
  jamal_monika: [
    { id: 'intro' },
    { id: 'intensive', hasHeading: true },
    { id: 'fun', hasHeading: true },
  ],
  fazal_joerg: [
    { id: 'intro' },
    { id: 'digital', hasHeading: true },
    { id: 'perspectives', hasHeading: true },
    { id: 'time', hasHeading: true },
  ],
};

const STORIES_BLOG_HREF = `${WP_HOME_ROUTE}/stories/`;

const splitParagraphs = (value: string) =>
  value
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

export const StoryAvatars = ({ people }: { people: PartnerStoryPerson[] }) => (
  <AvatarStack>
    {people.map(person =>
      person.photo ? (
        <PhotoAvatar
          key={person.name}
          src={person.photo}
          alt={person.name}
          $size="large"
        />
      ) : (
        <InitialsAvatar key={person.name} $size="large" $tone={person.tone}>
          {person.letter}
        </InitialsAvatar>
      ),
    )}
  </AvatarStack>
);

const PartnerStoryModal = ({
  storyKey,
  people,
  onClose,
}: PartnerStoryModalProps) => {
  const { t } = useTranslation();
  const sections = storyKey ? STORY_SECTIONS[storyKey] : undefined;

  return (
    <Modal open={Boolean(storyKey)} onClose={onClose}>
      {storyKey && sections ? (
        <StoryModalCard width={CardSizes.Large}>
          <StoryModalHeader asContainer align="flex-start">
            <StoryAvatars people={people} />
            <StoryModalTitle>
              {t(`partner_landing.stories.${storyKey}.article.title`)}
            </StoryModalTitle>
            <StoryModalKicker>
              {t(`partner_landing.stories.${storyKey}.article.kicker`)}
            </StoryModalKicker>
          </StoryModalHeader>
          <StoryModalBody align="flex-start">
            {sections.map(section => (
              <StoryModalSection key={section.id}>
                {section.hasHeading ? (
                  <StoryModalHeading>
                    {t(
                      `partner_landing.stories.${storyKey}.article.${section.id}.heading`,
                    )}
                  </StoryModalHeading>
                ) : null}
                {splitParagraphs(
                  t(
                    `partner_landing.stories.${storyKey}.article.${section.id}.body`,
                  ),
                ).map(paragraph => (
                  <StoryModalParagraph key={paragraph}>
                    {paragraph}
                  </StoryModalParagraph>
                ))}
              </StoryModalSection>
            ))}
          </StoryModalBody>
          <CardFooter align="flex-start">
            <Link href={STORIES_BLOG_HREF} target="_blank" rel="noreferrer">
              {t('partner_landing.stories.more_on_blog')}
            </Link>
          </CardFooter>
        </StoryModalCard>
      ) : null}
    </Modal>
  );
};

export default PartnerStoryModal;
