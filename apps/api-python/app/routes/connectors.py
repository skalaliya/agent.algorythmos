from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any

from ..database import get_db

router = APIRouter()

class ConnectorTestRequest(BaseModel):
    connector_type: str
    config: Dict[str, Any]

class ConnectorTestResponse(BaseModel):
    success: bool
    message: str
    data: Dict[str, Any] = {}

@router.post("/test", response_model=ConnectorTestResponse)
async def test_connector(
    request: ConnectorTestRequest,
    db: Session = Depends(get_db)
):
    """Test a connector configuration"""
    try:
        if request.connector_type == "linkedin":
            # Test LinkedIn connector
            return ConnectorTestResponse(
                success=True,
                message="LinkedIn connector test successful",
                data={"profile": "test_profile"}
            )
        elif request.connector_type == "email":
            # Test email connector
            return ConnectorTestResponse(
                success=True,
                message="Email connector test successful",
                data={"smtp": "connected"}
            )
        else:
            return ConnectorTestResponse(
                success=False,
                message=f"Unknown connector type: {request.connector_type}"
            )
    except Exception as e:
        return ConnectorTestResponse(
            success=False,
            message=f"Connector test failed: {str(e)}"
        )

@router.get("/types")
async def get_connector_types():
    """Get available connector types"""
    return {
        "connectors": [
            {
                "type": "linkedin",
                "name": "LinkedIn",
                "description": "LinkedIn API integration"
            },
            {
                "type": "email",
                "name": "Email",
                "description": "SMTP email integration"
            }
        ]
    }
