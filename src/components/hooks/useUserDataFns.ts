import type { ClientResponse } from "../../client";
import { UserDTO } from "../../data.types";

export const useUserDataFns = () => {
  return {
    authAdminUser,
    fetchAdminToken,
    logoutAdminUser,
  };
};

async function authAdminUser(
  username: string,
  password: string
): Promise<ClientResponse<{ accessToken: string }>> {
  const response = await fetch("/api/admins/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const json = await response.json();
  return json;
}

async function fetchAdminToken(
  accessToken: string
): Promise<ClientResponse<UserDTO>> {
  const response = await fetch("/api/admins/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authentication: `Bearer ${accessToken}`,
    },
  });

  const json = await response.json();
  return json;
}

function logoutAdminUser(accessToken: string) {}
