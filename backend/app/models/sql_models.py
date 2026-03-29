import uuid
from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum as PyEnum
from typing import Optional, List

from sqlalchemy import (
    String, DateTime, Numeric, ForeignKey,
    Enum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class TransactionType(str, PyEnum):
    INCOME = "INCOME" # Renda
    EXPENSE = "EXPENSE" # Despesas

class User(Base):
    __tablename__= "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    
    wallets: Mapped[List["Wallet"]] = relationship("Wallet", back_populates="user", cascade="all, delete-orphan")
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    
class Wallet(Base):
    __tablename__= "wallets"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    balance: Mapped[Decimal] = mapped_column(Numeric(15,2), default=Decimal("0.00"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    
    user: Mapped["User"] = relationship("User", back_populates="wallets")
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="wallet", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    wallet_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("wallets.id", ondelete="CASCADE"))
    type: Mapped[TransactionType] = mapped_column(Enum(TransactionType), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    
    user: Mapped["User"] = relationship("User", back_populates="transactions")
    wallet: Mapped["Wallet"] = relationship("Wallet", back_populates="transactions")