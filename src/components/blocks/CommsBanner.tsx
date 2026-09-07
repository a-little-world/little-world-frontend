import {
  Banner,
  BannerTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../api/endpoints';

function CommsBanner() {
  const banner = useSWR(USER_ENDPOINT).data?.banner;
  if (isEmpty(banner)) return null;

  return (
    <Banner
      type={banner.type === 'large' ? BannerTypes.Large : BannerTypes.Small}
      title={banner.title}
      description={banner.text}
      textColor={banner.text_color}
      background={banner.background}
      image={banner.image || undefined}
      imageAlt={banner.image_alt}
      primaryCtaColor={banner.cta_1_color || undefined}
      primaryCtaText={banner.cta_1_text || undefined}
      primaryCtaUrl={banner.cta_1_url || undefined}
      secondaryCtaColor={banner.cta_2_color || undefined}
      secondaryCtaText={banner.cta_2_text || undefined}
      secondaryCtaUrl={banner.cta_2_url || undefined}
    />
  );
}

export default CommsBanner;
