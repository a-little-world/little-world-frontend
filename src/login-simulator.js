import $ from "jquery";
import {default as GLOB } from "./ENVIRONMENT.js"

// Has to be async... This will not be needed in the future, cause login will already be done when loading this page normally
export async function simulatedAutoLogin(username, password, by_force=false){

  // We dont want this function to be called on every reload
  // If you want to ignore this and use by_force=true
  const already_loggedin = window.localStorage.getItem("user_loggedin") || false;
  if(already_loggedin && !by_force){
    // The data `login_dat` should **not** be used anywhere it is just here to provide a default without doing the call again.
    return window.localStorage.getItem("login_data")
  }

  
  // This has to be await, cause nothing is gonna work if not logged in
  const login_data = await $.ajax({
    type: "POST",
    url: `${GLOB.BACKEND_URL}/api2/login_hack/`,
    /* 
     * This uses the `login_hack` api, which is an adaptation of the regular login
     * - also returns `csrftoken` this is usualy set when loading the page under the default backend
     * In this case we manulay get the cookie and and add it to the browser session
    */
    data: {
      username: username,
      password: password,
    },
  })

  // patching the cookie, this would also usually not be needed cause it would be set if loaded via regular backend
  document.cookie = `csrftoken=${login_data.csrfcookie}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;

  // The session login cookie should be set automaticly
  document.cookie = `sessionid=${login_data.sessionid}; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/`;

  window.localStorage.setItem("login_data", login_data)
  window.localStorage.setItem("user_loggedin", true)

  /* 
  Last *impotant* thing
  Ajax doesn't like transmitting the session id because the url is not the same as the current one,
  if we set `xhrFields: { withCredentials: true }` It does it anyways.
  */

  $.ajaxSetup({ /* This will set this for all future calls */
    xhrFields: { withCredentials: true }
  })

  return login_data
}

/* 
* I aint good at js, this is the only way I found, that it actally completely waits untill the function is done
*/
export async function awaitSimulatedLogin(...args){
  return await simulatedAutoLogin(...args);
};