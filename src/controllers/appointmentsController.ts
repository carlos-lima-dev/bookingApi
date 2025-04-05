import {Request, Response} from "express";
import {validationResult} from "express-validator";

import {
  getAllAppointments,
  addAppointment,
  modifyAppointment,
  removeAppointment,
  getByDate,
  findAppointmentByDateTime,
} from "../services/appointmentsService";
import {IAppointment} from "../interfaces/interfaces";
import {sendAppointmentConfirmation} from "../services/emailServices";

export const getAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appointments = await getAllAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Erro ao obter agendamentos:", error);
    res.status(500).json({
      message: "Erro interno ao obter agendamentos.",
    });
  }
};

export const createAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({errors: errors.array()});
    return;
  }

  try {
    const appointmentData: IAppointment = req.body;

    // 🔍 Verifica se já existe um agendamento para a mesma data e hora
    const existingAppointment = await findAppointmentByDateTime(
      appointmentData.date,
      appointmentData.time,
      appointmentData.artist
    );

    if (existingAppointment) {
      res.status(400).json({
        message: "This time slot is already booked. Please choose another one.",
      });
      return;
    }

    const appointment = await addAppointment(appointmentData);

    await sendAppointmentConfirmation(appointmentData.email, {
      name: appointmentData.customerName,
      date: appointmentData.date,
      time: appointmentData.time,
      location: "rua do camelo n1 4898-637 Guimarães",
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);

    res.status(500).json({
      message: "Internal error while creating appointment.",
    });
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({errors: errors.array()});
    return;
  }

  const id = req.params.id;

  try {
    const appointmentData: Partial<IAppointment> = req.body;
    const updatedAppointment = await modifyAppointment(id, appointmentData);

    if (!updatedAppointment) {
      res.status(404).json({message: "Agendamento não encontrado"});
      return;
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    res.status(500).json({
      message: "Erro interno ao atualizar agendamento.",
    });
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id;

  try {
    const deleted = await removeAppointment(id);

    if (!deleted) {
      res.status(404).json({message: "Agendamento não encontrado"});
      return;
    }

    res.status(200).json({message: "Agendamento eliminado."});
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    res.status(500).json({
      message: "Erro interno ao excluir agendamento.",
    });
  }
};

export const getAppointmentsForDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const date = req.query.date as string;

  if (!date) {
    res.status(400).json({message: "Parâmetro 'date' é obrigatório"});
    return;
  }

  try {
    const appointments = await getByDate(date);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Erro ao buscar agendamentos por data:", error);
    res.status(500).json({
      message: "Erro interno ao buscar agendamentos.",
    });
  }
};
