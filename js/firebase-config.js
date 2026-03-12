// ============================================================
//  SUBSTITUA os valores abaixo pelas suas credenciais Firebase
//  Acesse: https://console.firebase.google.com
//  Crie um projeto > Adicionar app web > copie o firebaseConfig
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDZkMLH3r5Vym9eE1YqHH8R_rWGR6_rWiw",
  authDomain:        "mensageiro-992b3.firebaseapp.com",
  projectId:         "mensageiro-992b3",
  storageBucket:     "mensageiro-992b3.firebasestorage.app",
  messagingSenderId: "484817145298",
  appId:             "1:484817145298:web:cf5ec0ac2b197f9d2c4c0b",
  databaseURL:       "https://mensageiro-992b3-default-rtdb.firebaseio.com"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const rtdb = getDatabase(app);
