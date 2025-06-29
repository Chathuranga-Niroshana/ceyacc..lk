/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";


const Comment = ({ comment, level = 0 }) => {
    const [showReplies, setShowReplies] = useState(level < 1);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const submitReply = (e) => {
        e.preventDefault();
        if (replyText.trim()) {
            // Here you would handle the reply submission
            console.log("Reply submitted:", replyText);
            setReplyText("");
            setIsReplying(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 ${level > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}
        >
            <div className="flex gap-3 items-start">
                <img
                    src={comment.user.image}
                    alt={`${comment.user.first_name} profile`}
                    className="rounded-full w-8 h-8 mr-3"
                />
                <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                        <div
                            style={{ padding: '0px 16px', }} className="flex gap-3 justify-between items-center mb-1">
                            <h4 className="font-bold text-sm">{comment.user.first_name} {comment.user.last_name}</h4>
                            <span className="text-xs text-gray-500 ml-2">
                                {formatDistanceToNow(new Date(comment.date), { addSuffix: true })}
                            </span>
                        </div>
                        <p
                            style={{ padding: '8px 16px', margin: '8px', }} className="text-sm">{comment.text}</p>
                    </div>

                    <div className="flex gap-4 items-center mt-1 space-x-4">
                        <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Like</button>
                        <button
                            className="text-xs text-gray-500 hover:text-blue-500 transition-colors"
                            onClick={() => setIsReplying(!isReplying)}
                        >
                            Reply
                        </button>
                    </div>

                    {isReplying && (
                        <form onSubmit={submitReply} className="mt-3 flex">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 bg-gray-100 rounded-l-full py-2 px-4 text-sm focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white rounded-r-full px-4 text-sm"
                            >
                                Reply
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <>
                    <button
                        className="text-xs text-blue-500 mt-1 flex items-center"
                        onClick={() => setShowReplies(!showReplies)}
                    >
                        {showReplies ? (
                            <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Hide replies
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                Show {comment.replies.length} replies
                            </>
                        )}
                    </button>

                    <AnimatePresence>
                        {showReplies && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                {comment.replies.map((reply, index) => (
                                    <Comment key={index} comment={reply} level={level + 1} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.div>
    );
};

export default Comment