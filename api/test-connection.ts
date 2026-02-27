import { NextApiRequest, NextApiResponse } from 'next';
import { testConnection } from "@/lib/store";  // Use your connection test

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connectionResult = await testConnection();
  console.log("Connection result: ", connectionResult);
  res.status(200).json(connectionResult);
}
