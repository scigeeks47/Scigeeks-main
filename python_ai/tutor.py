import os
import faiss
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_API_BASE"),
)

model = SentenceTransformer("all-MiniLM-L6-v2")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_ncert_text(path="ncert_bio_text.txt"):
    file_path = os.path.join(BASE_DIR,path)
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def create_chunks(text, chunk_size=500):
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks

text = load_ncert_text()
chunks = create_chunks(text)

embeddings = model.encode(chunks)
index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings))

def retrieve_context(question, k=3):
    q_emb = model.encode([question])
    distances, indices = index.search(np.array(q_emb), k)
    return "\n\n".join(chunks[i] for i in indices[0])

def ask_scigenai(question: str) -> str:
    context = retrieve_context(question)

    prompt = f"""
You are SciGenAI, an NCERT Biology tutor.

Answer ONLY using the NCERT Biology context below.

Context:
{context}

Student Question:
{question}

Answer clearly in simple student-friendly language.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content.strip()