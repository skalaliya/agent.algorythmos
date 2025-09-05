import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

class EmailRunner:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)
    
    def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute email step"""
        try:
            to_emails = input_data.get("to", [])
            subject = input_data.get("subject", "")
            body = input_data.get("body", "")
            is_html = input_data.get("is_html", False)
            cc_emails = input_data.get("cc", [])
            bcc_emails = input_data.get("bcc", [])
            
            if not to_emails:
                return {
                    "success": False,
                    "error": "No recipient emails provided"
                }
            
            # Create message
            msg = MIMEMultipart()
            msg["From"] = self.from_email
            msg["To"] = ", ".join(to_emails)
            msg["Subject"] = subject
            
            if cc_emails:
                msg["Cc"] = ", ".join(cc_emails)
            
            # Add body
            if is_html:
                msg.attach(MIMEText(body, "html"))
            else:
                msg.attach(MIMEText(body, "plain"))
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                
                # Combine all recipients
                all_recipients = to_emails + cc_emails + bcc_emails
                server.send_message(msg, to_addrs=all_recipients)
            
            return {
                "success": True,
                "message": f"Email sent successfully to {len(to_emails)} recipients",
                "recipients": to_emails,
                "subject": subject
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Email sending failed: {str(e)}"
            }
