import { testConnection } from "@/lib/store";  // Should resolve to src/lib/store.ts

export default async function handler(req, res) {
  const connectionResult = await testConnection();
  console.log("Connection result: ", connectionResult);
  res.status(200).json(connectionResult);
}
