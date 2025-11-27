import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    input: {
      target: `http://localhost:3001/api-json`,
    },
    output: {
      mode: "tags-split",
      target: "./src/api/petstore.ts",
      schemas: "./src/api/models",
      client: "react-query",
      clean: true,
      override: {
        mutator: {
          path: "./src/libs/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
