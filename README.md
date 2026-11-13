# 🏀 Escorpión de Oro — App Web del Club

Aplicación web completa de gestión interna del club de baloncesto **Escorpión de Oro**, construida con HTML, CSS y JavaScript vanilla. Incluye base de datos local (IndexedDB), autenticación con roles, dashboard, gestión de plantilla, noticias, importar/exportar y más.

## 📁 Estructura

```
escorpion-de-oro/
├── index.html          # Inicio con Dashboard y resumen
├── login.html          # Inicio de sesión (por username)
├── profile.html        # Perfil de usuario
├── informacion.html    # Información del club, galería y valores
├── horarios.html       # Horarios de entrenamiento y eventos
├── partidos.html       # Partidos finalizados con filtros
├── puntuacion.html     # Tabla de clasificación + registrar + importar/exportar
├── cronograma.html     # Actividades, reuniones y eventos
├── miembros.html       # Gestión de plantilla (CRUD)
├── noticias.html       # Sistema de noticias del club
├── css/
│   └── style.css       # Estilos (verdes fríos + dorado)
├── js/
│   ├── app.js          # Lógica de la aplicación y autenticación
│   └── db.js           # Base de datos IndexedDB (usuarios, sesión, estado)
├── logo.png
└── README.md
```

## 🔐 Sistema de Acceso

Para entrar a la aplicación debes iniciar sesión en `login.html`.

### Cuentas de prueba incluidas:

| Username | Contraseña | Rol | Qué puede hacer |
|----------|------------|-----|-----------------|
| `coach` | `coach123` | Coach | Acceso completo: editar plantilla, publicar noticias, importar/exportar, ver todo |
| `miembro` | `miembro123` | Miembro | Ver información, horarios, partidos, plantilla, noticias y su perfil |
| `jugador2` | `miembro123` | Miembro | Mismo acceso que miembro |

> Los usuarios y noticias por defecto se crean automáticamente la primera vez que se abre la app (IndexedDB).

## ✅ Funcionalidades

### 🔐 Autenticación y Roles
- Login con **username** (no correo)
- Dos roles: **Coach** (acceso completo) y **Miembro** (consulta)
- Sesión persistente en el navegador
- Página de perfil con foto, rol y estadísticas rápidas

### 🏠 Dashboard (Inicio)
- Tarjetas resumen: partidos jugados, ganados, perdidos, tasa de victorias
- Gráfico de barras: rendimiento ganados vs perdidos
- Próximas actividades de la semana

### 📋 Gestión de Club
- **Información**: historia, sede, valores, redes sociales
- **Horarios**: tabla de entrenamientos por categoría
- **Partidos**: rol de partidos con filtros y buscador
- **Puntuación**: tabla de clasificación auto-calculada
- **Cronograma**: actividades semanales con modal para agendar

### 👥 Plantilla (miembros.html)
- CRUD completo de jugadores (agregar, editar, eliminar)
- Foto, nombre, posición, número, apodo, partidos y puntos
- Solo Coach puede editar/eliminar
- Ver detalles individuales de cada jugador

### 📰 Noticias (noticias.html)
- Publicar, editar y eliminar noticias del club
- Categoría, título, contenido e imagen
- Solo Coach puede gestionar noticias

### 💾 Datos
- **IndexedDB**: base de datos local en el navegador
- **Exportar**: descargar respaldo en JSON
- **Importar**: cargar respaldo desde JSON
- Todo persiste al cerrar el navegador

### 🎨 Diseño
- Tonos verdes fríos y dorado para contraste
- Modo oscuro/claro
- Notificaciones toast
- Responsive (móvil y desktop)
- Pestañas/minimalista

## 🚀 Cómo ejecutar localmente

1. Descarga o clona este repositorio.
2. Abre la carpeta `escorpion-de-oro`.
3. Abre `login.html` en tu navegador.
4. Inicia sesión con una cuenta de prueba.

> No necesita servidor de backend ni instalación de dependencias.

## ☁️ Base de datos

Usa **IndexedDB** (incorporada en navegadores modernos). Los datos se guardan en tu dispositivo y persisten entre sesiones.

## 📱 Desde el celular

Sube la carpeta a GitHub Pages, Netlify Drop o Vercel, y abre el link desde Chrome o Safari.

## 🛠️ Subir a GitHub

```bash
git init
git add .
git commit -m "App web completa del club Escorpión de Oro"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Luego activa **GitHub Pages** en Settings > Pages.

## 📄 Licencia

Proyecto privado del club Escorpión de Oro.
