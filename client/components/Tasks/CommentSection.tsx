'use client';

import { useState } from 'react';
import { useComments, useAddComment } from '@/hooks/useComments';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Send, MessageSquare } from 'lucide-react';

export function CommentSection({ taskId }: { taskId: string }) {
    const [content, setContent] = useState('');
    const { data: comments, isLoading } = useComments(taskId);
    const addComment = useAddComment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await addComment.mutateAsync({ taskId, content });
            setContent('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="space-y-6 mt-6 pt-6 border-t">
            <h3 className="font-semibold flex items-center gap-2 text-sm uppercase text-gray-500">
                <MessageSquare className="h-4 w-4" /> Discussion
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Button type="submit" size="sm" disabled={addComment.isPending || !content.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>

            {/* Comment List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {isLoading ? (
                    <p className="text-sm text-gray-500">Loading comments...</p>
                ) : comments?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No comments yet. Start the conversation!</p>
                ) : (
                    comments?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                    {comment.users?.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{comment.users?.name}</span>
                                    <span className="text-[10px] text-gray-500">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
