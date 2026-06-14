interface ResetPasswordTemplateParams {
  resetUrl: string;
  expirationMinutes: number;
}

export const resetPasswordTemplate = ({
  resetUrl,
  expirationMinutes,
}: ResetPasswordTemplateParams): string => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Recuperación de contraseña</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 24px;">
    <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px;">
      <h2 style="color: #333333;">Hola,</h2>
      <p style="color: #555555; font-size: 15px; line-height: 1.5;">
        Recibimos una solicitud para restablecer la contraseña de tu cuenta.
        Si no fuiste tú, puedes ignorar este correo.
      </p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}"
           style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Restablecer contraseña
        </a>
      </p>
      <p style="color: #888888; font-size: 13px;">
        Este enlace expirará en ${expirationMinutes} minutos. Si el botón no funciona, copia y pega este enlace en tu navegador:
      </p>
      <p style="color: #888888; font-size: 13px; word-break: break-all;">
        ${resetUrl}
      </p>
    </div>
  </body>
</html>
`;