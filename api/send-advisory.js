const { Resend } = require('resend');

module.exports = async (req, res) => {
  // Configurar CORS para permitir peticiones desde el frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nombre, telefono, email, evento, personas, autorizacion } = req.body;

    // Validar datos requeridos
    if (!nombre || !telefono || !email || !evento || !personas) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Inicializar Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Enviar correo
    const emailResponse = await resend.emails.send({
      from: 'Pistacherito <onboarding@resend.dev>',
      to: ['ja0433rc.ut@cendi.edu.co', 'pistacheritofs@gmail.com', 'restrepojulian015@gmail.com'],
      subject: 'Nueva solicitud de asesoría - Pistacherito',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a7c59;">Nueva solicitud de asesoría</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">Información del cliente:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">Detalles del evento:</h3>
            <p><strong>Tipo de evento:</strong> ${evento}</p>
            <p><strong>Cantidad de personas:</strong> ${personas}</p>
            <p><strong>Autorización telefónica:</strong> ${autorizacion}</p>
          </div>
          
          <p style="color: #6b8e6b; font-style: italic;">
            Esta solicitud fue enviada desde el formulario de asesoría gratuita de Pistacherito.
          </p>
        </div>
      `,
      text: `
Nueva solicitud de asesoría - Pistacherito

Información del cliente:
- Nombre: ${nombre}
- Teléfono: ${telefono}
- Email: ${email}

Detalles del evento:
- Tipo de evento: ${evento}
- Cantidad de personas: ${personas}
- Autorización telefónica: ${autorizacion}

Esta solicitud fue enviada desde el formulario de asesoría gratuita de Pistacherito.
      `
    });

    console.log('Email enviado exitosamente:', emailResponse);
    res.status(200).json({ success: true, message: 'Email enviado correctamente' });

  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: 'No se pudo enviar el correo. Inténtalo de nuevo.' 
    });
  }
};