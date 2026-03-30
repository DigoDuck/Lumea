from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True
        
class Token(BaseModel):
    acess_token: str
    token_type: str = "bearer"
    user: UserResponse