# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy rest of project
COPY . .

# Build production bundle
RUN yarn build


# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]