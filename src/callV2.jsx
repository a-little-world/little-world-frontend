import React from 'react';
import { JaaSMeeting } from '@jitsi/react-sdk';

export function CallV2() {
    return <div style={{
        height: '100vh',
    }}>
        <h1>Call screen v2</h1>
        <JaaSMeeting
            appId={"vpaas-magic-cookie-5a1420d824674d089d74f3a06f651583"}
            roomName="PleaseUseAGoodRoomName"
            jwt={"eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtNWExNDIwZDgyNDY3NGQwODlkNzRmM2EwNmY2NTE1ODMvMGQ0MTg4LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3MDk4MjIwODcsImV4cCI6MTcwOTgyOTI4NywibmJmIjoxNzA5ODIyMDgyLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNWExNDIwZDgyNDY3NGQwODlkNzRmM2EwNmY2NTE1ODMiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImhlcnJkdWVuc2NobmxhdGUiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTE0MDM1MjY0MDM1NzAzNjczNTU0IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJoZXJyZHVlbnNjaG5sYXRlQGdtYWlsLmNvbSJ9fSwicm9vbSI6IioifQ.tzJKM23oXEdTtsQNr9WV8PwsGNsdtYt2qi6uCn7UIvnuOreJ2WM7RfDz-2xXQqOHvtOYPTbEgRtxqMFwqowhB32LIbchboNskAm6FuvMJMeDXNJyYFm26twElT8KEPSfvugFEMZ9_U5b2xlCEEHD8da0Du04TCK13KOR8FBF1udzL30gJ9oOBILBGbOL5vT-3wsDNxzfNLaJgIabvwHz2ezt6nUnyGaWL2UJFASQPs_gbgD4uTIPejt3-QhKdEUx5a0zY07Ye3sq6kgz1yuK9LjJXh6MmxwcUf4i83s_02W5DEXHPXO14arUV58NhdfdXEhu7wjV-4ddgzExozEUFQ"}
            configOverwrite={{
                disableThirdPartyRequests: true,
                disableLocalVideoFlip: true,
                backgroundAlpha: 0.5
            }}
            interfaceConfigOverwrite={{
                VIDEO_LAYOUT_FIT: 'nocrop',
                MOBILE_APP_PROMO: false,
                TILE_VIEW_MAX_COLUMNS: 4
            }}
            userInfo={{
                displayName: 'John Doe',
            }}
            onApiReady={(externalApi) => { }}
        />
    </div>
}