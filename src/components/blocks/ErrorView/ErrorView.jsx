import { Button, Card, Text, TextTypes } from "@a-little-world/little-world-design-system";
import { ButtonSizes } from "@a-little-world/little-world-design-system/dist/esm/components/Button/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { getAppRoute } from "../../../routes";
import Layout from "../Layout/AppLayout";

const ErrorCard = styled(Card)`
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxlarge};
  gap: ${({ theme }) => theme.spacing.large};
  max-width: 800px;
  max-height: 320px;
  margin: 0 auto;
`;

const RouterError = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Layout>
      <ErrorCard>
        <Text type={TextTypes.Heading2}>{t("error_view.title")}</Text>
        <Button size={ButtonSizes.Large} onClick={() => navigate(getAppRoute(""))}>
          {t("error_view.button")}
        </Button>
      </ErrorCard>
    </Layout>
  );
};

export default RouterError;
