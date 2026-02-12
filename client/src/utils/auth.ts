import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  username?: string;
};

export type UserInfo = {
  username: string;
} | null;

export const getUserFromToken = (): UserInfo => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log("Decoded token:", decoded);
    return {
      username: decoded.username || "user",
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem("accessToken");
};

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};
