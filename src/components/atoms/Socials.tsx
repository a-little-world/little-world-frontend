import {
  FacebookIcon,
  InstagramIcon,
  Link,
  LinkedinIcon,
} from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

const SocialLinks = styled.div<{
  $align: 'center' | 'flex-start' | 'flex-end';
}>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  justify-content: ${({ $align }) => $align};
`;

export const SOCIALS_LIST = {
  social_media: [
    {
      Icon: InstagramIcon,
      url: 'https://www.instagram.com/littleworld_de/',
      label: 'instagram',
    },
    {
      Icon: FacebookIcon,
      url: 'https://www.facebook.com/LittleWorld.NonProfit/',
      label: 'facebook',
    },
    {
      Icon: LinkedinIcon,
      url: 'https://www.linkedin.com/company/little-world/',
      label: 'linkedin',
    },
  ],
};

const Socials = ({
  type,
  gradient,
  align = 'center',
}: {
  align?: 'center' | 'flex-start' | 'flex-end';
  gradient?: string;
  type: 'social_media';
}) => (
  <SocialLinks $align={align}>
    {SOCIALS_LIST[type].map(({ Icon, url, label }: any) => (
      <Link key={label} href={url} textDecoration={false}>
        <Icon label={label} gradient={gradient} />
      </Link>
    ))}
  </SocialLinks>
);

export default Socials;
