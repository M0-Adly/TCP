# Frontend Dockerfile (Vite build + static serve)
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
COPY frontend/.npmrc ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine as runtime
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
