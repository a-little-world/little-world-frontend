FROM android-capacitor

RUN mkdir -p /workdir/frontend
WORKDIR /workdir/frontend

COPY . .

RUN npm install