FROM python:3.12-slim

# Instala o uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY requirements.txt .

# Executa o comande dentro do container para instalar as dependências usando o uv
RUN uv pip install --system --no-cache -r requirements.txt

COPY . .

EXPOSE 8000