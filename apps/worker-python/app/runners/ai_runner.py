import os
import json
from typing import Dict, Any
import openai
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

class AIRunner:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute AI step"""
        try:
            step_type = input_data.get("type", "openai")
            prompt = input_data.get("prompt", "")
            model = input_data.get("model", "gpt-3.5-turbo")
            max_tokens = input_data.get("max_tokens", 1000)
            temperature = input_data.get("temperature", 0.7)
            
            if step_type == "openai":
                return self._execute_openai(prompt, model, max_tokens, temperature)
            elif step_type == "anthropic":
                return self._execute_anthropic(prompt, model, max_tokens, temperature)
            else:
                return {
                    "success": False,
                    "error": f"Unknown AI provider: {step_type}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _execute_openai(self, prompt: str, model: str, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Execute OpenAI request"""
        try:
            response = self.openai_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return {
                "success": True,
                "response": response.choices[0].message.content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                },
                "model": model
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"OpenAI error: {str(e)}"
            }
    
    def _execute_anthropic(self, prompt: str, model: str, max_tokens: int, temperature: float) -> Dict[str, Any]:
        """Execute Anthropic request"""
        try:
            response = self.anthropic_client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[{"role": "user", "content": prompt}]
            )
            
            return {
                "success": True,
                "response": response.content[0].text,
                "usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens
                },
                "model": model
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Anthropic error: {str(e)}"
            }
