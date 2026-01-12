import serverless from "serverless-http";

import app from "../../dist/server/node-build.mjs";

export const handler = serverless(app);
