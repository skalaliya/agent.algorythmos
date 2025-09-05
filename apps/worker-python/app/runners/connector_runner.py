import requests
import json
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class ConnectorRunner:
    def __init__(self):
        self.linkedin_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
        self.linkedin_base_url = "https://api.linkedin.com/v2"
    
    def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute connector step"""
        try:
            connector_type = input_data.get("type", "")
            action = input_data.get("action", "")
            config = input_data.get("config", {})
            
            if connector_type == "linkedin":
                return self._execute_linkedin(action, config)
            elif connector_type == "webhook":
                return self._execute_webhook(action, config)
            else:
                return {
                    "success": False,
                    "error": f"Unknown connector type: {connector_type}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _execute_linkedin(self, action: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute LinkedIn connector actions"""
        try:
            if not self.linkedin_token:
                return {
                    "success": False,
                    "error": "LinkedIn access token not configured"
                }
            
            headers = {
                "Authorization": f"Bearer {self.linkedin_token}",
                "Content-Type": "application/json"
            }
            
            if action == "post":
                # Create a LinkedIn post
                post_data = {
                    "author": f"urn:li:person:{config.get('person_id', '')}",
                    "lifecycleState": "PUBLISHED",
                    "specificContent": {
                        "com.linkedin.ugc.ShareContent": {
                            "shareCommentary": {
                                "text": config.get("text", "")
                            },
                            "shareMediaCategory": "NONE"
                        }
                    },
                    "visibility": {
                        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                    }
                }
                
                response = requests.post(
                    f"{self.linkedin_base_url}/ugcPosts",
                    headers=headers,
                    json=post_data
                )
                
                if response.status_code == 201:
                    return {
                        "success": True,
                        "message": "LinkedIn post created successfully",
                        "post_id": response.json().get("id")
                    }
                else:
                    return {
                        "success": False,
                        "error": f"LinkedIn API error: {response.text}"
                    }
            
            elif action == "get_profile":
                # Get LinkedIn profile
                response = requests.get(
                    f"{self.linkedin_base_url}/people/~",
                    headers=headers
                )
                
                if response.status_code == 200:
                    return {
                        "success": True,
                        "profile": response.json()
                    }
                else:
                    return {
                        "success": False,
                        "error": f"LinkedIn API error: {response.text}"
                    }
            
            else:
                return {
                    "success": False,
                    "error": f"Unknown LinkedIn action: {action}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"LinkedIn connector error: {str(e)}"
            }
    
    def _execute_webhook(self, action: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute webhook connector actions"""
        try:
            url = config.get("url", "")
            method = config.get("method", "POST").upper()
            headers = config.get("headers", {})
            data = config.get("data", {})
            
            if not url:
                return {
                    "success": False,
                    "error": "Webhook URL not provided"
                }
            
            if method == "POST":
                response = requests.post(url, json=data, headers=headers)
            elif method == "GET":
                response = requests.get(url, headers=headers)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=headers)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers)
            else:
                return {
                    "success": False,
                    "error": f"Unsupported HTTP method: {method}"
                }
            
            return {
                "success": response.status_code < 400,
                "status_code": response.status_code,
                "response": response.text,
                "url": url,
                "method": method
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Webhook error: {str(e)}"
            }
