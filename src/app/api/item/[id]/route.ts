import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: { username: true, karma: true },
      },
      comments: {
        include: {
          author: {
            select: { username: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
