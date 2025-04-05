import {Express} from "express";
import swaggerJSDoc, {Options} from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export default function setupSwagger(app: Express) {
  const options: Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Appointments API",
        version: "1.0.0",
        description: "Service Scheduling API Documentation.",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          LoginRequest: {
            type: "object",
            properties: {
              username: {type: "string"},
              password: {type: "string"},
            },
            required: ["username", "password"],
          },
          Appointment: {
            type: "object",
            properties: {
              customerName: {type: "string"},
              email: {type: "string", format: "email"},
              phone: {type: "string"},
              date: {type: "string", format: "date"},
              time: {type: "string"},
              service: {type: "string"},
              artist: {type: "string"},
              notes: {type: "string"},
            },
            required: [
              "customerName",
              "email",
              "phone",
              "date",
              "time",
              "service",
              "artist",
            ],
          },
        },
      },
    },
    apis: ["./src/routers/**/*.ts"],
  };

  const specs = swaggerJSDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}
