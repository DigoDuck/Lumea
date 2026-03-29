from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Banco
    database_url: str
    mongodb_url: str
    
    # Auth
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    
    # Gemini
    gemini_api_key: str
    
    class Config:
        env_file = "../.env"
        extra = "ignore"

@lru_cache()  # Lê o env só uma vez depois reutiliza pra melhorar a perfomance
def get_settings() -> Settings:
    return Settings()