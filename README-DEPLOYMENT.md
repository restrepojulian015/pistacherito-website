# 🚀 Guía de Despliegue - Pistacherito

## Configuración para Vercel

### 1. Variables de Entorno
En el dashboard de Vercel, ve a **Settings > Environment Variables** y añade:

```
RESEND_API_KEY=tu_clave_de_resend_aqui
```

### 2. Configuración de Resend
1. Crea cuenta en [Resend.com](https://resend.com)
2. Verifica tu dominio o usa el dominio de prueba
3. Copia tu API key y añádela a las variables de entorno

### 3. Despliegue
```bash
# Opción 1: Desde GitHub (recomendado)
git add .
git commit -m "Add serverless function for email sending"
git push origin main

# Opción 2: Desde CLI
npm install -g vercel
vercel login
vercel --prod
```

### 4. Estructura del Proyecto
```
pistacherito-website/
├── api/
│   └── send-advisory.js    # Función serverless
├── index.html
├── script.js
├── styles.css
├── package.json
├── vercel.json
└── [otras páginas HTML]
```

### 5. Funcionalidad
- ✅ Frontend: Formulario de asesoría gratuita
- ✅ Backend: Envío automático de correos
- ✅ WhatsApp: Abre automáticamente con mensaje
- ✅ CORS: Configurado para permitir peticiones

### 6. URLs de Producción
- **Sitio web**: `https://tu-proyecto.vercel.app`
- **API endpoint**: `https://tu-proyecto.vercel.app/api/send-advisory`

### 7. Monitoreo
- Revisa los logs en Vercel Dashboard > Functions
- Verifica correos en la bandeja de `pistacheritofs@gmail.com`
- Usa la consola del navegador para debug

### 8. Alternativas a Resend
Si prefieres otro servicio de email:
- **SendGrid**: Cambia `resend` por `@sendgrid/mail`
- **Mailgun**: Cambia `resend` por `mailgun-js`
- **Nodemailer**: Para SMTP personalizado

### 9. Testing Local
```bash
npm install
vercel dev
```
Visita `http://localhost:3000` para probar localmente.