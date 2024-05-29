import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  params: { routes },
  request,
}): Promise<Response> => {
  const ALCHEMY_API_KEY = "";

  console.log({ routes });
  const url =
    routes && routes.length > 0
      ? `https://api.g.alchemy.com/${routes}`
      : `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

  console.log(url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${ALCHEMY_API_KEY}`,
    },
    body: await request.text(),
  });
  console.log(response.ok);
  const text = await response.text();
  console.log(text);

  return json(JSON.parse(text), { status: response.status });
};
