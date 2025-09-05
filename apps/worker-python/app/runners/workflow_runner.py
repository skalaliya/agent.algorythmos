import json
from typing import Dict, Any, List
from sqlalchemy import text
from .ai_runner import AIRunner
from .email_runner import EmailRunner
from .connector_runner import ConnectorRunner

class WorkflowRunner:
    def __init__(self, db, run_id: str):
        self.db = db
        self.run_id = run_id
        self.ai_runner = AIRunner()
        self.email_runner = EmailRunner()
        self.connector_runner = ConnectorRunner()
    
    def execute(self, workflow_definition: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a workflow definition"""
        try:
            steps = workflow_definition.get("steps", [])
            if not steps:
                return {
                    "success": False,
                    "error": "No steps defined in workflow"
                }
            
            results = []
            context = {}
            
            for i, step in enumerate(steps):
                step_id = step.get("id", f"step_{i}")
                step_type = step.get("type", "")
                step_config = step.get("config", {})
                
                # Create step record
                step_run_id = self._create_step_record(step_id, step_type, step_config)
                
                # Execute step
                result = self._execute_step(step_type, step_config, context)
                results.append(result)
                
                # Update step record with result
                self._update_step_record(step_run_id, result)
                
                # Update context with step result
                if result.get("success", False):
                    context[f"step_{i}"] = result
                else:
                    # If step failed, stop execution
                    return {
                        "success": False,
                        "error": f"Step {step_id} failed: {result.get('error', 'Unknown error')}",
                        "results": results
                    }
            
            return {
                "success": True,
                "results": results,
                "context": context
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _create_step_record(self, step_id: str, step_type: str, config: Dict[str, Any]) -> str:
        """Create a step record in the database"""
        import uuid
        step_run_id = str(uuid.uuid4())
        
        self.db.execute(
            text("""
                INSERT INTO run_steps (id, run_id, step_id, step_type, input_data, status, created_at)
                VALUES (:id, :run_id, :step_id, :step_type, :input_data, 'PENDING', NOW())
            """),
            {
                "id": step_run_id,
                "run_id": self.run_id,
                "step_id": step_id,
                "step_type": step_type,
                "input_data": json.dumps(config)
            }
        )
        self.db.commit()
        return step_run_id
    
    def _update_step_record(self, step_run_id: str, result: Dict[str, Any]):
        """Update step record with execution result"""
        status = "COMPLETED" if result.get("success", False) else "FAILED"
        error_message = result.get("error") if not result.get("success", False) else None
        
        self.db.execute(
            text("""
                UPDATE run_steps 
                SET status = :status, 
                    output_data = :output_data, 
                    error_message = :error_message,
                    completed_at = NOW()
                WHERE id = :id
            """),
            {
                "id": step_run_id,
                "status": status,
                "output_data": json.dumps(result),
                "error_message": error_message
            }
        )
        self.db.commit()
    
    def _execute_step(self, step_type: str, config: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a single step"""
        try:
            if step_type == "AI":
                return self.ai_runner.execute(config)
            elif step_type == "EMAIL":
                return self.email_runner.execute(config)
            elif step_type == "CONNECTOR":
                return self.connector_runner.execute(config)
            elif step_type == "LOOP":
                return self._execute_loop(config, context)
            else:
                return {
                    "success": False,
                    "error": f"Unknown step type: {step_type}"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _execute_loop(self, config: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a loop step"""
        try:
            loop_type = config.get("type", "for")
            iterations = config.get("iterations", 1)
            steps = config.get("steps", [])
            
            if loop_type == "for":
                results = []
                for i in range(iterations):
                    iteration_results = []
                    for step in steps:
                        step_result = self._execute_step(step.get("type", ""), step.get("config", {}), context)
                        iteration_results.append(step_result)
                        
                        if not step_result.get("success", False):
                            return {
                                "success": False,
                                "error": f"Loop iteration {i} failed at step {step.get('id', 'unknown')}",
                                "results": results
                            }
                    
                    results.append(iteration_results)
                
                return {
                    "success": True,
                    "results": results,
                    "iterations": iterations
                }
            
            else:
                return {
                    "success": False,
                    "error": f"Unknown loop type: {loop_type}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
