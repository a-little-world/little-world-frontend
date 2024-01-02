FROM android-capacitor

COPY . .

RUN npm install

RUN ./node_modules/.bin/webpack --env PUBLIC_PATH= --env DEV_TOOL=none --env DEBUG=0 --mode production --config webpack.capacitor.config.js

RUN ./node_modules/.bin/capacitor sync
RUN cd ./android && ./gradlew assembleDebug

ENTRYPOINT ["tail", "-f", "/dev/null"]