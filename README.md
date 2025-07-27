

<h1 align="center">🏢 Software de Administración de Condominios IECI 2025-1</h1>


# 🏢 Proyecto de Administración de Condominios IECI 2025-1

Este repositorio contiene el backend para un software de gestión y administración de condominios, desarrollado como parte del proyecto semestral de Metodología del Desarrollo IECI 2025-1. El sistema está construido con Node.js, Express y PostgreSQL, y cuenta con módulos para autenticación, gestión de usuarios, y configuración flexible mediante variables de entorno.

---

## 📋 Funcionalidades principales

- Autenticación y autorización de usuarios
- Gestión de usuarios (registro, consulta, actualización)
- Configuración de base de datos y entorno
- Encriptación de contraseñas
- Validación de datos de entrada
- Rutas protegidas y públicas

---

## 📦 Requisitos

Asegúrate de tener instalado en tu sistema:

- [Node.js](https://nodejs.org/) (versión 22.XX.X LTS)
- [PostgreSQL](https://www.postgresql.org/) (versión 16.X.X)
- [Git](https://git-scm.com/)

---

## � Instalación y ejecución

### 1. Clona el repositorio
```bash
git clone https://github.com/HunterUrisus/Backend-Plantilla-MDD-2025-1
cd Backend-Plantilla-MDD-2025-1/
```

### 2. Accede a la carpeta backend e instala las dependencias
```bash
cd backend/
npm install
```

### 3. Configura las variables de entorno
Renombra el archivo `.env.example` a `.env` y edita los valores según tu configuración:
```env
PORT = 3000
HOST = localhost
DB_USERNAME = TU_USUARIO
PASSWORD = TU_CONTRASEÑA
DATABASE = TU_BASE_DE_DATOS
SESSION_SECRET = TU_SECRETO_DE_SESION
```

### 4. Configura la base de datos
Asegúrate de que tu base de datos PostgreSQL tenga las credenciales y estructura necesarias.

### 5. Inicia el servidor
```bash
npm start
```

El backend estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📚 Estructura del proyecto

```
backend/
├── index.js                # Punto de entrada del servidor
├── package.json            # Dependencias y scripts
└── src/
    ├── config/            # Configuración de base de datos y entorno
    │   ├── configDb.js
    │   ├── configEnv.js
    │   └── initDb.js
    ├── controllers/       # Lógica de negocio y controladores
    │   ├── auth.controller.js
    │   └── user.controller.js
    ├── entity/            # Definición de entidades (ej. usuario)
    │   └── user.entity.js
    ├── helpers/           # Funciones auxiliares (ej. bcrypt)
    │   └── bcrypt.helper.js
    ├── middleware/        # Middlewares de autenticación y autorización
    │   ├── authentication.middleware.js
    │   └── authorization.middleware.js
    ├── routes/            # Rutas de la API
    │   ├── auth.routes.js
    │   ├── index.routes.js
    │   └── user.routes.js
    └── validations/       # Validaciones de datos
        └── auth.validation.js
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para sugerencias y mejoras.

---

## 📄 Licencia

Este proyecto es parte de la formación académica y su uso está destinado únicamente a fines educativos.

---

## 🖥️ Frontend

El frontend de este proyecto está desarrollado con React y Vite, proporcionando una interfaz moderna y rápida para la gestión de condominios. Permite a los usuarios autenticarse, visualizar información, registrar nuevos usuarios y gestionar datos relevantes del condominio.

### Estructura principal del frontend

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── assets/            # Recursos estáticos
    ├── components/        # Componentes reutilizables (Navbar, Form, Table, etc.)
    ├── context/           # Contextos globales de la app
    ├── helpers/           # Funciones auxiliares
    ├── hooks/             # Custom hooks
    ├── pages/             # Vistas principales (Home, Login, Register, Users, Error404)
    ├── services/          # Servicios para consumir la API (auth, user, root)
    ├── styles/            # Archivos de estilos
    └── main.jsx           # Punto de entrada de la app
```

### Funcionalidades destacadas

- Autenticación y registro de usuarios
- Navegación protegida por roles
- Visualización y gestión de usuarios
- Formularios y tablas dinámicas
- Manejo de errores y notificaciones

Para ejecutar el frontend:

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173) por defecto.
