/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow, differenceInHours } from "date-fns";
import { CommentOutlined } from "@mui/icons-material";
import ImageMedia from "./ImageMedia";
import VideoMedia from "./VideoMedia";
import PdfMedia from "./PdfMedia";
import FullScreenModal from "./MediaFullScreen";
import Comment from "./CommentCard";
import ReactionPicker from "./ReactionPicker";
import StarRating from "./PostRating";
import {
    ThumbsUp,
    Heart,
    Smile,
    Zap,
    Flame
} from "lucide-react";


const PostCard = ({ post }) => {
    const [expandedPosts, setExpandedPosts] = useState({});
    const [showComments, setShowComments] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [userRating, setUserRating] = useState(0);
    const [likeStatus, setLikeStatus] = useState(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [fullScreenMedia, setFullScreenMedia] = useState({ type: null, src: null });

    const commentInputRef = useRef(null);

    const toggleExpand = (id) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleLike = (reaction = "Like") => {
        setLikeStatus(prev => prev === reaction ? null : reaction);
    };

    const handleComment = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            // Here you would handle the comment submission
            console.log("Comment submitted:", commentText);
            setCommentText("");
            setShowComments(true);
        }
    };

    const openFullScreen = (type, src) => {
        setFullScreenMedia({ type, src });
        setFullScreen(true);
    };

    const isExpanded = expandedPosts[post?.id];
    const descriptionClass = isExpanded ? "h-auto" : "line-clamp-2";

    const postDate = new Date(post?.created_at);
    const now = new Date();
    const hoursDifference = differenceInHours(now, postDate);

    const formattedDate =
        hoursDifference < 24
            ? formatDistanceToNow(postDate, { addSuffix: true })
            : format(postDate, "MMMM d, yyyy");

    const renderMedia = () => {
        if (!post?.media_link) return null;

        switch (post?.media_type) {
            case 'image':
                return (
                    <ImageMedia
                        src={post?.media_link}
                        alt="Post image"
                        openFullScreen={() => openFullScreen('image', post?.media_link)}
                    />
                );
            case 'video':
                return (
                    <VideoMedia
                        src={post?.media_link}
                        openFullScreen={() => openFullScreen('video', post?.media_link)}
                    />
                );
            case 'pdf':
                return (
                    <PdfMedia
                        src={post?.media_link}
                        openFullScreen={() => openFullScreen('pdf', post?.media_link)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl mx-auto bg-white mb-6 rounded-xl shadow-lg overflow-hidden"
            style={{ padding: '0px' }}
        >
            {/* Header */}
            <motion.div
                className="w-full flex items-center justify-between  shadow-sm"
                style={{ padding: '16px' }}
            >
                <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {post?.user.image && (
                        <img
                            src={post?.user.image}
                            alt="Profile"
                            className="rounded-full w-12 h-12 mr-4 border-2 border-[#90093A]"
                        />
                    )}
                    <div>
                        <h2 className="font-bold text-gray-800">
                            {post?.user.name}
                        </h2>
                        <div className="flex items-center">
                            <p className="text-xs text-gray-500">{formattedDate}</p>
                        </div>
                    </div>
                </motion.div>
                <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-500 p-2 rounded-full "
                >
                    <Zap className="h-5 w-5" />
                </motion.button>
            </motion.div>

            {/* Content */}
            <div className="w-full flex flex-col items-center" style={{ padding: '16px', paddingBottom: 0, }}>
                <motion.p
                    className={`w-full text-gray-700 ${descriptionClass} text-base`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {post?.title}
                </motion.p>

                {post?.title.length > 100 && (
                    <motion.button
                        onClick={() => toggleExpand(post?.id)}
                        className="text-blue-500 hover:text-blue-700 mt-2 self-start text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isExpanded ? "See less" : "See more"}
                    </motion.button>
                )}

                <motion.div
                    style={{ marginTop: '16px', }}
                    className="w-full mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {renderMedia()}
                </motion.div>

                {/* Post metrics */}
                <div style={{ marginTop: '16px', }} className="w-full flex items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                        <div className="flex  -space-x-1">
                            <div className="rounded-full bg-blue-500 p-1">
                                <ThumbsUp className="h-3 w-3 text-white" />
                            </div>
                            <div className="rounded-full bg-red-500 p-1">
                                <Heart className="h-3 w-3 text-white" />
                            </div>
                            <div className="rounded-full bg-yellow-500 p-1">
                                <Flame className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        <span className="ml-2">{post?.reactions?.length + (likeStatus ? 1 : 0)}</span>
                    </div>

                    <div className="flex gap-4 space-x-4">
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="hover:underline"
                        >
                            {post?.comments ? post?.comments.length : 0} comments
                        </button>
                        <div className="flex items-center">
                            <StarRating rating={post?.post_ratings.source || 0} setRating={() => { }} interactive={false} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div
                className="w-full flex items-center justify-between shadow-2xl"
                style={{ padding: '8px 16px' }}
            >
                <div className="relative">
                    <motion.button
                        className={`flex items-center px-4 py-2 rounded-full  transition ${likeStatus ? "text-blue-500 font-medium" : "text-gray-600"
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => setShowReactions(true)}
                        onHoverEnd={() => setShowReactions(false)}
                        onClick={() => handleLike()}
                    >
                        <ThumbsUp className={`h-5 w-5 mr-2 ${likeStatus ? "text-blue-500" : "text-gray-500"}`} />
                        {likeStatus || "Like"}
                    </motion.button>

                    <ReactionPicker
                        isOpen={showReactions}
                        onClose={() => setShowReactions(false)}
                        onSelect={handleLike}
                    />
                </div>

                <motion.button
                    className="flex items-center px-4 py-2 rounded-full  transition text-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setShowComments(!showComments);
                        if (!showComments) {
                            setTimeout(() => {
                                commentInputRef.current?.focus();
                            }, 100);
                        }
                    }}
                >
                    <CommentOutlined className="h-5 w-5 mr-2 text-gray-500" />
                    Comment
                </motion.button>
                {/* 
                <motion.button
                    className="flex items-center px-4 py-2 rounded-full  transition text-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ShareIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Share
                </motion.button> */}
            </div>

            {/* Rating section */}
            <AnimatePresence>
                <motion.div
                    className="border-b"
                    style={{ padding: '12px 16px' }}
                    initial={{ opacity: 1, height: "auto" }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700">Rate this post:</h3>
                        <div className="flex items-center">
                            <StarRating rating={userRating} setRating={setUserRating} />
                            {userRating > 0 && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-2 text-sm text-green-500"
                                >
                                    Thanks for rating!
                                </motion.span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Comments section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div style={{ padding: '16px' }}>
                            <form onSubmit={handleComment} className="flex items-center">
                                <img
                                    src="https://target.scene7.com/is/image/Target/GUEST_6cf1cae5-d543-42c3-8eed-88420a38c5c3"
                                    alt="Your profile"
                                    className="rounded-full w-8 h-8 mr-3 border-2 border-[#90093A]"
                                />
                                <input
                                    ref={commentInputRef}
                                    type="text"
                                    style={{ padding: '8px 16px', margin: '8px', }}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </form>

                            {post?.comments && post?.comments?.length > 0 && (
                                <div style={{ padding: '8px 16px', margin: '8px', }} className="mt-4">
                                    {post?.comments?.map((comment, index) => (
                                        <Comment key={index + 1} comment={comment} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full screen modal */}
            <FullScreenModal
                isOpen={fullScreen}
                onClose={() => setFullScreen(false)}
                mediaType={fullScreenMedia.type}
                src={fullScreenMedia.src}
                alt="Full screen media"
            />
        </motion.div>
    );
};

export default PostCard;