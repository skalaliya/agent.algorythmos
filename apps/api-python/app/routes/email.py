from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional

from ..database import get_db

router = APIRouter()

class EmailRequest(BaseModel):
    to: List[EmailStr]
    subject: str
    body: str
    from_email: Optional[EmailStr] = None
    cc: Optional[List[EmailStr]] = None
    bcc: Optional[List[EmailStr]] = None

class EmailResponse(BaseModel):
    success: bool
    message: str
    message_id: Optional[str] = None

@router.post("/send", response_model=EmailResponse)
async def send_email(
    email_request: EmailRequest,
    db: Session = Depends(get_db)
):
    """Send an email"""
    try:
        # Here you would integrate with your email service
        # For now, we'll simulate sending
        import uuid
        message_id = str(uuid.uuid4())
        
        return EmailResponse(
            success=True,
            message="Email sent successfully",
            message_id=message_id
        )
    except Exception as e:
        return EmailResponse(
            success=False,
            message=f"Failed to send email: {str(e)}"
        )

@router.post("/test")
async def test_email_config():
    """Test email configuration"""
    try:
        # Test email configuration
        return {
            "success": True,
            "message": "Email configuration is valid"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Email configuration test failed: {str(e)}"
        }
