import { NextResponse, type NextRequest } from "next/server";
import { client } from "@/lib/shopify/serverClient";
import { getProductByHandle } from "@/lib/shopify/graphql/query";
import type {
  ProductDetailData,
  ProductDetailVariables,
} from "@/lib/shopify/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle");

  if (!handle) {
    return NextResponse.json({ error: "Missing handle" }, { status: 400 });
  }

  const variables: ProductDetailVariables = { handle };
  const resp = await client.request(getProductByHandle, { variables });
  const data = resp.data as ProductDetailData | undefined;

  return NextResponse.json({ product: data?.product ?? null });
}
