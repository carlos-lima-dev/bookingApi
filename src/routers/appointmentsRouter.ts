import {Router} from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsForDate,
} from "../controllers/appointmentsController";
import {check} from "express-validator";
import {verifyToken} from "../middleware/authMiddleware";
import {appointmentLimiter} from "../middleware/rateLimiter";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Returns all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
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
 *     summary: Creates a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid data
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
  appointmentLimiter,
  [
    check("customerName").notEmpty().withMessage("Customer name is required"),
    check("email").isEmail().withMessage("Invalid email"),
    check("phone")
      .isLength({min: 9, max: 9})
      .withMessage("Phone number must have 9 digits"),
    check("date").notEmpty().withMessage("Date is required"),
    check("time").notEmpty().withMessage("Time is required"),
    check("service").notEmpty().withMessage("Service is required"),
    check("artist").notEmpty().withMessage("Artist is required"),
  ],
  createAppointment
);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Updates an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Appointment ID
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
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Appointment not found
 */

router.put(
  "/:id",
  [
    check("customerName").notEmpty().withMessage("Customer name is required"),
    check("email").isEmail().withMessage("Invalid email"),
    check("phone")
      .isLength({min: 9, max: 9})
      .withMessage("Phone number must have 9 digits"),
    check("date").notEmpty().withMessage("Date is required"),
    check("time").notEmpty().withMessage("Time is required"),
    check("service").notEmpty().withMessage("Service is required"),
    check("artist").notEmpty().withMessage("Artist is required"),
  ],
  verifyToken,
  updateAppointment
);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Removes an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Appointment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment removed successfully
 *       404:
 *         description: Appointment not found
 */

router.delete("/:id", verifyToken, deleteAppointment);

/**
 * @swagger
 * /appointments/by-date:
 *   get:
 *     summary: Fetch appointments by date
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of appointments for the provided date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid or missing date
 */

router.get("/by-date", verifyToken, getAppointmentsForDate);

export default router;
