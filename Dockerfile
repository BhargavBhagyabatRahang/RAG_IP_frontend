FROM python:3.11-slim

WORKDIR /app

# Installing basic system tools
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*


#Copying dependency list

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt \
    --trusted-host pypi.org \
    --trusted-host files.pythonhosted.org


#Copying project code
COPY . .

EXPOSE 8002

CMD ["python", "manage.py", "runserver", "0.0.0.0:8002"]