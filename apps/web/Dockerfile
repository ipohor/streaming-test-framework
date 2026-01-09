FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

COPY vite.config.js ./vite.config.js
COPY index.html ./index.html
COPY src ./src

EXPOSE 5173
ENV VITE_API_BASE_URL=http://api:3001
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
