import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({
  params: { routes },
  request,
}): Promise<Response> => {
  const ALCHEMY_API_KEY = "";

  request.headers.append("authorization", `Bearer ${ALCHEMY_API_KEY}`);

  const response = await fetch(`https://polygon-amoy.g.alchemy.com/${routes}`, {
    method: "POST",
    headers: request.headers,
    body: await request.text(),
  });

  const text = await response.text();

  return json(JSON.parse(text), { status: response.status });
};
