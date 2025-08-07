import {
  FacebookIcon,
  InstagramIcon,
  Link,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
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
  join_groups: [
    {
      Icon: WhatsappIcon,
      url: 'https://chat.whatsapp.com/DDoLv0AFtHh6CEtXlKz91k',
      label: 'whatsapp',
    },
    {
      Icon: TelegramIcon,
      url: 'https://t.me/+nhDqI57icllkMmYy',
      label: 'telegram',
    },
  ],
};

const Socials = ({
  type,
  gradient,
}: {
  gradient?: string;
  type: 'social_media' | 'join_groups';
}) => (
  <SocialLinks>
    {SOCIALS_LIST[type].map(({ Icon, url, label }: any) => (
      <Link key={label} href={url} textDecoration={false}>
        <Icon label={label} gradient={gradient} />
      </Link>
    ))}
  </SocialLinks>
);

export default Socials;
