import Cookie from "js-cookie";

import { BACKEND_URL } from "../../ENVIRONMENT";

class Notifications {
  async getAll({ pageNumber, itemPerPage }) {
    let response = await fetch(
      `${BACKEND_URL}/api/notification/?page=${pageNumber}&paginate_by=${itemPerPage}`,
      {
        method: "GET",
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken"),
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-UseTagsOnly": true,
        },
      }
    );
    let data = await response.text();
    return JSON.parse(data);
  }
  async archive(hashId) {
    let response = await fetch(`${BACKEND_URL}/api/notification/archive`, {
      method: "POST",
      body: JSON.stringify({
        hash: [hashId],
      }),
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-UseTagsOnly": true,
      },
    });
    let data = await response.text();
    return JSON.parse(data);
  }
  async read(hashId) {
    let response = await fetch(`${BACKEND_URL}/api/notification/read`, {
      method: "POST",
      body: JSON.stringify({
        hash: [hashId],
      }),
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-UseTagsOnly": true,
      },
    });
    let data = await response.text();
    return JSON.parse(data);
  }
}
export const notifications = new Notifications();
