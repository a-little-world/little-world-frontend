/* eslint-disable import/prefer-default-export */
import $ from "jquery";
import Cookies from "js-cookie";

import { BACKEND_URL } from "./ENVIRONMENT";

export const mainCompositeRequest = () => {
  return $.ajax({
    type: "POST",
    url: `${BACKEND_URL}/api2/composite/`,
    headers: {
      // The cookies is optained when authenticating via `api2/login/`
      "X-CSRFToken": Cookies.get("csrftoken"), // the login_had sets this, see 'login-simulator.js'
    },
    data: {
      "composite-request": JSON.stringify([
        {
          spec: {
            type: "simple",
            ref: "selfInfo",
          },
          method: "GET",
          path: "api2/user/",
        },
        {
          spec: {
            type: "simple",
            ref: "_matchesBasic",
          },
          method: "GET",
          path: "api2/matches/",
        },
        {
          spec: {
            type: "simple",
            ref: "unconfirmedMatches",
          },
          method: "GET",
          path: "api2/unconfirmed_matches/", // TODO @tbscode yes i'll compine the matches and unconfirmed matches api :)
        },
        {
          spec: {
            type: "simple",
            ref: "userData",
          },
          method: ["GET", "OPTIONS"],
          path: "api2/profile/",
        },
        {
          spec: {
            type: "simple",
            ref: "userState", // State of the current user
          },
          method: ["GET", "OPTIONS"],
          path: "api2/user_state/",
        },
        {
          spec: {
            type: "foreach",
            in: "_matchesBasic",
            as: "match",
            ref: "matches",
          },
          method: "POST",
          path: "api2/profile_of/",
          body: {
            partner_h256_pk: "${match.user_h256_pk}", // eslint-disable-line no-template-curly-in-string
          },
        },
      ]),
    },
  });
};
