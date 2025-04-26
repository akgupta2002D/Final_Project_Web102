import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  async function fetchPost() {
    const { data } = await supabase.from("Posts").select("*").eq("id", id).single();
    setPost(data);
  }

  async function fetchComments() {
    const { data } = await supabase.from("Comment").select("*").eq("id", id);
    setComments(data);
  }

  async function handleUpvote() {
    await supabase.from("Posts").update({ upvote: (post.upvote || 0) + 1 }).eq("id", id);
    fetchPost();
  }

  async function handleDelete() {
    await supabase.from("Posts").delete().eq("id", id);
    navigate("/");
  }

  async function handleAddComment(e) {
    e.preventDefault();
    await supabase.from("Comment").insert([{ id: post.id, text: newComment }]);
    setNewComment("");
    fetchComments();
  }

  async function handleEdit() {
    const newTitle = prompt("Enter new title", post.title);
    if (newTitle) {
      await supabase.from("Posts").update({ title: newTitle }).eq("id", id);
      fetchPost();
    }
  }

  return (
    <div className="post-details-wrapper">
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {post.image && <img src={post.image} alt="Post" className="post-image" />}
      <p>Upvotes: {post.upvote || 0}</p>
  
      <div className="post-actions">
        <button onClick={handleUpvote}>Upvote</button>
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
  
      <h2>Comments:</h2>
      {comments.map((c) => (
        <p key={c.created_at}>{c.text}</p>
      ))}
  
      <form onSubmit={handleAddComment}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment"
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
  
}
