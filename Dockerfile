# Production image for QuantGuard
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend application
COPY backend/ ./backend/

# Use the already-built frontend
COPY frontend/dist ./frontend/dist

# Copy sample signatures
COPY sample_signatures/ ./sample_signatures/

# Seed database
RUN python backend/seed_data.py

EXPOSE 8000

# Start QuantGuard
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]