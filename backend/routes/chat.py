from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# Global variables for RAG
vector_store = None
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def init_rag():
    global vector_store
    handbook_path = os.path.join(os.path.dirname(__file__), "..", "handbook.md")
    if not os.path.exists(handbook_path):
        return
    
    with open(handbook_path, "r") as f:
        text = f.read()
    
    headers_to_split_on = [
        ("#", "Header 1"),
        ("##", "Header 2"),
    ]
    
    markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
    docs = markdown_splitter.split_text(text)
    
    vector_store = FAISS.from_documents(docs, embeddings)

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    global vector_store
    
    # Context from Handbook (RAG)
    if vector_store is None:
        init_rag()
    
    docs = vector_store.similarity_search(request.message, k=2) if vector_store else []
    handbook_context = "\n\n".join([doc.page_content for doc in docs]) if docs else ""
    
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        if handbook_context:
            return ChatResponse(reply=handbook_context)
        return ChatResponse(reply="I'm sorry, I couldn't find information about that in the handbook.")

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key)
        
        # Standard Handbook Mode (RAG only)
        prompt_template = """Use the following handbook context to answer the question. 
        If you don't know, say so. Keep it professional.

        {context}

        Question: {question}
        Answer:"""
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        formatted_prompt = PROMPT.format(context=handbook_context, question=request.message)
        response = llm.invoke(formatted_prompt)
        return ChatResponse(reply=response.content)

    except Exception as e:
        return ChatResponse(reply=f"Error processing request: {str(e)}")

# Initialize on module load
init_rag()
