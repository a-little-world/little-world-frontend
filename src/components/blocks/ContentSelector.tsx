import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  Link,
} from '@a-little-world/little-world-design-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { useDevelopmentFeaturesStore } from '../../features/stores/index';
import HideOnMobile from '../atoms/HideOnMobile';
import NotificationBell from '../atoms/NotificationBell';

const SelectorWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Selector = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  overflow-x: auto;
  overflow-y: hidden;
  text-wrap: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.border.moderate};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) =>
    theme.color.border.bold || 'rgba(0, 0, 0, 0.3)'};
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.color.border.moderate} transparent;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      display: flex;
    }

    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
      border: 1px solid ${theme.color.border.subtle};
      border-radius: ${theme.radius.xlarge};
      box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
    }
  `}
`;

const FadeOverlay = styled.div<{ $side: 'left' | 'right'; $visible: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.2s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

  ${({ $side, theme }) => {
    if ($side === 'left') {
      return css`
        left: 0;
        width: ${theme.spacing.xlarge};
        background: linear-gradient(
          to right,
          ${theme.color.surface.primary},
          transparent
        );
      `;
    }
    return css`
      right: 0;
      width: ${theme.spacing.massive};
      background: linear-gradient(
        to left,
        ${theme.color.surface.primary},
        transparent
      );
    `;
  }}

  ${({ $side, theme }) => {
    const borderRadius =
      $side === 'left'
        ? `${theme.radius.xlarge} 0 0 ${theme.radius.xlarge}`
        : `0 ${theme.radius.xlarge} ${theme.radius.xlarge} 0`;
    return css`
      @media (min-width: ${theme.breakpoints.medium}) {
        width: ${theme.spacing.xxlarge};
        border-radius: ${borderRadius};
      }
    `;
  }}
`;

export const StyledOption = styled(Button) <{ $selected?: boolean }>`
  border-color: transparent;
  transition: none;
  flex-shrink: 0;
  order: ${({ $selected }) => ($selected ? -1 : 0)};

  ${({ theme, variation }) =>
    variation === ButtonVariations.Inline &&
    css`
      margin: 0 ${theme.spacing.xsmall};
      color: ${theme.color.text.link};

      @media (min-width: ${theme.breakpoints.medium}) {
        margin: 0 ${theme.spacing.small};
      }
    `};

  ${({ theme, $selected }) =>
    $selected &&
    css`
      background: ${theme.color.gradient.blue10};
      &:disabled {
        color: ${theme.color.text.button};
        border: none;
        background: ${theme.color.gradient.blue10};
      }
    `}

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      order: 0;
    }
  `};
`;

export const StyledLink = styled(Link)`
  margin: 0 ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxxxsmall} 0;
`;

const StyledHideOnMobile = styled(HideOnMobile)`
  margin-left: auto;
`;

const nbtTopics: Record<string, string[]> = {
  ourWorld: ['support', 'donate', 'about', 'stories'],
  main: ['conversation_partners', 'events', 'random_calls'],
  help: ['contact', 'faqs'],
  resources: ['trainings', 'german', 'beginners', 'story', 'partners'],
};

const externalLinksTopics: Record<string, string> = {
  about: 'https://home.little-world.com/ueber-uns',
  stories: 'https://home.little-world.com/stories',
};

type ContentSelectorUse = 'ourWorld' | 'main' | 'help' | 'resources';

type ContentSelectorProps = {
  disableIfSelected?: boolean;
  selection?: string;
  setSelection: (selection: string) => void;
  use: ContentSelectorUse;
  excludeTopics?: string[];
};

function ContentSelector({
  disableIfSelected = true,
  selection,
  setSelection,
  use,
  excludeTopics,
}: ContentSelectorProps) {
  const { t } = useTranslation();
  const areDevFeaturesEnabled = useDevelopmentFeaturesStore().enabled;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  const checkScrollPosition = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for rounding errors
    const isScrollable = scrollWidth > clientWidth;

    setShowLeftFade(!isAtStart && isScrollable);
    setShowRightFade(!isAtEnd && isScrollable);
  }, []);

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (rafIdRef.current !== null) {
      return;
    }

    rafIdRef.current = requestAnimationFrame(() => {
      checkScrollPosition();
      rafIdRef.current = null;
    });
  }, [checkScrollPosition]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return undefined;
    }

    // Check initial state using requestAnimationFrame for better timing
    const initialCheckId = requestAnimationFrame(checkScrollPosition);

    // Add scroll listener with throttling
    scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    // Check on resize (content might change) - with fallback for older browsers
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(checkScrollPosition);
      resizeObserver.observe(scrollElement);
    }

    return () => {
      cancelAnimationFrame(initialCheckId);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      scrollElement.removeEventListener('scroll', handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [checkScrollPosition, handleScroll, use]);

  const topics = nbtTopics[use].filter(
    topic => !excludeTopics?.includes(topic)
  );

  return (
    <SelectorWrapper>
      <FadeOverlay $side="left" $visible={showLeftFade} />
      <FadeOverlay $side="right" $visible={showRightFade} />
      <Selector ref={scrollRef}>
        {topics.map((topic: string) =>
          externalLinksTopics[topic] ? (
            <StyledLink key={topic} href={externalLinksTopics[topic]}>
              {t(`nbt_${topic}`)}
            </StyledLink>
          ) : (
            <StyledOption
              variation={
                selection === topic
                  ? ButtonVariations.Basic
                  : ButtonVariations.Inline
              }
              appearance={
                selection === topic
                  ? ButtonAppearance.Primary
                  : ButtonAppearance.Secondary
              }
              key={topic}
              onClick={() => setSelection(topic)}
              disabled={selection === topic && disableIfSelected}
              $selected={selection === topic}
            >
              {t(`nbt_${topic}`)}
            </StyledOption>
          ),
        )}
        {areDevFeaturesEnabled && (
          <StyledHideOnMobile>
            <NotificationBell />
          </StyledHideOnMobile>
        )}
      </Selector>
    </SelectorWrapper>
  );
}

export default ContentSelector;
