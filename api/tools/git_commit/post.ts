import createAPIGatewayProxyHandler from "@samepage/backend/createAPIGatewayProxyHandler";
import { ChildProcess, execSync } from "child_process";
import getMissionPath from "src/utils/getMissionPath";

const logic = ({
  message,
  ["x-padawan-mission"]: missionUuid,
}: {
  message: string;
  "x-padawan-mission": string;
}) => {
  try {
    execSync(`git commit -m ${message}`, { cwd: getMissionPath(missionUuid) });
    return { success: true };
  } catch (e) {
    if (e instanceof ChildProcess && e.stderr) {
      const err = e.stderr.toString();
      return { success: false, error: err };
    } else if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "Unknown error occurred." };
  }
};

export default createAPIGatewayProxyHandler({
  logic,
  includeHeaders: ["x-padawan-mission"],
});
