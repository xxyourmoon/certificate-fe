"use server";

import { revalidateTag } from "next/cache";

export const refreshParticipantsData = async () => {
  revalidateTag("participants");
};
