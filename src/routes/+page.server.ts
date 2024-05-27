import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ request }) => {
  return { cookie: request.headers.get("cookie") };
};
