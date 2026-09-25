import { isAdminConfigured } from "@/lib/shared/admin";
import {
  isAdmin,
  signInAdmin,
  signOutAdmin,
} from "@/lib/shared/adminSession";
import { fail, handle, json, readJson } from "@/lib/shared/http";

/**
 * The admin session: who am I, sign in, sign out.
 *
 * `configured` is reported so the admin page can say "set
 * COMMUNITY_ADMIN_SECRET" instead of rejecting every password with the same
 * error a wrong one would get. It says nothing about the secret itself.
 */
export async function GET() {
  return handle(async () =>
    json({ admin: await isAdmin(), configured: isAdminConfigured() })
  );
}

export async function POST(request: Request) {
  return handle(async () => {
    if (!isAdminConfigured()) {
      return fail(
        "To wdrożenie nie ma administratora. Ustaw COMMUNITY_ADMIN_SECRET, aby go dodać.",
        503
      );
    }

    const body = await readJson(request);
    const secret = typeof body.secret === "string" ? body.secret : "";

    if (!(await signInAdmin(secret))) {
      return fail("To nie jest hasło administratora.", 403);
    }

    return json({ admin: true });
  });
}

export async function DELETE() {
  return handle(async () => {
    await signOutAdmin();
    return json({ admin: false });
  });
}
