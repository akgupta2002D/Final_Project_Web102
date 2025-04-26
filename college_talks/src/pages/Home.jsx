import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [orderBy, setOrderBy] = useState("created_at");
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    fetchPosts();
  }, [orderBy]);

  async function fetchPosts() {
    const { data } = await supabase
      .from("Posts")
      .select("*")
      .order(orderBy, { ascending: false });
    setPosts(data);
  }

  function handleThemeToggle() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1>🎓 College Talks</h1>
        <button onClick={handleThemeToggle}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </header>

      <Link to="/create">
        <button>➕ Create New Post</button>
      </Link>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={fetchPosts}>🔍</button>
      </div>

      <select onChange={(e) => setOrderBy(e.target.value)}>
        <option value="created_at">Newest</option>
        <option value="upvote">Most Upvoted</option>
      </select>

      {filteredPosts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-title">{post.title}</div>
            <div className="post-info">
              {new Date(post.created_at).toLocaleDateString()} | Upvotes: {post.upvote || 0}
            </div>
          </div>

          {post.image && (
            <img src={post.image} alt="Post visual" className="post-image" />
          )}

          <div className="post-content">
            {post.description ? post.description.substring(0, 300) + "..." : "No description provided."}
          </div>

          <Link to={`/post/${post.id}`}>
            <button>🔎 Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
