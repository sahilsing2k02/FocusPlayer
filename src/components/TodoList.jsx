import { useState } from "react";
import "../index.css";

export default function TodoList({ todos, setTodos }) {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setTodos([...todos, { id: Date.now(), text: inputValue.trim(), done: false }]);
        setInputValue("");
    };

    const toggleTodo = (id) => {
        setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((t) => t.id !== id));
    };

    return (
        <div className="todo-list-container" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", background: "var(--c-overlay-strong)", borderRadius: "16px", padding: "10px", border: "1px solid var(--panel-border)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)", width: "100%", boxSizing: "border-box" }}>
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", color: "var(--text-main)", padding: "0 8px", outline: "none", fontSize: "14px", fontFamily: "Outfit" }}
                />
                <button type="submit" style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-gradient)", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 15px var(--accent-glow)", flexShrink: 0 }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }}>
                {todos.length === 0 ? (
                    <div style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "30px 0", fontFamily: "Outfit" }}>No tasks yet. You're all caught up! ✨</div>
                ) : (
                    todos.map((todo) => (
                        <div key={todo.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--c-overlay-light)", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.03)", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.background = "var(--c-overlay)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.background = "var(--c-overlay-light)"; }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                <div onClick={() => toggleTodo(todo.id)} style={{ width: "24px", height: "24px", borderRadius: "8px", border: `2px solid ${todo.done ? "var(--success-color)" : "var(--panel-border)"}`, background: todo.done ? "var(--success-color)" : "var(--c-solid-bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }}>
                                    {todo.done && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                </div>
                                <span style={{ fontSize: "15px", fontWeight: todo.done ? "500" : "600", fontFamily: "Outfit", color: todo.done ? "var(--text-muted)" : "var(--text-main)", textDecoration: todo.done ? "line-through" : "none", wordBreak: "break-word", transition: "all 0.2s", opacity: todo.done ? 0.6 : 1 }}>
                                    {todo.text}
                                </span>
                            </div>
                            <button onClick={() => deleteTodo(todo.id)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", width: "32px", height: "32px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} title="Delete task" onMouseEnter={(e) => { e.currentTarget.style.background = "var(--danger-color)"; e.currentTarget.style.color = "white"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(239, 68, 68, 0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.boxShadow = "none"; }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
            {todos.length > 0 && (
                <div style={{ fontSize: "11px", color: "var(--accent-color)", textAlign: "right", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "Outfit" }}>
                    {todos.filter((t) => t.done).length} / {todos.length} COMPLETED
                </div>
            )}
        </div>
    );
}
