// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createGuid from "@/utils/createGuid";
import type { NextApiRequest, NextApiResponse } from "next";

export type Unicorn = {
  id?: string;
  name: string;
  age: number;
  ability: string;
};

let data: Unicorn[] = [
  { id: createGuid(), name: "Cloudberry", age: 65, ability: "Create rainbows" },
  { id: createGuid(), name: "Glimmer", age: 34, ability: "Spread stardust" },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Unicorn | Unicorn[] | { error: string }>
) {
  if (req.method === "GET" && req.query.id) {
    // Get specific unicorn
    const unicorn = data.find((unicorn) => unicorn.id === req.query.id);

    if (!unicorn) {
      return res.status(404).json({ error: "Unicorn not found" });
    }

    return res.status(200).json(unicorn);
  }

  if (req.method === "GET") {
    // Get all unicorns
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    // Create new unicorn
    const update = JSON.parse(req.body);

    data.push(update);

    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    // Update unicorn
    const updatedUnicorn = JSON.parse(req.body);

    data = data.map((unicorn) => ({
      ...(unicorn.id === updatedUnicorn.id ? updatedUnicorn : unicorn),
    }));

    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    // Delete unicorn
    const deleteIndex = JSON.parse(req.body);

    data.splice(deleteIndex, 1);

    return res.status(200).json(data);
  }
}
