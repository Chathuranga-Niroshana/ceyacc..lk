/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Heart, MessageCircle, Send } from "lucide-react";

// Optimized time formatting function
const formatDistanceToNow = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

// Animation variants
const commentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

const replyVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 }
};

const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
};

const CommentCard = React.memo(({ comment, onReply, level = 0 }) => {
    // State management
    const [showReplies, setShowReplies] = useState(level < 2);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.like_count || 0);

    // Memoized values
    const formattedTime = useMemo(() => {
        return formatDistanceToNow(new Date(comment.created_at));
    }, [comment.created_at]);

    const hasReplies = useMemo(() => {
        return comment.replies && comment.replies.length > 0;
    }, [comment.replies]);

    const replyCount = useMemo(() => {
        return comment.replies?.length || 0;
    }, [comment.replies]);

    const isDeepNested = useMemo(() => level >= 3, [level]);

    const marginLeftClass = useMemo(() => {
        if (level === 0) return "";
        return level > 2 ? "ml-4" : "ml-6";
    }, [level]);

    const borderClass = useMemo(() => {
        return level > 0 ? "border-l-2 border-gray-200 pl-4" : "";
    }, [level]);

    // Callback functions
    const handleReplySubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!replyText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const commentData = {
                comment: replyText.trim(),
                post_id: comment.post_id,
                parent_comment_id: comment.id
            }

            const res = await axiosInstance.post("/comments/create", commentData)
            console.log(res)
            setShowReplies(true)
            setReplyText("")
            setIsReplying(false)
        } catch (error) {
            console.error("Failed to submit reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [comment.id, replyText, isSubmitting, onReply]);

    const toggleLike = useCallback(() => {
        setLiked(prev => {
            const newLiked = !prev;
            setLikeCount(currentCount => newLiked ? currentCount + 1 : currentCount - 1);
            return newLiked;
        });
    }, []);

    const toggleReplies = useCallback(() => {
        setShowReplies(prev => !prev);
    }, []);

    const toggleReplyForm = useCallback(() => {
        setIsReplying(prev => !prev);
    }, []);

    const handleReplyTextChange = useCallback((e) => {
        setReplyText(e.target.value);
    }, []);

    const handleImageError = useCallback((e) => {
        e.target.src = "/api/placeholder/32/32";
    }, []);

    // Early return if no comment
    if (!comment) return null;

    return (
        <motion.div
            variants={commentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className={`${marginLeftClass} ${borderClass} ${level > 0 ? "mt-3" : "mt-4"}`}
        >
            <div className="flex gap-3 items-start">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={comment.user?.image || "/api/placeholder/32/32"}
                        alt={`${comment.user?.name || "User"} profile`}
                        className="rounded-full w-8 h-8 object-cover"
                        loading="lazy"
                        onError={handleImageError}
                    />
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    <motion.div
                        className="bg-gray-50 rounded-2xl p-3 shadow-sm"
                        whileHover={{ backgroundColor: "#f8f9fa" }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {comment.user?.name || "Unknown User"}
                            </h4>
                            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {formattedTime}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed break-words">
                            {comment.comment}
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-2 ml-1">
                        <motion.button
                            onClick={toggleLike}
                            className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                                }`}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
                            <span>{likeCount > 0 ? likeCount : "Like"}</span>
                        </motion.button>

                        <motion.button
                            onClick={toggleReplyForm}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <MessageCircle className="h-3 w-3" />
                            Reply
                        </motion.button>
                    </div>

                    {/* Reply Form */}
                    <AnimatePresence>
                        {isReplying && (
                            <motion.form
                                variants={replyVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.2 }}
                                onSubmit={handleReplySubmit}
                                className="mt-3 flex gap-2"
                            >
                                <img
                                    src="/api/placeholder/24/24"
                                    alt="Your profile"
                                    className="rounded-full w-6 h-6 flex-shrink-0 mt-1"
                                    loading="lazy"
                                />
                                <div className="flex-1 flex">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={handleReplyTextChange}
                                        placeholder="Write a reply..."
                                        className="flex-1 bg-gray-100 rounded-l-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={!replyText.trim() || isSubmitting}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-r-full px-4 text-sm transition-colors flex items-center gap-1"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Send className="h-3 w-3" />
                                        {isSubmitting ? "..." : "Send"}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Replies Section */}
            {hasReplies && (
                <div className="mt-3">
                    <motion.button
                        className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 ml-11 transition-colors"
                        onClick={toggleReplies}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {showReplies ? (
                            <>
                                <ChevronUp className="h-3 w-3" />
                                Hide replies
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-3 w-3" />
                                Show {replyCount} {replyCount === 1 ? "reply" : "replies"}
                            </>
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showReplies && (
                            <motion.div
                                variants={replyVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.2, staggerChildren: 0.1 }}
                                className="overflow-hidden"
                            >
                                {comment.replies.map((reply) => (
                                    <CommentCard
                                        key={reply.id}
                                        comment={reply}
                                        onReply={onReply}
                                        level={isDeepNested ? level : level + 1}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
});

CommentCard.displayName = "CommentCard";

export default CommentCard;