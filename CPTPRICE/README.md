# Captain Price - App de Cotizaciones

Aplicación web de cotizaciones con sistema de autenticación usando Glassmorphism y PostgreSQL.

## Características

- 🔐 Sistema de Login con validación y conexión a PostgreSQL
- 📝 Sistema de Signup (Registro) con hash de contraseñas
- 🎨 Diseño Glassmorphism moderno
- 📱 Diseño responsive
- ✅ Validación de formularios
- 🔒 Contraseñas encriptadas con bcrypt

## Tecnologías

### Backend
- Node.js
- Express
- PostgreSQL (pg)
- bcrypt para encriptación

### Frontend
- React 18
- Vite
- CSS3 (Glassmorphism)

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos:
   - Crear archivo `.env` basado en `.env.example`
   - Asegúrate de que PostgreSQL esté corriendo
   - Ejecutar el script de setup:
```bash
npm run setup-db
```

## Desarrollo

Para ejecutar tanto el servidor como el cliente en desarrollo:
```bash
npm run dev
```

O por separado:
```bash
# Servidor (puerto 5000)
npm run server

# Cliente (puerto 3000)
npm run client
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Configuración de Base de Datos

La aplicación usa PostgreSQL. La cadena de conexión por defecto es:
```
postgresql://javierl@localhost:5432/cotizador
```

Puedes modificarla en el archivo `.env`.

## Colores

- **PRIMARY**: #3B82F6 (Azul)
- **PRIMARY-L**: #60A5FA (Azul lighter)
- **SECONDARY**: #0EA5E9 (Celeste)
- **ACCENT**: #FCD34D (Amarillo pastel)
- **NEUTRAL-W**: #FFFFFF (Blanco)
- **NEUTRAL-L**: #F8FAFC (Blanco muy claro)
- **NEUTRAL-D**: #1E293B (Negro)

## Tipografía

- **H1**: 32px bold (títulos principales) - Line Height: 1.2
- **H2**: 24px semibold (subtítulos) - Line Height: 1.2
- **H3**: 20px semibold (secciones) - Line Height: 1.2
- **Body**: 14px regular (texto normal) - Line Height: 1.5
- **Small**: 12px regular (labels) - Line Height: 1.5

## Estructura del Proyecto

```
captain-price/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── database/
│   │   └── setup.js
│   ├── routes/
│   │   └── auth.js
│   └── index.js
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Auth.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```
