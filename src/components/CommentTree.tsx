import { CommentItem } from "./CommentItem";
import type { CommentWithDetails } from "@/types";

interface CommentTreeProps {
  comments: CommentWithDetails[];
  currentUserId?: string | null;
}

export function CommentTree({ comments, currentUserId }: CommentTreeProps) {
  if (comments.length === 0) {
    return (
      <div className="py-6 text-center font-mono text-xs text-neutral-400 dark:text-neutral-600">
        No comments yet. Be the first to join the discussion.
      </div>
    );
  }

  // Build recursive tree from flat list if parentId relationships are present
  const commentMap = new Map<string, CommentWithDetails>();
  const rootComments: CommentWithDetails[] = [];

  // First pass: clone objects and initialize replies arrays
  comments.forEach((c) => {
    commentMap.set(c.id, { ...c, replies: [] });
  });

  // Second pass: associate children with parents
  comments.forEach((c) => {
    const node = commentMap.get(c.id)!;
    if (c.parentId && commentMap.has(c.parentId)) {
      const parent = commentMap.get(c.parentId)!;
      parent.replies = parent.replies || [];
      parent.replies.push(node);
    } else {
      rootComments.push(node);
    }
  });

  return (
    <div className="space-y-3 pt-2">
      {rootComments.map((root) => (
        <CommentItem
          key={root.id}
          comment={root}
          currentUserId={currentUserId}
          depth={0}
        />
      ))}
    </div>
  );
}
