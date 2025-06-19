import { DB } from "./db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await DB.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};
