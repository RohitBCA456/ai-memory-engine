# Change from 3.9-slim to 3.11-slim
FROM python:3.11-slim

WORKDIR /app

# The rest of the file stays the same
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY memory_classifier.joblib .
COPY main.py .

EXPOSE 5001

CMD ["python", "main.py"]