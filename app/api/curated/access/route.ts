import { handle, json } from "@/lib/community/http";
import { curatedAccess } from "@/lib/curated/access";

export async function GET() {
  return handle(async () => json(await curatedAccess()));
}
