import cron from "node-cron";
import {
  removeOldAppointments,
  getByDate,
} from "./services/appointmentsService";
import { sendAppointmentReminder } from "./services/smsService";

const scheduleDailyCleanup = () => {
  // Limpeza diária à meia-noite
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Running daily cleanup job at", new Date());
      try {
        const deletedCount = await removeOldAppointments();
        console.log(`${deletedCount} old appointments removed successfully`);
      } catch (error) {
        console.error("Error removing old appointments:", error);
      }
    },
    { timezone: "Europe/Lisbon" }
  );

  // Envio de lembretes diários às 18:05 (hora de Portugal)
  cron.schedule(
    "38 18 * * *",
    async () => {
      console.log("Running daily reminder job at", new Date());

      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toLocaleDateString("sv-SE"); // YYYY-MM-DD

        const appointments = await getByDate(dateString);
        console.log(
          `Retrieved ${appointments.length} appointments for ${dateString}`
        );

        for (const appointment of appointments) {
          try {
            const appointmentDate = new Date(appointment.date);
            console.log(`Sending reminder for: ${appointment.customerName}`);

            await sendAppointmentReminder(appointment.phone, {
              name: appointment.customerName || "Cliente",
              date: appointmentDate,
              time: appointment.time,
              location: "rua do camelo, n2 4780-456 Guimarães.",
            });
          } catch (smsError) {
            console.error(
              `Erro ao enviar SMS para ${appointment.customerName}:`,
              smsError
            );
          }
        }
      } catch (error) {
        console.error("Error sending reminders:", error);
      }
    },
    { timezone: "Europe/Lisbon" }
  );
};

export const runImmediateCleanup = async () => {
  console.log("Running immediate cleanup job at", new Date());
  try {
    const deletedCount = await removeOldAppointments();
    console.log(`${deletedCount} old appointments removed successfully`);
  } catch (error) {
    console.error("Error removing old appointments:", error);
  }
};

export default scheduleDailyCleanup;
