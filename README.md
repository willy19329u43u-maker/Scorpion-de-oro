# 🏀 Escorpión de Oro — App Web del Club

Aplicación web de gestión interna del club de baloncesto **Escorpión de Oro**, construida con HTML, CSS y JavaScript vanilla. Incluye base de datos local en el navegador (IndexedDB) para guardar partidos, puntuación, cronograma y horarios sin necesidad de servidor propio.

## 📁 Estructura

```
escorpion-de-oro/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos (verdes fríos + dorado)
├── js/
│   ├── app.js          # Lógica de la aplicación
│   └── db.js           # Base de datos IndexedDB (local en el navegador)
└── (imágenes del club)
```

## ✅ Funcionalidades

- **Información del club**: historia, sede, valores y redes sociales.
- **Horarios**: tabla de entrenamientos por categoría y próximos eventos.
- **Partidos finalizados**: rol de partidos con filtros (ganados/perdidos) y buscador.
- **Puntuación**: tabla de clasificación auto-calculada (PJ, PG, PP, PF, PC, diferencia, puntos).
- **Cronograma**: actividades, entrenamientos, reuniones y eventos con vista semanal.
- **Miembros en el header**: avatares de la plantilla en el encabezado.
- **Entrenador en página principal**: perfil del Coach con contadores animados.
- **Base de datos local**: IndexedDB guarda automáticamente partidos, puntuación y cronograma al cerrar el navegador.
- **Diseño minimalista**: pestañas con botones de acceso, tonos verdes fríos y dorado.
- **Modo oscuro/claro**: interruptor en la barra de navegación.

## 🚀 Cómo ejecutar localmente

1. Descarga o clona este repositorio.
2. Abre la carpeta `escorpion-de-oro`.
3. Haz doble clic en `index.html` o ábrelo con tu navegador (Chrome, Edge, Firefox, Safari).

> No necesita servidor de backend ni instalación de dependencias. Todo funciona directamente desde el archivo HTML.

## ☁️ Base de datos

La app usa **IndexedDB** (base de datos incorporada en navegadores modernos). Los datos se almacenan en tu dispositivo y persisten entre sesiones. Si borras el historial de navegación o usas modo incógnito, los datos pueden no conservarse.

## 📱 Cómo abrirlo desde el celular

1. Sube esta carpeta a un hosting gratuito (Netlify Drop, GitHub Pages, Vercel, etc.).
2. O bien, copia los archivos al almacenamiento interno de tu celular y abre `index.html` con Chrome o Safari.

## 🛠️ Subir a GitHub

1. Crea un repositorio nuevo en [github.com](https://github.com) (no marques "Initialize with README" si ya traes los archivos).
2. En tu computadora, abre una terminal en la carpeta `escorpion-de-oro` y ejecuta:

```bash
git init
git add .
git commit -m "Primera versión: app web del club Escorpión de Oro"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

3. Refresca tu repositorio en GitHub y verás los archivos subidos.

## 📄 Licencia

Proyecto privado del club Escorpión de Oro.
