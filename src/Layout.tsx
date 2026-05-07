// utils/redirectBasedOnRole.ts
export function redirectBasedOnRole(role: string) {
  switch (role) {
    case "admin":
      window.location.href = "/";
      break;
    case "club":
      window.location.href = "/club";
      break;
    case "official":
      window.location.href = "/official";
      break;
    case "eventAdmin":
      window.location.href = "/eventAdmin";
      break;
    case "event_organiser":
      window.location.href = "/organiser";
      break;
    case "district_secretary":
      window.location.href = "/district";
      break;
    case "state_secretary":
      window.location.href = "/state";
      break;
    default:
      window.location.href = "/login";
  }
}
