import os
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
from dotenv import load_dotenv

# Carrega o .env da raiz do monorepo
load_dotenv(
    os.path.join(os.path.dirname(__file__), "..", "..", ".env"),
    encoding="utf-8",
)

# Importa os models para o Alembic detectar as tabelas
from app.database import Base       # noqa: E402
from app.models import sql_models  # noqa: E402, F401

alembic_config = context.config

if alembic_config.config_file_name is not None:
    fileConfig(alembic_config.config_file_name)

# Usa a DATABASE_URL diretamente com asyncpg — sem converter para psycopg2
database_url = os.getenv("DATABASE_URL", "")

if not database_url:
    raise RuntimeError("DATABASE_URL não encontrada no .env")

# Garante que o driver é asyncpg
if "asyncpg" not in database_url:
    database_url = database_url.replace(
        "postgresql://", "postgresql+asyncpg://"
    ).replace(
        "postgresql+psycopg2://", "postgresql+asyncpg://"
    )

alembic_config.set_main_option("sqlalchemy.url", database_url)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = alembic_config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    engine = create_async_engine(
        database_url,
        poolclass=pool.NullPool,
    )
    async with engine.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())