export interface ConfigOptions {
  database: {
    file: string;
  };
}

import { merge } from "lodash";
import * as fs from "fs";

let configuration = {};
try {
  configuration = JSON.parse(
    fs.readFileSync("/app/config/config.json", "utf-8")
  );
} catch (error) {
  console.warn("Could not load /app/config/config.json: reverting to defaults");
}

const defaults = {
  port: parseInt(process.env.API_PORT || "3000"),
  database: {
    file: "../db/database.sqlite",
  },
};

const mergedConfig = merge({}, defaults, configuration);

export default mergedConfig;
