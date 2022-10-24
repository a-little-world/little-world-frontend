import { BACKEND_URL } from "./ENVIRONMENT";

// Has to be async... This will not be needed in the future, cause login will already be done when loading this page normally
export async function simulatedAutoLogin(username, password, by_force = false) {
  // We dont want this function to be called on every reload
  // If you want to ignore this and use by_force=true
  const already_loggedin = window.localStorage.getItem("user_loggedin") || false;
  if (already_loggedin && !by_force) {
    // The data `login_dat` should **not** be used anywhere it is just here to provide a default without doing the call again.
    return window.localStorage.getItem("login_data");
  }

  // This has to be await, cause nothing is gonna work if not logged in
  const login_data = await fetch(`${BACKEND_URL}/api2/login_hack/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include", // equivalent to crossDomain
    body: new URLSearchParams({
      username,
      password,
    }).toString(),
  })
    .then((response) => {
      const { status, statusText } = response;
      if (status === 200) {
        return response.json();
      }
      console.error("server error", status, statusText);
      return false;
    })
    .catch((error) => console.error(error));

  // patching the cookie, this would also usually not be needed cause it would be set if loaded via regular backend
  document.cookie = `csrftoken=${login_data.csrfcookie}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;

  // The session login cookie should be set automaticly
  document.cookie = `sessionid=${login_data.sessionid}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;

  window.localStorage.setItem("login_data", login_data);
  window.localStorage.setItem("user_loggedin", true);

  return login_data;
}

/*
 * I aint good at js, this is the only way I found, that it actally completely waits untill the function is done
 */
export async function awaitSimulatedLogin(...args) {
  return await simulatedAutoLogin(...args);
}
