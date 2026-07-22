from fastapi import APIRouter, Depends, Request
from dependencies.permissions import require_analyst
from dependencies.current_user import CurrentUser
from schemas.request.scenario import ScenarioSimulationRequest
from application.scenario_application import ScenarioApplication
from core.responses import APIResponse

router = APIRouter()

def get_scenario_app() -> ScenarioApplication:
    return ScenarioApplication()

@router.post("/simulate", summary="Simulate What-If Air Quality Scenario")
async def simulate_scenario(
    request: Request,
    payload: ScenarioSimulationRequest,
    app: ScenarioApplication = Depends(get_scenario_app),
    user: CurrentUser = Depends(require_analyst)
):
    """Run what-if scenario simulations for a station's forecasting model. Requires Analyst role."""
    data = await app.simulate_scenario(payload)
    
    # Enforce strict AI metadata contract
    meta = {
        "model": {
            "name": "scenario_simulator",
            "version": "1.0.0",
            "confidence": 0.85
        }
    }
    
    return APIResponse.success(
        request_id=request.state.request_id,
        data=data.model_dump(),
        meta=meta
    )
