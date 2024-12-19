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
  console.error("Error loading config/api-config.json:", error);
}

const defaults = {
  database: {
    file: "../db/database.sqlite",
  },
};

const mergedConfig = merge({}, defaults, configuration);

export default mergedConfig;
