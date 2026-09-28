# Multi-stage production build for QuantGuard
# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend + Static Asset Server
FROM python:3.11-slim AS production
WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend application source
COPY backend/ ./backend/

# Copy compiled frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy sample signatures for testing
COPY sample_signatures/ ./sample_signatures/

# Seed database on build
RUN python backend/seed_data.py

EXPOSE 8000

# Run uvicorn unified production server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
