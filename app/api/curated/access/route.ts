import { handle, json } from "@/lib/shared/http";
import { curatedAccess } from "@/lib/curated/access";

export async function GET() {
  return handle(async () => json(await curatedAccess()));
}
