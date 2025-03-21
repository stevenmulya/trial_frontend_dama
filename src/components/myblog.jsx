import React, { useState, useEffect } from "react";

const Myblog = () => {
    const [myblogs, setMyblogs] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://trial-backend-dama.vercel.app/myblogs");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMyblogs(data);
            } catch (error) {
                console.error("Error fetching myblogs:", error);
                setMessage("Failed to load blogs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const filteredBlogs = myblogs.filter((blog) => {
        const search = searchTerm.toLowerCase();
        const title = blog.myblog_title.toLowerCase();
        const content = blog.myblog_content.toLowerCase();
        return title.includes(search) || content.includes(search);
    });

    const handleBlogClick = (blogTitle) => {
        let sanitizedTitle = blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const encodedTitle = encodeURIComponent(sanitizedTitle);
        window.location.href = `/blog/${encodedTitle}`;
    };

    const truncateContent = (content) => {
        if (!content) return "";
        const lines = content.split("\n");
        return lines[0];
    };

    const styles = {
        section: {
            fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            maxWidth: "800px",
            margin: "40px auto",
            padding: "0 20px",
            cursor: "pointer",
        },
        message: {
            color: "red",
            marginBottom: "20px",
        },
        loading: {
            marginBottom: "20px",
        },
        searchBar: {
            marginBottom: "20px",
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
        },
        blogItem: {
            marginBottom: "40px",
            borderBottom: "1px solid #eee",
            paddingBottom: "30px",
            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "flex-start",
        },
        image: {
            width: "30%",
            height: "auto",
            maxHeight: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            marginLeft: "20px",
        },
        textContainer: {
            flex: 1,
        },
        title: {
            fontSize: "2.5rem",
            fontWeight: "700",
            lineHeight: "1.2",
            marginBottom: "10px",
            color: "#222",
        },
        authorDate: {
            fontSize: "0.9rem",
            color: "#777",
            marginBottom: "10px",
        },
        content: {
            fontSize: "1.1rem",
            lineHeight: "1.6",
            color: "#555",
        },
    };

    return (
        <section style={styles.section}>
            <input
                type="text"
                style={styles.searchBar}
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {message && <p style={styles.message}>{message}</p>}
            {loading && <p style={styles.loading}>Loading...</p>}
            <div>
                {filteredBlogs.map((blog) => (
                    <div
                        key={blog.id}
                        style={styles.blogItem}
                        onClick={() => handleBlogClick(blog.myblog_title)}
                    >
                        {blog.myblog_image && (
                            <img
                                src={blog.myblog_image}
                                alt={blog.myblog_title}
                                style={styles.image}
                            />
                        )}
                        <div style={styles.textContainer}>
                            <h2 style={styles.title}>{blog.myblog_title}</h2>
                            <p style={styles.authorDate}>
                                By {blog.myblog_author} | {blog.myblog_date}
                            </p>
                            <p style={styles.content}>{truncateContent(blog.myblog_content)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Myblog;