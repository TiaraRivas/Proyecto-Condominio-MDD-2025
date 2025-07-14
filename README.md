

<h1 align="center">🏢 Software de Administración de Condominios IECI 2025-1</h1>

# 🏢 Proyecto de Administración de Condominios IECI 2025-1

Este repositorio contiene el backend para un software de gestión y administración de condominios, desarrollado como parte del proyecto semestral de Metodología del Desarrollo IECI 2025-1. El sistema permite gestionar usuarios, autenticación, y operaciones relacionadas con la administración de condominios utilizando Node.js, Express y PostgreSQL.

---

## 📋 Funcionalidades principales

- Gestión de usuarios y autenticación segura
- Administración de residentes y propietarios
- Registro y seguimiento de pagos y cuotas
- Gestión de incidencias y solicitudes
- Configuración flexible mediante variables de entorno

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
├── index.js
├── package.json
├── src/
│   ├── config/
│   ├── controllers/
│   ├── entity/
│   ├── helpers/
│   ├── middleware/
│   ├── routes/
│   └── validations/
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para sugerencias y mejoras.

---

## 📄 Licencia

Este proyecto es parte de la formación académica y su uso está destinado únicamente a fines educativos.
