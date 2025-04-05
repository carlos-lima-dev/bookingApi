import rateLimit from "express-rate-limit";

export const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo de 10 requisições por IP
  message: {
    error: "Too many appointment attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
