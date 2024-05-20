import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'; // Importa las clases necesarias del SDK de AWS SES
import { error } from 'console'; // Importa la función `error` de la clase `console` para manejar errores
require('dotenv').config(); // Importa el módulo dotenv para cargar variables de entorno desde un archivo .env

const ses = new SESClient({}); // Crea una instancia del cliente SES para interactuar con AWS SES

// Función para crear un comando de envío de correo electrónico
function createSendEmailCommand(
  toAddress: string,
  fromAddress: string,
  message: string
) {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress], // Direcciones de correo electrónico de destino
    },
    Source: fromAddress, // Dirección de correo electrónico del remitente
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Your one-time password', // Asunto del correo electrónico
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: message, // Contenido del correo electrónico
        },
      },
    },
  });
}

// Función para enviar un correo electrónico con un token
export async function sendEmailToken(email: string, token: string) {
  console.log('email: ', email, token); // Imprime la dirección de correo electrónico y el token en la consola

  const message = `Your one time password: ${token}`; // Mensaje del correo electrónico
  const command = createSendEmailCommand(
    email,
    '314192654@proton.me', // Dirección de correo electrónico del remitente
    message
  );

  try {
    return await ses.send(command); // Envía el correo electrónico utilizando el comando creado
  } catch (e) {
    console.log('Error sending email', e); // Maneja errores de envío de correo electrónico
    return error; // Retorna el objeto error
  }
}
