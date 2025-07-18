/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow, differenceInHours } from "date-fns";
import { CommentOutlined, MoreHoriz } from "@mui/icons-material";
import { ThumbsUp, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { useDispatch } from "react-redux";
import { reactToPost } from "../../features/posts/postSlice";
import axiosInstance from "../../utils/axiosInstance";

// Lazy load components
const ImageMedia = React.lazy(() => import("./ImageMedia"));
const VideoMedia = React.lazy(() => import("./VideoMedia"));
const PdfMedia = React.lazy(() => import("./PdfMedia"));
const FullScreenModal = React.lazy(() => import("./MediaFullScreen"));
const Comment = React.lazy(() => import("./CommentCard"));
const StarRating = React.lazy(() => import("./PostRating"));

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
            duration: 0.3
        }
    }
};

const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
};

const commentSectionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: "auto",
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.2
        }
    }
};

const PostCard = React.memo(({ post }) => {
    // State management
    const [expandedPosts, setExpandedPosts] = useState({});
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [userRating, setUserRating] = useState(0);
    const [likeStatus, setLikeStatus] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [fullScreenMedia, setFullScreenMedia] = useState({ type: null, src: null });
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentsLoaded, setCommentsLoaded] = useState(false);

    const dispatch = useDispatch();
    const commentInputRef = useRef(null);
    const requestRef = useRef(null);

    // Memoized values
    const isExpanded = useMemo(() => expandedPosts[post?.id], [expandedPosts, post?.id]);

    const formattedDate = useMemo(() => {
        if (!post?.created_at) return "";

        try {
            const postDate = new Date(post.created_at);
            const now = new Date();
            const hoursDifference = differenceInHours(now, postDate);

            return hoursDifference < 24
                ? formatDistanceToNow(postDate, { addSuffix: true })
                : format(postDate, "MMM d, yyyy 'at' h:mm a");
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    }, [post?.created_at]);

    const reactionCount = useMemo(() => {
        const baseCount = post?.reaction_number || 0;
        return baseCount + (likeStatus ? 1 : 0);
    }, [post?.reaction_number, likeStatus]);

    const shouldShowExpandButton = useMemo(() => {
        return post?.title && post.title.length > 150;
    }, [post?.title]);

    // Callback functions
    const showCommentsHandle = useCallback(async () => {
        if (isLoadingComments || requestRef.current) return;

        if (commentsLoaded) {
            setShowComments(prev => !prev);
            if (!showComments) {
                setTimeout(() => {
                    commentInputRef.current?.focus();
                }, 100);
            }
            return;
        }

        setIsLoadingComments(true);

        try {
            requestRef.current = axiosInstance.get(`/comments/get/${post.id}`);
            const response = await requestRef.current;

            if (response.data && Array.isArray(response.data)) {
                setComments(response.data);
                setCommentsLoaded(true);
                setShowComments(true);

                setTimeout(() => {
                    commentInputRef.current?.focus();
                }, 100);
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Error loading comments:", error);
            }
        } finally {
            setIsLoadingComments(false);
            requestRef.current = null;
        }
    }, [post.id, isLoadingComments, commentsLoaded, showComments])

    const toggleExpand = useCallback((id) => {
        setExpandedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    const handleLike = useCallback(async () => {
        const data = {
            post_id: post.id,
            reaction_type_id: 1
        };

        try {
            await dispatch(reactToPost(data)).unwrap();
            setLikeStatus(prev => !prev);
        } catch (error) {
            console.error("Error reacting to post:", error);
        }
    }, [post.id, dispatch]);

    const handleComment = useCallback(async (e) => {
        e.preventDefault();

        if (!commentText.trim()) return;

        setIsSubmittingComment(true);

        const commentData = {
            comment: commentText.trim(),
            post_id: post.id,
            parent_comment_id: null
        };

        try {
            const response = await axiosInstance.post("/comments/create", commentData);

            if (response.data) {
                setCommentText("");
                setShowComments(true);
                setComments(prev => [response.data, ...prev]);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmittingComment(false);
        }
    }, [commentText, post.id]);

    const openFullScreen = useCallback((type, src) => {
        setFullScreenMedia({ type, src });
        setFullScreen(true);
    }, []);

    const closeFullScreen = useCallback(() => {
        setFullScreen(false);
    }, []);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (requestRef.current) {
                requestRef.current = null;
            }
        };
    }, []);

    const toggleComments = useCallback(() => {
        if (commentsLoaded) {
            setShowComments(prev => !prev);
        } else {
            showCommentsHandle();
        }
    }, [commentsLoaded, showCommentsHandle]);

    // Render media component
    const renderMedia = useCallback(() => {
        if (!post?.media_link) return null;

        const mediaProps = {
            src: post.media_link,
            alt: "Post media",
            openFullScreen: () => openFullScreen(post.media_type, post.media_link)
        };

        return (
            <React.Suspense fallback={
                <div className="w-full h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                    <div className="text-gray-400">Loading media...</div>
                </div>
            }>
                {post.media_type === 'image' && <ImageMedia {...mediaProps} />}
                {post.media_type === 'video' && <VideoMedia {...mediaProps} />}
                {post.media_type === 'pdf' && <PdfMedia {...mediaProps} />}
            </React.Suspense>
        );
    }, [post?.media_link, post?.media_type, openFullScreen]);

    // Early return if no post
    if (!post) return null;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl mx-auto bg-white mb-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    {post.user?.image ? (
                        <img
                            src={post.user.image}
                            alt={post.user.name || "User"}
                            className="rounded-full w-12 h-12 border-2 border-blue-100 object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                                {(post.user?.name || "U").charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                            {post.user?.name || "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-500">{formattedDate}</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="More options"
                >
                    <MoreHoriz className="h-5 w-5" />
                </motion.button>
            </div>

            {/* Content */}
            <div className="px-4 py-2">
                {post.title && (
                    <motion.p
                        className={`text-gray-800 text-base leading-relaxed ${isExpanded ? "h-auto" : "line-clamp-3"
                            }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {post.title}
                    </motion.p>
                )}

                {shouldShowExpandButton && (
                    <motion.button
                        onClick={() => toggleExpand(post.id)}
                        className="text-blue-600 hover:text-blue-700 mt-2 text-sm font-medium transition-colors"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </motion.button>
                )}

                {/* Media */}
                {post.media_link && (
                    <motion.div
                        className="mt-4 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {renderMedia()}
                    </motion.div>
                )}

                {/* Post metrics */}
                <div className="flex items-center justify-between mt-4 pt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center -space-x-1">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <ThumbsUp className="h-3 w-3 text-white" />
                            </div>
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <Heart className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        <span>{reactionCount} reactions</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleComments}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {post.comments_number || 0} comments
                        </button>
                        <div className="flex items-center gap-1">
                            <React.Suspense fallback={<div className="w-16 h-4 bg-gray-200 animate-pulse rounded" />}>
                                <StarRating
                                    rating={post.post_ratings || 0}
                                    setRating={() => { }}
                                    interactive={false}
                                />
                            </React.Suspense>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
                <motion.button
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${likeStatus
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleLike}
                >
                    <ThumbsUp className={`h-5 w-5 ${likeStatus ? "fill-current" : ""}`} />
                    Like
                </motion.button>

                <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={showCommentsHandle}
                    disabled={isLoadingComments}
                >
                    <MessageCircle className="h-5 w-5" />
                    {isLoadingComments ? "Loading..." : "Comment"}
                </motion.button>

                <motion.button
                    className="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Share2 className="h-5 w-5" />
                    Share
                </motion.button>
            </div>

            {/* Rating section */}
            <div className="px-4 py-3 border-t border-gray-50 bg-gray-50">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Rate this post</h4>
                    <div className="flex items-center gap-2">
                        <React.Suspense fallback={<div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />}>
                            <StarRating rating={userRating} setRating={setUserRating} />
                        </React.Suspense>
                        <AnimatePresence>
                            {userRating > 0 && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-sm text-green-600 font-medium"
                                >
                                    Thanks!
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Comments section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        variants={commentSectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="border-t border-gray-50 overflow-hidden"
                    >
                        <div className="p-4">
                            {/* Comment input */}
                            <form onSubmit={handleComment} className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-medium text-sm">Y</span>
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                    <input
                                        ref={commentInputRef}
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                        disabled={isSubmittingComment}
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={!commentText.trim() || isSubmittingComment}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 w-auto h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full px-3 justify-center transition-colors"
                                    >
                                        <Send className="h-4 w-4 text-white" />
                                        <span className="text-white text-sm">Send</span>
                                    </motion.button>
                                </div>
                            </form>

                            {/* Comments list */}
                            {comments?.length > 0 && (
                                <div className="space-y-3">
                                    <React.Suspense fallback={
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="animate-pulse flex gap-3">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                                        <div className="h-8 bg-gray-200 rounded-xl"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    }>
                                        {comments.map((comment) => (
                                            <Comment key={comment.id} comment={comment} />
                                        ))}
                                    </React.Suspense>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full screen modal */}
            <React.Suspense fallback={null}>
                <FullScreenModal
                    isOpen={fullScreen}
                    onClose={closeFullScreen}
                    mediaType={fullScreenMedia.type}
                    src={fullScreenMedia.src}
                    alt="Full screen media"
                />
            </React.Suspense>
        </motion.div>
    );
});

PostCard.displayName = "PostCard";

export default PostCard;