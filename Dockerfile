# Dockerfile for alternative deployment options
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

# Copy frontend
COPY frontend.html ./public/index.html

EXPOSE 3000

CMD ["npm", "start"]