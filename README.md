# 🏀 Escorpión de Oro — App Web del Club

Aplicación web de gestión interna del club de baloncesto **Escorpión de Oro**, construida con HTML, CSS y JavaScript vanilla. Incluye base de datos local en el navegador (IndexedDB) y sistema de autenticación con dos roles: **Coach** y **Miembro**.

## 📁 Estructura

```
escorpion-de-oro/
├── index.html          # Página principal (Hero + Coach)
├── login.html          # Página de inicio de sesión
├── profile.html        # Perfil del usuario y cierre de sesión
├── informacion.html    # Información del club, galería y valores
├── horarios.html       # Horarios de entrenamiento y eventos
├── partidos.html       # Partidos finalizados con filtros
├── puntuacion.html     # Tabla de clasificación y registro de partidos
├── cronograma.html     # Actividades, reuniones y eventos
├── css/
│   └── style.css       # Estilos (verdes fríos + dorado)
├── js/
│   ├── app.js          # Lógica de la aplicación y autenticación
│   └── db.js           # Base de datos IndexedDB (usuarios, sesión, estado)
└── (imágenes del club)
```

## 🔐 Sistema de Acceso

Para entrar a la aplicación debes iniciar sesión en `login.html`.

### Cuentas de prueba incluidas:

| Rol | Correo | Contraseña | Qué puede hacer |
|-----|--------|------------|-----------------|
| **Coach** | coach@escorpionoro.com | coach123 | Acceso completo: ver y registrar partidos, puntuación, cronograma, exportar datos |
| **Miembro** | jugador1@escorpionoro.com | miembro123 | Ver información, horarios, partidos y su propio perfil |

> Los usuarios se crean automáticamente la primera vez que se abre la app (IndexedDB).

## ✅ Funcionalidades

- **Autenticación**: login con roles de coach y miembro, sesión persistente en el navegador.
- **Información del club**: historia, sede, valores y redes sociales.
- **Horarios**: tabla de entrenamientos por categoría y próximos eventos.
- **Partidos finalizados**: rol de partidos con filtros (ganados/perdidos) y buscador.
- **Puntuación**: tabla de clasificación auto-calculada (PJ, PG, PP, PF, PC, diferencia, puntos).
- **Cronograma**: actividades, entrenamientos, reuniones y eventos con vista semanal.
- **Miembros en el header**: avatares de la plantilla en el encabezado.
- **Entrenador en página principal**: perfil del Coach con contadores animados.
- **Base de datos local**: IndexedDB guarda automáticamente partidos, puntuación, cronograma y sesiones.
- **Exportar datos**: descarga de respaldo en JSON con toda la información del club.
- **Notificaciones toast**: alertas visuales al realizar acciones.
- **Modo oscuro/claro**: interruptor en la barra de navegación.
- **Diseño minimalista**: tonos verdes fríos y dorado para el contraste.

## 🚀 Cómo ejecutar localmente

1. Descarga o clona este repositorio.
2. Abre la carpeta `escorpion-de-oro`.
3. Abre `login.html` en tu navegador (Chrome, Edge, Firefox, Safari).
4. Inicia sesión con una cuenta de prueba.

> No necesita servidor de backend ni instalación de dependencias. Todo funciona directamente desde los archivos HTML.

## ☁️ Base de datos

La app usa **IndexedDB** (base de datos incorporada en navegadores modernos). Los datos se almacenan en tu dispositivo y persisten entre sesiones. Si borras el historial de navegación o usas modo incógnito, los datos pueden no conservarse.

## 📱 Cómo abrirlo desde el celular

1. Sube esta carpeta a un hosting gratuito (Netlify Drop, GitHub Pages, Vercel, etc.).
2. O bien, copia los archivos al almacenamiento interno de tu celular y abre `login.html` con Chrome o Safari.

## 🛠️ Subir a GitHub

1. Crea un repositorio nuevo en [github.com](https://github.com).
2. En tu computadora, abre una terminal en la carpeta `escorpion-de-oro` y ejecuta:

```bash
git init
git add .
git commit -m "Primera versión: app web del club Escorpión de Oro con login y base de datos"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

3. Activa **GitHub Pages** en Settings > Pages para tener un link público.

## 📄 Licencia

Proyecto privado del club Escorpión de Oro.
