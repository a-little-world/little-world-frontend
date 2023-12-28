FROM android-capacitor

COPY . .

RUN npm install

RUN ./node_modules/.bin/capacitor copy
RUN cd ./android && ./gradlew assembleDebug