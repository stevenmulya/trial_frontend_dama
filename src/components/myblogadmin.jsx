import React, { useState, useEffect } from "react";

const MyBlogAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    myblog_title: "",
    myblog_image: null,
    myblog_content: "",
    myblog_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/myblogs");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setMessage("Failed to load posts.");
    }
  };

  const addPost = async () => {
    if (!newPost.myblog_title || !newPost.myblog_image) {
      setMessage("Post title and image are required.");
      return;
    }

    if (newPost.myblog_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newPost.myblog_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myblog_title", newPost.myblog_title);
      formData.append("myblog_image", newPost.myblog_image);
      formData.append("myblog_content", newPost.myblog_content);
      formData.append("myblog_date", newPost.myblog_date);

      const response = await fetch("https://trial-backend-dama.vercel.app/myblogs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Post added successfully!");
        fetchPosts();
        setNewPost({
          myblog_title: "",
          myblog_image: null,
          myblog_content: "",
          myblog_date: "",
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add post: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding post:", error);
      setMessage(`Failed to add post: ${error.message}`);
    }
    setLoading(false);
  };

  const updatePost = async () => {
    if (!newPost.myblog_title) {
      setMessage("Post title is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myblog_title", newPost.myblog_title);
      formData.append("myblog_image", newPost.myblog_image);
      formData.append("myblog_content", newPost.myblog_content);
      formData.append("myblog_date", newPost.myblog_date);

      const response = await fetch(`https://trial-backend-dama.vercel.app/myblogs/${selectedPost.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Post updated successfully!");
        fetchPosts();
        setNewPost({
          myblog_title: "",
          myblog_image: null,
          myblog_content: "",
          myblog_date: "",
        });
        setSelectedPost(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update post: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage(`Failed to update post: ${error.message}`);
    }
    setLoading(false);
  };

  const deletePost = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/myblogs/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Post deleted successfully!");
        fetchPosts();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete post: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage("Failed to delete post.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewPost({ ...newPost, myblog_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setNewPost({
      myblog_title: post.myblog_title,
      myblog_content: post.myblog_content,
      myblog_date: post.myblog_date,
      myblog_image: null,
    });
    setImagePreview(post.myblog_image);
  };

  return (
    <div>
      {message && <p>{message}</p>}

      <div>
        <input type="text" placeholder="Post Title" value={newPost.myblog_title} onChange={(e) => setNewPost({ ...newPost, myblog_title: e.target.value })} />
        <textarea placeholder="Post Content" value={newPost.myblog_content} onChange={(e) => setNewPost({ ...newPost, myblog_content: e.target.value })} />
        <input type="date" value={newPost.myblog_date} onChange={(e) => setNewPost({ ...newPost, myblog_date: e.target.value })} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px" }} />}
        <button onClick={selectedPost ? updatePost : addPost} disabled={loading}>
          {loading ? (selectedPost ? "Updating..." : "Adding...") : selectedPost ? "Update Post" : "Add Post"}
        </button>
      </div>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <img src={post.myblog_image} alt={post.myblog_title} style={{ maxWidth: "100px" }} />
            <h2>{post.myblog_title}</h2>
            <p>{post.myblog_content}</p>
            <p>Date: {post.myblog_date}</p>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => deletePost(post.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBlogAdmin;