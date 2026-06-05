import React from "react"
import { DELETE_COMMENT } from "../utils/mutations/commentMutations"
import { useMutation } from "@apollo/client"
import { FiTrash2 } from "react-icons/fi"
import toast from "../utils/toast"

const CommentSection = ({ comments = [], songId }) => {
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")
    const [removeComment] = useMutation(DELETE_COMMENT)

    const handleRemove = async (commentId, commentAuthor) => {
        try {
            await removeComment({
                variables: { songId, commentId, token, commentAuthor },
            })
            toast.success("Comment removed.")
        } catch (err) {
            toast.error("Couldn't remove comment.")
        }
    }

    if (!comments.length) {
        return (
            <div className="sf-comments-empty">
                No comments yet — start the conversation.
            </div>
        )
    }

    return (
        <div className="sf-comments">
            {comments.map((c) => (
                <div className="sf-comment" key={c._id}>
                    <div className="sf-comment-avatar">
                        {c.commentAuthor?.charAt(0).toUpperCase()}
                    </div>
                    <div className="sf-comment-body">
                        <span className="sf-comment-author">
                            {c.commentAuthor}
                        </span>
                        <span className="sf-comment-text">{c.commentText}</span>
                    </div>
                    {c.commentAuthor === username && (
                        <button
                            className="sf-comment-del"
                            onClick={() => handleRemove(c._id, c.commentAuthor)}
                            aria-label="Delete comment"
                        >
                            <FiTrash2 />
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default CommentSection
