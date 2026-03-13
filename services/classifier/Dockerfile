FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 1. Copy from the CURRENT folder (where the Dockerfile is)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy the model and the main script
COPY memory_classifier.joblib .
COPY main.py .

# Optional: If you want the CSV for any reason
# COPY memory_data.csv .

EXPOSE 5001

CMD ["python", "main.py"]