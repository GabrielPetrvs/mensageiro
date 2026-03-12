# 🦋 Messenger Online

Rede social no estilo MSN Messenger, hospedada no GitHub Pages com Firebase.

---

## 📁 Estrutura de arquivos

```
msn-social/
├── index.html              ← Tela de login / criar conta
├── pages/
│   ├── home.html           ← Lista de contatos
│   └── chat.html           ← Janela de conversa
├── js/
│   └── firebase-config.js  ← ⚠️ SUAS credenciais Firebase (edite este arquivo)
└── README.md
```

---

## 🚀 Como colocar no ar (passo a passo)

### 1. Criar o projeto Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"** → dê um nome → clique em continuar
3. Desative o Google Analytics se não quiser → **Criar projeto**

---

### 2. Configurar Authentication

1. No menu lateral: **Criação → Authentication**
2. Clique em **"Primeiros passos"**
3. Em **"Método de login"**, ative **E-mail/senha** → Salvar

> O app usa e-mail internamente — o usuário só vê "nome de usuário + senha".

---

### 3. Criar o Firestore Database

1. No menu lateral: **Criação → Firestore Database**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Modo de produção"** → Avançar → escolha a região → Ativar
4. Vá em **Regras** e cole o seguinte:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Qualquer usuário autenticado pode ler perfis
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Usernames: leitura pública autenticada, escrita só na criação
    match /usernames/{username} {
      allow read:  if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }

    // Chats: só participantes podem ler/escrever
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;

      match /messages/{msgId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

5. Clique em **Publicar**

---

### 4. Criar o Realtime Database (presença e digitação)

1. No menu lateral: **Criação → Realtime Database**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Modo de teste"** por enquanto → Ativar
4. Vá em **Regras** e cole:

```json
{
  "rules": {
    "status": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "typing": {
      "$chatId": {
        "$uid": {
          ".read": "auth != null",
          ".write": "auth != null && auth.uid == $uid"
        }
      }
    }
  }
}
```

5. Clique em **Publicar**

---

### 5. Pegar as credenciais do app

1. Na página inicial do projeto Firebase, clique em **"</> Web"**
2. Registre o app com um nome qualquer
3. Copie o objeto `firebaseConfig` que aparecer
4. Abra o arquivo `js/firebase-config.js` e **substitua** os valores

---

### 6. Subir para o GitHub Pages

```bash
# Crie um repositório no GitHub, depois:
git init
git add .
git commit -m "Messenger Online"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

Depois no repositório GitHub:
1. Vá em **Settings → Pages**
2. Em **Branch**, selecione `main` e pasta `/ (root)`
3. Clique em **Save**
4. Aguarde ~1 minuto → seu site estará em:
   `https://SEU_USUARIO.github.io/SEU_REPO/`

---

### 7. Autorizar o domínio no Firebase

1. No Firebase: **Authentication → Settings → Domínios autorizados**
2. Clique em **Adicionar domínio**
3. Adicione: `SEU_USUARIO.github.io`

---

## ✅ Funcionalidades

- Criar conta com **nome de usuário + senha** (sem e-mail visível)
- Login com sessão persistente opcional
- **Editar perfil**: nome, emoji, recado pessoal
- **Mudar status**: Online, Ausente, Ocupado, Offline
- **Adicionar contatos** pelo nome de usuário
- **Chat em tempo real** (Firebase Firestore)
- **Indicador de digitando...** (Realtime Database)
- **Nudge** (cutucada) com animação
- Presença online/offline automática

---

## ⚠️ Importante

- O arquivo `js/firebase-config.js` contém suas chaves. As chaves Firebase para apps web **são públicas por design** — a segurança é garantida pelas **Regras do Firestore**, não pelo sigilo das chaves.
- Nunca suba chaves de serviço (Service Account) para o GitHub.
