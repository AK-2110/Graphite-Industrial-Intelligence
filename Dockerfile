# Stage 1: Build the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Install server dependencies so tRPC types can be resolved by the frontend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Now build the client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# Empty VITE_API_URL so frontend uses relative paths (same host)
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Build the backend and serve
FROM node:18-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/client/dist ./client/dist

# Setup backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Expose port 7860 for Hugging Face
EXPOSE 7860

# Start the server
CMD ["npx", "tsx", "src/index.ts"]
