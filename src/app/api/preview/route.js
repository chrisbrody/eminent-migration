import { draftMode } from "next/headers";
import { redirectToPreviewURL } from "@prismicio/next";
import { createClient } from "../../../../lib/prismic";

export async function GET(request) {
  const client = createClient();
  const draft = await draftMode();
  draft.enable();
  await redirectToPreviewURL({ client, request });
}