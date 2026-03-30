from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from app.models.sql_models import TransactionType

class TransactionCreate(BaseModel):
    wallet_id: UUID
    type: TransactionType
    amount: Decimal
    category: str
    description: str | None = None
    date: datetime
    
class TransactionResponse(BaseModel):
    id: UUID
    wallet_id: UUID
    type: TransactionType
    amount: Decimal
    category: str
    description: str | None
    date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True