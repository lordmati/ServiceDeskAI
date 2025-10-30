# 🎫 ServiceDesk AI

> Sistema inteligente de gestión de tickets (Help Desk) con análisis de imágenes mediante IA, geolocalización y gestión por roles.

![ServiceDesk AI Banner](https://img.shields.io/badge/ServiceDesk-AI-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?style=flat-square&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)

---

## 📖 Descripción

**ServiceDesk AI** es una aplicación web moderna para la gestión de incidencias técnicas (Service Desk / Help Desk) que integra **inteligencia artificial** para análisis automático de imágenes, **geolocalización GPS**, y un sistema completo de **roles y permisos**.

Diseñado para equipos de soporte IT, permite crear, asignar y seguir tickets de forma eficiente, con soporte multimedia, compartir por email y cumplimiento de estándares de accesibilidad **WCAG 2.1 AA**.

---

## ✨ Características Principales

### 🔐 **Autenticación y Roles (RBAC)**
- ✅ Sistema de login/register con **JWT**
- ✅ 3 roles de usuario:
  - **Admin:** Gestión completa de usuarios, oficinas y tickets
  - **ServiceDesk:** Ver y gestionar todos los tickets, asignarlos y cambiar estados
  - **Standard:** Crear y ver sus propios tickets

### 🎫 **Gestión de Tickets**
- ✅ Crear tickets con título, descripción y prioridad (Low/Medium/High/Urgent)
- ✅ **Adjuntar hasta 5 archivos** (imágenes/videos)
- ✅ **Análisis automático con IA** (Stable Diffusion API)
  - Descripción del contenido
  - Etiquetas/tags generadas automáticamente
  - Confidence score
- ✅ Estados del ticket: Open → Assigned → In Progress → Closed
- ✅ Asignación a agentes de ServiceDesk

### 🏢 **Oficinas y Workstations**
- ✅ Gestión de oficinas con ubicación física
- ✅ Asignación de workstations por oficina
- ✅ Oficinas favoritas para creación rápida de tickets

### 📍 **Geolocalización GPS**
- ✅ Captura automática de coordenadas al crear ticket
- ✅ Visualización en Google Maps
- ✅ Almacenamiento con índice geoespacial MongoDB (2dsphere)

### 📧 **Compartir por Email**
- ✅ Envío de tickets por email con **Nodemailer**
- ✅ Plantilla HTML responsive
- ✅ Múltiples destinatarios
- ✅ Tracking de emails compartidos

### 📱 **Mobile-First + Accesibilidad WCAG AA**
- ✅ Diseño responsive optimizado para móviles
- ✅ Navegación por teclado (Tab, Enter, Escape)
- ✅ Etiquetas ARIA para lectores de pantalla
- ✅ Contraste de colores 4.5:1 mínimo
- ✅ Focus visible en elementos interactivos

### 🔄 **Redux State Management**
- ✅ Estado global con Redux Toolkit
- ✅ Persistencia con localStorage
- ✅ Gestión centralizada del usuario autenticado

---

## 🛠️ Stack Tecnológico

### **Frontend**
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 18.2 | Librería UI |
| Redux Toolkit | 1.9.5 | State Management |
| React Router DOM | 6.16 | Navegación SPA |
| Vite | 5.4 | Build Tool ultrarrápido |
| Tailwind CSS | 3.3 | Framework CSS utility-first |
| Axios | 1.5 | Cliente HTTP |

### **Backend**
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Node.js | 20 | Runtime JavaScript |
| Express | 4.18 | Framework web |
| MongoDB | 6 | Base de datos NoSQL |
| Mongoose | 7.5 | ODM para MongoDB |
| JWT | 9.0 | Autenticación |
| Bcrypt | 2.4 | Hash de contraseñas |
| Multer | 1.4 | Upload de archivos |
| Nodemailer | 6.9 | Envío de emails |

### **DevOps**
- **Docker** + **Docker Compose** - Containerización completa
- **Makefile** - Comandos simplificados

### **APIs Externas**
- **Stable Diffusion API** - Análisis de imágenes con IA
- **Geolocation API** - Coordenadas GPS del navegador
- **Google Maps** - Visualización de ubicaciones
- **Gmail SMTP** - Envío de emails

---

## 🚀 Instalación y Configuración

### **Requisitos Previos**
- Docker & Docker Compose instalados
- Node.js 20+ (opcional, para desarrollo sin Docker)
- Cuenta de Gmail con App Password (para emails)

### **Pasos de Instalación**

#### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/misaguir/ServiceDeskAI.git
cd ServiceDeskAI
```

#### 2️⃣ Configurar variables de entorno

Crea el archivo `backend/.env`:

```env
MONGO_URI=mongodb://mongo:27017/servicedeskai
JWT_SECRET=your_super_secret_jwt_key_here

# Configuración de Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_aqui
EMAIL_FROM="ServiceDesk AI <noreply@servicedesk.com>"

# URL del Frontend
APP_URL=http://localhost:3000
```

> **⚠️ Importante:** Para Gmail, necesitas crear un [App Password](https://myaccount.google.com/apppasswords)

#### 3️⃣ Generar JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y pégalo en `JWT_SECRET` del archivo `.env`

#### 4️⃣ Levantar la aplicación

```bash
# Opción A: Limpiar todo y crear datos de prueba
make reset

# Opción B: Solo levantar contenedores
make all
```

#### 5️⃣ Acceder a la aplicación

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

---

## 🎮 Uso de la Aplicación

### **1. Login**

Accede a `http://localhost:3000` y usa uno de los usuarios de prueba:

| Rol | Email | Password | Permisos |
|-----|-------|----------|----------|
| **Admin** | `admin@servicedesk.com` | `admin123` | Acceso completo |
| **ServiceDesk** | `servicedesk@servicedesk.com` | `servicedesk123` | Gestionar tickets |
| **Standard** | `standard@servicedesk.com` | `test123` | Crear tickets |

### **2. Crear un Ticket (Usuario Standard)**

1. Click en **"+ New Ticket"**
2. Rellena título y descripción
3. Selecciona prioridad
4. (Opcional) Selecciona oficina y workstation
5. (Opcional) Adjunta hasta 5 imágenes/videos
6. Click en **"Create Ticket"**
7. ✨ El sistema capturará tu ubicación GPS y analizará las imágenes con IA

### **3. Gestionar Tickets (ServiceDesk/Admin)**

1. Ver todos los tickets en el Dashboard
2. Click en un ticket para ver detalles
3. Cambiar estado: Open → Assigned → In Progress → Closed
4. Ver análisis de IA de las imágenes
5. Compartir ticket por email

### **4. Compartir por Email**

1. Abre un ticket
2. Click en **"📧 Share via Email"**
3. Ingresa emails separados por comas
4. Click en **"Send Email"**

---

## 📋 Comandos del Makefile

```bash
make all       # Construir y levantar contenedores
make down      # Detener contenedores
make logs      # Ver logs en tiempo real
make clean     # Detener y eliminar volúmenes
make re        # Reconstruir todo (limpia + build)
make seed      # Crear usuarios y oficinas de prueba
make reset     # Limpia todo y crea datos de prueba
```

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────┐
│   React Frontend    │  ← http://localhost:3000
│   (Vite + Redux)    │
└──────────┬──────────┘
           │ REST API (Axios)
           ↓
┌─────────────────────┐
│   Express Backend   │  ← http://localhost:5000
│   (Node.js + JWT)   │
└──────────┬──────────┘
           │
    ┌──────┴───────────────────────┐
    │                              │
    ↓                              ↓
┌─────────┐              ┌──────────────────┐
│ MongoDB │              │ External APIs    │
│ :27017  │              ├──────────────────┤
└─────────┘              │ Stable Diffusion │
                         │ Gmail SMTP       │
                         │ Geolocation API  │
                         └──────────────────┘
```

---

## 📁 Estructura del Proyecto

```
ServiceDeskAI/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── controllers/        # Lógica de negocio
│   │   │   ├── auth.controller.js
│   │   │   └── ticket.controller.js
│   │   ├── models/             # Modelos Mongoose
│   │   │   ├── User.js
│   │   │   ├── Ticket.js
│   │   │   └── Office.js
│   │   ├── routes/             # Rutas de la API
│   │   │   ├── auth.routes.js
│   │   │   ├── tickets.routes.js
│   │   │   ├── offices.routes.js
│   │   │   └── admin.routes.js
│   │   ├── middleware/         # Auth + validación
│   │   ├── services/           # IA + Email
│   │   │   ├── imageAnalysis.js
│   │   │   └── email.service.js
│   │   ├── config/             # Multer, DB
│   │   ├── scripts/            # Scripts de seed
│   │   └── app.js              # Entry point
│   ├── uploads/                # Archivos subidos
│   ├── .env                    # Variables de entorno
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # SPA React + Vite
│   ├── src/
│   │   ├── pages/              # Páginas principales
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TicketDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── store/              # Redux
│   │   │   ├── index.js
│   │   │   └── userSlice.js
│   │   ├── services/           # API client
│   │   │   └── api.js
│   │   ├── components/         # Componentes reutilizables
│   │   ├── App.jsx             # Router principal
│   │   └── index.css           # Tailwind + estilos
│   ├── public/
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml          # Orquestación
├── Makefile                    # Comandos útiles
├── .gitignore
└── README.md                   # Este archivo
```

---

## 🔌 APIs y Servicios Externos

### **1. Stable Diffusion API**
- **URL:** `http://stable-diffusion.42malaga.com:7860/interrogator/analyze`
- **Uso:** Análisis de imágenes con IA
- **Salida:** Descripción + etiquetas + confidence score
- **Fallback:** Mock de análisis si el servidor no está disponible

### **2. Nodemailer (Gmail SMTP)**
- **Host:** `smtp.gmail.com:587`
- **Uso:** Envío de emails de tickets compartidos
- **Plantilla:** HTML responsive con estilos inline

### **3. Geolocation API**
- **Navegador:** `navigator.geolocation.getCurrentPosition()`
- **Uso:** Captura automática de coordenadas GPS
- **Almacenamiento:** MongoDB con índice geoespacial

---

## ✅ Funcionalidades Implementadas

### **Obligatorias (Subject)**
- [x] Docker + docker-compose
- [x] README.md completo
- [x] 3 perfiles de usuario (Standard, ServiceDesk, Admin)
- [x] Node.js + Express + MongoDB
- [x] React + Redux
- [x] JWT Authentication
- [x] Mobile-First Design
- [x] Accesibilidad WCAG AA
- [x] Gestión de perfil
- [x] Creación de tickets con multimedia
- [x] Compartir tickets por email
- [x] Historial de tickets (abiertos/cerrados)
- [x] Geolocalización GPS
- [x] Análisis de imágenes con IA

### **Extras Implementados**
- [x] Redux Toolkit para state management
- [x] Tailwind CSS con tema personalizado
- [x] Oficinas y workstations
- [x] Favoritos (oficina/workstation predeterminados)
- [x] Análisis de IA con Stable Diffusion
- [x] Templates HTML para emails
- [x] Índice geoespacial MongoDB
- [x] Scripts de seed automatizados

---

## ♿ Accesibilidad (WCAG 2.1 AA)

El proyecto cumple con los estándares de accesibilidad:

✅ **Contraste de colores:** Mínimo 4.5:1 en todo el texto  
✅ **Navegación por teclado:** Tab, Enter, Escape  
✅ **Etiquetas ARIA:** `aria-label`, `aria-required`, `aria-live`  
✅ **Formularios accesibles:** Labels con `htmlFor`/`id`  
✅ **Mensajes de error:** `role="alert"` + `aria-live="polite"`  
✅ **Skip to content:** Link para saltar navegación  
✅ **Screen readers:** Textos con `.sr-only`  

---

## 🐛 Troubleshooting

### **Error: "Cannot find module 'nodemailer'"**
```bash
docker exec -it servicedeskai_backend npm install nodemailer
make re
```

### **Error: "MongoDB connection failed"**
```bash
# Verificar que el contenedor de MongoDB esté corriendo
docker ps | grep mongo

# Ver logs de MongoDB
docker logs servicedeskai_mongo
```

### **Error: "Email not sending"**
- Verifica que `EMAIL_USER` y `EMAIL_PASS` estén correctos en `.env`
- Asegúrate de usar un **App Password** de Gmail, no tu contraseña normal
- Genera uno aquí: https://myaccount.google.com/apppasswords

### **Frontend no carga:**
```bash
# Limpiar cache de Vite
make clean
make reset
```

---

## 🚀 Mejoras Futuras (Roadmap)

- [ ] **Chat en tiempo real** con Socket.io
- [ ] **Notificaciones push** (PWA)
- [ ] **Panel de Admin completo**
  - Dashboard con estadísticas
  - Gráficos de tickets (Chart.js)
  - Gestión avanzada de usuarios
- [ ] **Exportar tickets a PDF**
- [ ] **Búsqueda avanzada** con filtros
- [ ] **Comentarios en tickets** (sistema de mensajería)
- [ ] **Integración con Slack/Teams**
- [ ] **Modo offline** (PWA con Service Workers)

---

## 👨‍💻 Autor

**Matias Aguirre**  
📧 Email: matiasisaguirre306@gmail.com  
🔗 GitHub: [@misaguir](https://github.com/misaguir)  
🎓 Proyecto final - 42 Málaga

---

## 📄 Licencia

Este proyecto es parte del currículo de 42 Network.  
Todos los derechos reservados © 2024 Matias Aguirre

---

## 🙏 Agradecimientos

- **42 Málaga** por el proyecto y recursos educativos
- **Stable Diffusion API** para análisis de imágenes
- **MongoDB** por la excelente documentación
- **React Community** por las mejores prácticas
- **Tailwind Labs** por el framework CSS

---

## 📸 Capturas de Pantalla

### Login
![Login Screen](docs/screenshots/login.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Crear Ticket
![Create Ticket](docs/screenshots/create-ticket.png)

### Detalle con IA
![AI Analysis](docs/screenshots/ai-analysis.png)

### Vista Mobile
![Mobile View](docs/screenshots/mobile.png)

---

<div align="center">

**⭐ Si te gustó el proyecto, dale una estrella en GitHub ⭐**

**🎫 ServiceDesk AI - Gestión Inteligente de Tickets**

[⬆ Volver arriba](#-servicedesk-ai)

</div>