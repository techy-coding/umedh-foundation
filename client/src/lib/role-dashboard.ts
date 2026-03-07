type UserRole = "admin" | "donor" | "volunteer" | "beneficiary" | "visitor" | string | null | undefined;

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "donor":
      return "/donor/dashboard";
    case "volunteer":
      return "/volunteer/dashboard";
    case "beneficiary":
      return "/beneficiary/dashboard";
    default:
      return "/";
  }
}
