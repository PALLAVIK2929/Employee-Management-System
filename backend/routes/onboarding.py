from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from typing import List

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

class PlanRequest(BaseModel):
    role: str
    skills: List[str]

class PlanResponse(BaseModel):
    plan_30: str
    plan_60: str
    plan_90: str

# Refined prompt for more actionable items
onboarding_template = PromptTemplate.from_template(
    """You are an expert HR manager. Generate a detailed, role-based 30-60-90 day onboarding plan 
    for a {role} who has the following skills: {skills}.
    The plan should focus on integrating these specific skills into the company's workflow.
    
    30 Days: Focus on learning, orientation, and setting up the environment.
    60 Days: Focus on contribution, taking on small tasks, and collaborative work.
    90 Days: Focus on ownership, independent projects, and identifying improvements.
    """
)

@router.post("/generate", response_model=PlanResponse)
async def generate_plan(request: PlanRequest):
    role = request.role
    skills_str = ", ".join(request.skills)
    
    # In a real scenario with an LLM:
    # prompt = onboarding_template.format(role=role, skills=skills_str)
    # response = llm.invoke(prompt)
    
    # Sophisticated mock processing to simulate role/skills awareness
    plan_30 = (
        f"### 30 Days: The Foundation\n"
        f"- **Orientation**: Attend all team introductions and company policy briefings.\n"
        f"- **Environment**: Successfully set up the technical stack for a {role} role.\n"
        f"- **Skill Check**: Begin applying {skills_str} to small, non-critical support tickets.\n"
        f"- **Goal**: Review the existing codebase/documentation and pass the initial competency assessment."
    )
    
    plan_60 = (
        f"### 60 Days: Integration & Action\n"
        f"- **Ownership**: Take the lead on a minor feature development that leverages {skills_str}.\n"
        f"- **Collaboration**: Participate in daily stand-ups and provide constructive feedback in code reviews.\n"
        f"- **Execution**: Complete at least two assigned {role} tasks independently.\n"
        f"- **Integration**: Familiarize yourself with our CI/CD pipelines and deployment workflows."
    )
    
    plan_90 = (
        f"### 90 Days: Acceleration & Impact\n"
        f"- **Autonomy**: Propose and execute a workflow improvement related to {role} responsibilities.\n"
        f"- **Impact**: Successfully deliver a major project component using your expertise in {skills_str}.\n"
        f"- **Mentoring**: Start assisting newer team members with technical hurdles.\n"
        f"- **Review**: Meet with the manager to discuss long-term career growth and key performance metrics."
    )
    
    return PlanResponse(
        plan_30=plan_30,
        plan_60=plan_60,
        plan_90=plan_90
    )
