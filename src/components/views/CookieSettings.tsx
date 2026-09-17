import { useEffect, useState } from 'react';

import {
  Accordion,
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSizes,
  Loading,
  LoadingSizes,
  StatusMessage,
  StatusTypes,
  Switch,
  Tag,
  TagAppearance,
  Text,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import {
  COOKIE_SETTINGS_ENDPOINT,
  CookieGroupInfo,
  CookiePreferences,
  fetchCookieSettings,
  updateCookieSettings,
} from '../../api/cookies';

const SHOW_BANNER_COOKIE_NAME = 'cookieSelectionDone';
const SHARED_COOKIE_DOMAIN = '.little-world.com';

const markSelectionDone = () => {
  const isProductionHost =
    window.location.hostname.endsWith('little-world.com');
  Cookies.set(SHOW_BANNER_COOKIE_NAME, '1', {
    domain: isProductionHost ? SHARED_COOKIE_DOMAIN : undefined,
    expires: 30,
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  });
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.medium};
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`;

const GroupDescription = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CookieDetails = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xsmall};
  justify-content: center;
`;

const groupText = (
  t: (key: string, options?: Record<string, unknown>) => string,
  group: CookieGroupInfo,
  field: 'name' | 'description',
) =>
  t(`cookies.groups.${group.varname}.${field}`, { defaultValue: group[field] });

const CookieGroupCard = ({
  group,
  checked,
  onToggle,
}: {
  group: CookieGroupInfo;
  checked: boolean;
  onToggle: (varname: string, value: boolean) => void;
}) => {
  const { t } = useTranslation();
  const title = groupText(t, group, 'name');
  const description = groupText(t, group, 'description');

  return (
    <Card width={CardSizes.Medium}>
      <CardHeader asContainer>
        <GroupHeader>
          <Text tag="h3" bold>
            {title}
          </Text>
          {group.is_required && (
            <Tag appearance={TagAppearance.outline}>
              {t('cookies.required_badge')}
            </Tag>
          )}
        </GroupHeader>
      </CardHeader>
      <CardContent align="stretch" scrollable={false}>
        {description && <GroupDescription>{description}</GroupDescription>}
        <Switch
          id={group.varname}
          name={group.varname}
          label={t('cookies.group_toggle')}
          checked={group.is_required ? true : checked}
          disabled={group.is_required}
          onCheckedChange={value => onToggle(group.varname, value)}
        />
        {group.cookies.length > 0 && (
          <Accordion
            items={group.cookies.map(cookie => ({
              header: cookie.name,
              content: (
                <>
                  {cookie.description && (
                    <CookieDetails>{cookie.description}</CookieDetails>
                  )}
                  <CookieDetails>
                    {cookie.domain}
                    {cookie.path}
                  </CookieDetails>
                </>
              ),
            }))}
          />
        )}
      </CardContent>
    </Card>
  );
};

const CookieSettings = () => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<CookiePreferences>({});
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    COOKIE_SETTINGS_ENDPOINT,
    fetchCookieSettings,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (!data?.groups) return;
    const seeded: CookiePreferences = {};
    data.groups.forEach(group => {
      if (!group.is_required) {
        seeded[group.varname] = group.state === 'accepted';
      }
    });
    setPreferences(seeded);
  }, [data]);

  const save = async (next: CookiePreferences) => {
    setSaving(true);
    setSaved(false);
    setSaveFailed(false);
    try {
      await updateCookieSettings(next);
      markSelectionDone();
      await mutate();
      setSaved(true);
    } catch (_e) {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (varname: string, value: boolean) => {
    setSaved(false);
    setSaveFailed(false);
    setPreferences(current => ({ ...current, [varname]: value }));
  };

  const optionalGroups = data?.groups.filter(group => !group.is_required) || [];

  const setAll = (value: boolean) => {
    const next: CookiePreferences = {};
    optionalGroups.forEach(group => {
      next[group.varname] = value;
    });
    setPreferences(next);
    save(next);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loading size={LoadingSizes.Medium} />
      </Wrapper>
    );
  }

  if (error || !data) {
    return (
      <Wrapper>
        <Card width={CardSizes.Medium}>
          <StatusMessage visible type={StatusTypes.Error}>
            {t('cookies.error')}
          </StatusMessage>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Text tag="h2" bold>
        {t('cookies.title')}
      </Text>
      <Text>{t('cookies.intro')}</Text>
      {data.groups.map(group => (
        <CookieGroupCard
          key={group.varname}
          group={group}
          checked={preferences[group.varname] ?? false}
          onToggle={handleToggle}
        />
      ))}
      <Card width={CardSizes.Medium}>
        <CardFooter align="center">
          <StatusMessage visible={saved} type={StatusTypes.Success}>
            {t('cookies.saved')}
          </StatusMessage>
          <StatusMessage visible={saveFailed} type={StatusTypes.Error}>
            {t('cookies.error')}
          </StatusMessage>
          <Actions>
            <Button
              appearance={ButtonAppearance.Secondary}
              variation={ButtonVariations.Basic}
              size={ButtonSizes.Medium}
              onClick={() => setAll(false)}
              disabled={saving}
            >
              {t('cookies.decline_all')}
            </Button>
            <Button
              appearance={ButtonAppearance.Secondary}
              variation={ButtonVariations.Basic}
              size={ButtonSizes.Medium}
              onClick={() => setAll(true)}
              disabled={saving}
            >
              {t('cookies.accept_all')}
            </Button>
            <Button
              appearance={ButtonAppearance.Primary}
              variation={ButtonVariations.Basic}
              size={ButtonSizes.Medium}
              onClick={() => save(preferences)}
              loading={saving}
              disabled={saving}
            >
              {t('cookies.save')}
            </Button>
          </Actions>
        </CardFooter>
      </Card>
    </Wrapper>
  );
};

export default CookieSettings;
