
import os

from dotenv import load_dotenv
import firebase_admin
from firebase_admin import firestore

load_dotenv()
firebase_admin.initialize_app(options={"projectId": os.environ["FIREBASE_PROJECT_ID"]})

db = firestore.client()
ref = db.collection("_healthcheck").document("ping")
ref.set({"ok": True})
print("Read back:", ref.get().to_dict())
ref.delete()
print("Firestore connection OK")

