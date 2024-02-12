const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Social App API",
    description: "API endpoints for a Social App services documented on swagger",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:8080/",
      description: "Local server",
    },
    {
      url: "https://frameworks-comparison-node-server.onrender.com/",
      description: "Live server",
    },
  ],
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Auth",
      description: "Endpoints",
    },
    {
      name: "Post",
      description: "Endpoints",
    },
    {
      name: "User",
      description: "Endpoints",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter your bearer token in the format 'Bearer <token>'",
    },
  },
  security: [{ bearerAuth: [] }],
  definitions: {},
};

const outputFile = "./swagger_output.json";
const routes = ["./routes/auth.js", "./routes/post.js", "./routes/user.js"];

swaggerAutogen(outputFile, routes, doc);
