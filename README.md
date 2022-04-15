# Little World Frontend

## Starting ant watching

`npm start`

Be aware that `localhost:3000` might not be able to render/recieve backend data if the Routing is not setup.
If you wan't to use the app without routing change the `BACKEND_URL` to `lw.ngrok.io` but this will break the chat and maybe some other request that need cors and same-site.

Once the routing is setup the frontend url is `localhost:81`.

## Routing setup

The app needs access to the backend test server, currently running under `lw.ngrok.io`.

But browser require request to be `same-site` to send session cookies and co...

To bypass this there is the `schrodingers-nginx.sh`

What is does:

- Routes the frontent to `localhost:81` ( from `localhost:3000`)
- Routes the backend server path `api2/*` and `chat_ws/` to `localhost:81/api2/*` ...

Now when acessing `localhost:81` *all* request and responses are `same-site`.