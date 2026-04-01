import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

load_dotenv()

key_firebase = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_CLIENT_EMAIL')}%40el-precio-53218.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

_app = None

def get_firebase_app():
    global _app
    if _app is None:
        cred = credentials.Certificate(key_firebase)
        _app = firebase_admin.initialize_app(cred)
    return _app

def get_tasa_dolar():
    get_firebase_app()
    db = firestore.client()
    doc_ref = db.collection("monedas").document("dolar")
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return {"valor": 0, "estatus": False}

def get_tasa_euro():
    get_firebase_app()
    db = firestore.client()
    doc_ref = db.collection("monedas").document("euro")
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return {"valor": 0, "estatus": False}
