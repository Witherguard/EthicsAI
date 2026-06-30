FROM node:20-alpine

WORKDIR /app

# Build-time environment variable for default model
ARG VITE_DEFAULT_MODEL=llama3.1:latest
ENV VITE_DEFAULT_MODEL=$VITE_DEFAULT_MODEL

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]