import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ request }) => {
  console.log("loading...");
  return { cookie: request.headers.get("cookie") };
};
