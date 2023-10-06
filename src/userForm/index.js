import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { getFormData } from "../api";
import RouterError from "../components/blocks/ErrorView/ErrorView";
import Form from "../components/blocks/Form/Form";
import Layout from "../components/blocks/Layout/Layout";
import Welcome from "../components/blocks/Welcome/Welcome";
import { PRODOCUTION } from "../ENVIRONMENT";
import { formPages } from "./formPages";
import { updateTranslationResources } from "./translations";

const PRODUCTION_BASENAME = "/form_v2/";

const getFormPage = ({ slug, formOptions, userData }) => {
  return formPages[slug]({ options: formOptions, userData });
};

const dataLoader = async ({ params }) => {
  const data = await getFormData();
  if (data) updateTranslationResources({ apiTranslations: data.api_translations });

  let formContent;
  try {
    formContent = getFormPage({
      slug: params.slug,
      formOptions: data?.form_options,
      userData: data?.user_data,
    });
  } catch (error) {
    console.log({ error });
    throw new Error(error);
  }

  return {
    formContent,
    userData: data?.user_data,
  };
};

const dataLoaderProd = async ({ params }) => {
  const data = await getFormData();
  if (!data) return {};

  const userData = data;
  const { translations } = window;
  const formOptions = data.options;

  updateTranslationResources({ apiTranslations: translations });
  let formContent;
  try {
    formContent = getFormPage({ slug: params.slug, formOptions, userData });
  } catch (error) {
    throw new Error(error);
  }

  return {
    formContent,
    userData,
    translations,
  };
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <RouterError />,
      children: [
        {
          path: "/",
          element: <Welcome />,
        },
        {
          path: "/:slug",
          loader: PRODOCUTION ? dataLoaderProd : dataLoader,
          element: <Form />,
        },
      ],
    },
  ],
  { basename: PRODOCUTION ? PRODUCTION_BASENAME : "/" }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
const renderApp = () =>
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );

if (!PRODOCUTION) {
  renderApp();
} else {
  // Window function registered to be called from inside a django view
  window.renderApp = renderApp;
}
