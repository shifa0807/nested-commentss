
import { useState } from 'react'

const initialComments = [
  {
    id: 1,
    author: 'Priya Sharma',
    text: 'This is a really interesting post! I learned something new today.',
    time: '2 hours ago',
    replies: [
      {
        id: 2,
        author: 'Rahul Verma',
        text: 'Absolutely! I found it useful too.',
        time: '1 hour ago',
        replies: [
          {
            id: 3,
            author: 'Ananya Patel',
            text: 'Same here. Thanks for sharing!',
            time: '30 minutes ago',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    author: 'Aarav Singh',
    text: 'Great explanation. Looking forward to more posts!',
    time: '1 hour ago',
    replies: [],
  },
]

function CommentItem({ comment, onReply, onDelete }) {
  const [replyText, setReplyText] = useState('')
  const [showReply, setShowReply] = useState(false)

  const submitReply = (e) => {
    e.preventDefault()

    if (!replyText.trim()) return

    onReply(comment.id, replyText)
    setReplyText('')
    setShowReply(false)
  }

  return (
    <div className="mt-5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
          {comment.author.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="rounded-xl bg-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900">
                {comment.author}
              </h3>
              <span className="text-xs text-gray-500">
                {comment.time}
              </span>
            </div>

            <p className="mt-2 break-words text-sm leading-6 text-gray-700">
              {comment.text}
            </p>
          </div>

          <div className="mt-2 flex gap-4 text-sm">
            <button
              onClick={() => setShowReply(!showReply)}
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Reply
            </button>

            <button
              onClick={() => onDelete(comment.id)}
              className="font-semibold text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>

          {showReply && (
            <form onSubmit={submitReply} className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          )}

          {comment.replies.length > 0 && (
            <div className="ml-2 border-l-2 border-gray-200 pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')

  const addReply = (parentId, replyText) => {
    const reply = {
      id: Date.now() + Math.random(),
      author: 'Shifa Shaikh',
      text: replyText,
      time: 'Just now',
      replies: [],
    }

    const addReplyToTree = (items) =>
      items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [...item.replies, reply],
          }
        }

        return {
          ...item,
          replies: addReplyToTree(item.replies),
        }
      })

    setComments((previous) => addReplyToTree(previous))
  }

  const deleteComment = (commentId) => {
    const removeFromTree = (items) =>
      items
        .filter((item) => item.id !== commentId)
        .map((item) => ({
          ...item,
          replies: removeFromTree(item.replies),
        }))

    setComments((previous) => removeFromTree(previous))
  }

  const addComment = (e) => {
    e.preventDefault()

    if (!newComment.trim()) return

    const comment = {
      id: Date.now() + Math.random(),
      author: 'Shifa Shaikh',
      text: newComment,
      time: 'Just now',
      replies: [],
    }

    setComments((previous) => [...previous, comment])
    setNewComment('')
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Nested Comments
          </h1>
          <p className="mt-2 text-gray-500">
            Share your thoughts and join the conversation.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Leave a Comment
          </h2>

          <form onSubmit={addComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              rows="4"
              className="w-full resize-none rounded-xl border border-gray-300 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Post Comment
              </button>
            </div>
          </form>

          <div className="my-7 border-t border-gray-200" />

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Comments
            </h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {comments.length} comments
            </span>
          </div>

          {comments.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={addReply}
                  onDelete={deleteComment}
                />
              ))}
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-sm text-gray-400">
          Nested Comments & Replies Application
        </p>
      </div>
    </div>
  )
}

export default App
