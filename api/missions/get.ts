import createAPIGatewayHandler from "@samepage/backend/createAPIGatewayProxyHandler";
import { missionSteps, missions } from "scripts/schema";
import drizzle from "src/utils/drizzle";
import { eq, sql } from "drizzle-orm";

const logic = async () => {
  const cxn = drizzle();
  const records = await cxn
    .select({
      uuid: missions.uuid,
      label: sql<string>`MIN(${missions.label})`,
      startDate: sql<string>`to_char(MIN(${missions.startDate}), 'YYYY-MM-DD hh:mm:ss')`,
      steps: sql<number>`COUNT(${missionSteps.uuid})`,
    })
    .from(missions)
    .leftJoin(missionSteps, eq(missions.uuid, missionSteps.missionUuid))
    .groupBy(missions.uuid);
  await cxn.end();
  return {
    missions: records,
  };
};

export type Response = Awaited<ReturnType<typeof logic>>;

export default createAPIGatewayHandler(logic);
