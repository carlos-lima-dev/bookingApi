import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsForDate,
} from "../controllers/appointmentsController";
import { check } from "express-validator";
import { verifyToken } from "../middleware/authMiddleware";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gerenciamento de agendamentos
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna todos os agendamentos
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */

router.get("/", verifyToken, getAppointments);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 */
router.post(
  "/",
  [
    check("customerName")
      .notEmpty()
      .withMessage("Nome do cliente é obrigatório"),
    check("email").isEmail().withMessage("E-mail inválido"),
    check("phone")
      .isLength({ min: 9, max: 9 })
      .withMessage("Telefone deve ter 9 dígitos"),
    check("date").notEmpty().withMessage("Data é obrigatória"),
    check("time").notEmpty().withMessage("Hora é obrigatória"),
    check("service").notEmpty().withMessage("Serviço é obrigatório"),
    check("artist").notEmpty().withMessage("Artista é obrigatório"),
  ],
  createAppointment
);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agendamento não encontrado
 */

router.put(
  "/:id",
  [
    check("customerName")
      .notEmpty()
      .withMessage("Nome do cliente é obrigatório"),
    check("email").isEmail().withMessage("E-mail inválido"),
    check("phone")
      .isLength({ min: 9, max: 9 })
      .withMessage("Telefone deve ter 9 dígitos"),
    check("date").notEmpty().withMessage("Data é obrigatória"),
    check("time").notEmpty().withMessage("Hora é obrigatória"),
    check("service").notEmpty().withMessage("Serviço é obrigatório"),
    check("artist").notEmpty().withMessage("Artista é obrigatório"),
  ],
  verifyToken,
  updateAppointment
);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso
 *       404:
 *         description: Agendamento não encontrado
 */

router.delete("/:id", verifyToken, deleteAppointment);

/**
 * @swagger
 * /appointments/by-date:
 *   get:
 *     summary: Busca agendamentos por data
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         description: Data no formato YYYY-MM-DD
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de agendamentos para a data fornecida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Data inválida ou não fornecida
 */

router.get("/by-date", verifyToken, getAppointmentsForDate);

export default router;
