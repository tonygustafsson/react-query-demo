// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Unicorn = {
  name: string;
  age: number;
  ability: string;
};

const data: Unicorn[] = [
  { name: "Cloudberry", age: 65, ability: "Create rainbows" },
  { name: "Glimmer", age: 34, ability: "Spread stardust" },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Unicorn | Unicorn[]>
) {
  if (req.method === "GET" && req.query.id) {
    // Get specific unicorn
    const unicorn = data[Number(req.query.id)];
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
    const update = JSON.parse(req.body);
    const { id, ...unicorn } = update;

    data[id] = unicorn;

    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    // Delete unicorn
    const deleteIndex = JSON.parse(req.body);

    data.splice(deleteIndex, 1);

    return res.status(200).json(data);
  }
}
