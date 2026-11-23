import { Fragment, useState } from 'react';

import {
  Button,
  ButtonVariations,
  Checkbox,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { DeviceInfo, getDeviceInfo } from '../../../device-info';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

const DetailList = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing.xxxsmall}
    ${({ theme }) => theme.spacing.xsmall};
  margin: 0;

  dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
`;

function DeviceInfoOption({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>();

  const toggleDetails = async () =>
    setDeviceInfo(deviceInfo ? undefined : await getDeviceInfo());

  return (
    <Container>
      <Checkbox
        id="feedback_device_info"
        label={t('help.feedback.device_info.label')}
        checked={checked}
        onCheckedChange={value => onCheckedChange(value === true)}
        required={false}
      />
      <Button variation={ButtonVariations.Inline} onClick={toggleDetails}>
        {t(
          deviceInfo
            ? 'help.feedback.device_info.hide'
            : 'help.feedback.device_info.show',
        )}
      </Button>
      {deviceInfo && (
        <DetailList>
          {Object.entries(deviceInfo)
            .filter(([, value]) => value)
            .map(([key, value]) => (
              <Fragment key={key}>
                <dt>
                  <Text
                    type={TextTypes.Body6}
                    color={theme.color.text.tertiary}
                    tag="span"
                  >
                    {t(`help.feedback.device_info.${key}`, key)}
                  </Text>
                </dt>
                <dd>
                  <Text type={TextTypes.Body6} tag="span">
                    {value}
                  </Text>
                </dd>
              </Fragment>
            ))}
        </DetailList>
      )}
    </Container>
  );
}

export default DeviceInfoOption;
