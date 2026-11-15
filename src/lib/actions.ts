"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import {
  getCurrentUser,
  hashPassword,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  removeSessionCookie,
} from "./auth";
import { detectPostType } from "./ranking";

export interface ActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  redirectUrl?: string;
  duplicateId?: string;
}

export async function loginAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    return { error: "Invalid username or password." };
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error: "Invalid username or password." };
  }

  const token = await createSessionToken({
    userId: user.id,
    username: user.username,
  });

  await setSessionCookie(token);
  redirect("/");
}

export async function registerAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  if (username.length < 3 || username.length > 20) {
    return { error: "Username must be between 3 and 20 characters." };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { error: "Username can only contain letters, numbers, underscores, and hyphens." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (existing) {
    return { error: "That username is already taken. Please choose another." };
  }

  const passwordHash = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      passwordHash,
      karma: 1,
      about: "",
    },
  });

  const token = await createSessionToken({
    userId: newUser.id,
    username: newUser.username,
  });

  await setSessionCookie(token);
  redirect("/");
}

export async function logoutAction() {
  await removeSessionCookie();
  redirect("/");
}

export async function submitPostAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be logged in to submit a post." };
  }

  const title = formData.get("title")?.toString().trim();
  let url = formData.get("url")?.toString().trim() || null;
  const text = formData.get("text")?.toString().trim() || null;
  const requestedType = formData.get("type")?.toString().trim();

  if (!title) {
    return { error: "Title is required." };
  }

  if (title.length < 3 || title.length > 300) {
    return { error: "Title must be between 3 and 300 characters." };
  }

  // Normalize URL if provided
  if (url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url);
    } catch {
      return { error: "Please enter a valid URL." };
    }

    // Duplicate URL detection
    const existingPost = await prisma.post.findFirst({
      where: { url },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    if (existingPost) {
      return {
        error: `This URL was already submitted: "${existingPost.title}".`,
        duplicateId: existingPost.id,
      };
    }
  }

  if (!url && !text) {
    return { error: "Submissions must have either a URL or text content." };
  }

  const postType = detectPostType(title, url, requestedType);

  const newPost = await prisma.post.create({
    data: {
      title,
      url,
      text,
      type: postType,
      points: 1,
      authorId: user.id,
      votes: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  // Increment user karma for authoring
  await prisma.user.update({
    where: { id: user.id },
    data: { karma: { increment: 1 } },
  });

  revalidatePath("/");
  revalidatePath("/newest");
  revalidatePath("/ask");
  revalidatePath("/show");
  revalidatePath("/jobs");

  redirect(`/item/${newPost.id}`);
}

export async function votePostAction(postId: string): Promise<{ success: boolean; hasVoted: boolean; pointsDelta: number; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, hasVoted: false, pointsDelta: 0, error: "Please log in to vote." };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true, points: true },
  });

  if (!post) {
    return { success: false, hasVoted: false, pointsDelta: 0, error: "Post not found." };
  }

  // Check if existing vote
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  if (existingVote) {
    // Unvote
    await prisma.$transaction([
      prisma.vote.delete({
        where: { id: existingVote.id },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { points: { decrement: 1 } },
      }),
      prisma.user.update({
        where: { id: post.authorId },
        data: { karma: { decrement: 1 } },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/newest");
    revalidatePath(`/item/${postId}`);
    return { success: true, hasVoted: false, pointsDelta: -1 };
  } else {
    // Upvote
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId: user.id,
          postId,
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { points: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: post.authorId },
        data: { karma: { increment: 1 } },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/newest");
    revalidatePath(`/item/${postId}`);
    return { success: true, hasVoted: true, pointsDelta: 1 };
  }
}

export async function voteCommentAction(commentId: string): Promise<{ success: boolean; hasVoted: boolean; pointsDelta: number; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, hasVoted: false, pointsDelta: 0, error: "Please log in to vote." };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true, postId: true, authorId: true, points: true },
  });

  if (!comment) {
    return { success: false, hasVoted: false, pointsDelta: 0, error: "Comment not found." };
  }

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_commentId: {
        userId: user.id,
        commentId,
      },
    },
  });

  if (existingVote) {
    // Unvote
    await prisma.$transaction([
      prisma.vote.delete({
        where: { id: existingVote.id },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: { points: { decrement: 1 } },
      }),
      prisma.user.update({
        where: { id: comment.authorId },
        data: { karma: { decrement: 1 } },
      }),
    ]);

    revalidatePath(`/item/${comment.postId}`);
    return { success: true, hasVoted: false, pointsDelta: -1 };
  } else {
    // Upvote
    await prisma.$transaction([
      prisma.vote.create({
        data: {
          userId: user.id,
          commentId,
        },
      }),
      prisma.comment.update({
        where: { id: commentId },
        data: { points: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: comment.authorId },
        data: { karma: { increment: 1 } },
      }),
    ]);

    revalidatePath(`/item/${comment.postId}`);
    return { success: true, hasVoted: true, pointsDelta: 1 };
  }
}

export async function submitCommentAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be logged in to comment." };
  }

  const postId = formData.get("postId")?.toString();
  const parentId = formData.get("parentId")?.toString() || null;
  const content = formData.get("content")?.toString().trim();

  if (!postId) {
    return { error: "Missing post ID." };
  }

  if (!content || content.length === 0) {
    return { error: "Comment content cannot be empty." };
  }

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: user.id,
      parentId,
      points: 1,
      votes: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  // Reward karma to comment author
  await prisma.user.update({
    where: { id: user.id },
    data: { karma: { increment: 1 } },
  });

  revalidatePath(`/item/${postId}`);
  return { success: true };
}

export async function updateBioAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be logged in to edit your profile." };
  }

  const about = formData.get("about")?.toString().trim() ?? "";

  await prisma.user.update({
    where: { id: user.id },
    data: { about },
  });

  revalidatePath(`/user/${user.username}`);
  return { success: true };
}
