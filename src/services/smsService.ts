import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendAppointmentReminder = async (
  phone: string,
  appointmentDetails: {
    name: string;
    date: Date;
    time: string;
    location: string;
  }
) => {
  const formattedPhone = phone.startsWith("+") ? phone : `+351${phone}`;

  const message = `Olá ${
    appointmentDetails.name
  }, lembrete do seu agendamento para amanhã:
TIO BARBAS!  
Data: ${appointmentDetails.date.toLocaleDateString()}
Hora: ${appointmentDetails.time}
Local: ${appointmentDetails.location}
Caso não possa comparecer p.f. contacte-nos.
Obrigado!
Tel.+351912050222`;

  try {
    console.log(`Sending SMS to ${formattedPhone}`);
    const messageResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("SMS enviado com sucesso:", messageResponse.sid);
  } catch (error) {
    console.error("Error sending appointment reminder SMS:", error);
    if (error instanceof Error) {
      console.error("Twilio error message:", error.message);
      if ("code" in error)
        console.error("Twilio error code:", (error as any).code);
      if ("moreInfo" in error)
        console.error("Twilio moreInfo:", (error as any).moreInfo);
    }
  }
};
