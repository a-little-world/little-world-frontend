import {
  FacebookIcon,
  InstagramIcon,
  Link,
  Linkedin,
  Telegram,
  Whatsapp,
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
      labelId: 'instaIcon',
    },
    {
      Icon: FacebookIcon,
      url: 'https://www.facebook.com/LittleWorld.NonProfit/',
      label: 'facebook',
      labelId: 'fbIcon',
    },
    {
      Icon: Linkedin,
      url: 'https://www.linkedin.com/company/little-world/',
      label: 'linkedin',
      labelId: 'linkedinIcon',
    },
  ],
  join_groups: [
    {
      Icon: Whatsapp,
      url: 'https://chat.whatsapp.com/DDoLv0AFtHh6CEtXlKz91k',
      label: 'whatsapp',
      labelId: 'whatsappIcon',
    },
    {
      Icon: Telegram,
      url: 'https://t.me/+nhDqI57icllkMmYy',
      label: 'telegram',
      labelId: 'telegramIcon',
    },
  ],
};

const Socials = ({
  type,
  gradient,
}: {
  gradient?: string;
  type: 'social_media' | 'join_groups';
}) => {
  return (
    <SocialLinks>
      {SOCIALS_LIST[type].map(({ Icon, url, labelId, label }: any) => (
        <Link key={label} href={url} textDecoration={false}>
          <Icon labelId={labelId} label={label} gradient={gradient} />
        </Link>
      ))}
    </SocialLinks>
  );
};

export default Socials;
