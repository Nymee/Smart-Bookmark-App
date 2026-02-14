"use client";

import Button from "@/components/ui/Button";

export default function SignOutButton() {
  return (
    <form action="/auth/signout" method="post">
      <Button variant="ghost" size="sm" type="submit">
        Sign out
      </Button>
    </form>
  );
}
