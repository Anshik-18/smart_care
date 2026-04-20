import os
from dotenv import load_dotenv
from pypdf import PdfReader
from langchain_groq import ChatGroq

# Load environment variables from .env file
load_dotenv()

# -----------------------------
# 🔐 LLM SETUP
# -----------------------------
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set. Please create a .env file with your API key.")

llm = ChatGroq(
    api_key=groq_api_key,
    model_name="llama-3.3-70b-versatile"
)


# -----------------------------
# 📄 READ PDF & DOCX
# -----------------------------
from docx import Document as DocxDocument

def read_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def read_docx(file_path):
    doc = DocxDocument(file_path)
    text = ""

    for para in doc.paragraphs:
        text += para.text + "\n"

    return text


# -----------------------------
# 📂 GET PATIENT DATA
# -----------------------------
def get_patient_data(patient_id):
    # Try different naming conventions for patient files
    possible_names = [
        f"data/patient_{patient_id}.docx",
        f"data/patient_{patient_id}.pdf",
        f"data/{patient_id}.docx",
        f"data/{patient_id}.pdf"
    ]
    
    for file_path in possible_names:
        if os.path.exists(file_path):
            if file_path.endswith('.docx'):
                return read_docx(file_path)
            elif file_path.endswith('.pdf'):
                return read_pdf(file_path)
    
    return None

# -----------------------------
# 🤖 CHATBOT
# -----------------------------
def chatbot(query, patient_id):
    patient_data = get_patient_data(patient_id)

    if not patient_data:
        return "Patient data not found."

    prompt = f"""
            You are a healthcare assistant.

            Use the patient prescription data below to answer.

            Patient Data:
            {patient_data}

            Question:
            {query}

            Rules:
            - Give safe and general advice
            - Do NOT prescribe new medicines
            - Suggest consulting doctor if needed

            Answer:
            """

    response = llm.invoke(prompt)
    return response.content.strip()


# -----------------------------
# 🧪 TEST
# -----------------------------
if __name__ == "__main__":
    print("💬 Chatbot Ready\n")

    while True:
        query = input("Ask: ")
        patient_id = input("Patient ID (e.g. patient_1): ")

        answer = chatbot(query, patient_id)

        print("\n🤖", answer)
        print("\n" + "-"*40)