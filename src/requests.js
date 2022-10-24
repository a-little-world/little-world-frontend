import Cookies from "js-cookie";

import { BACKEND_URL } from "./ENVIRONMENT";

function mainCompositeRequest() {
  const requestData = {
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
        path: "api2/unconfirmed_matches/", // TODO @tbscode yes i'll combine the matches and unconfirmed matches api :)
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
  };

  fetch(`${BACKEND_URL}/api2/composite/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(requestData).toString(),
  });
}

export default mainCompositeRequest;
