import { useState, useEffect } from "react";
import "../index.css";

export default function TodoList() {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem("focus_todos");
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        localStorage.setItem("focus_todos", JSON.stringify(todos));
    }, [todos]);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setTodos([...todos, { id: Date.now(), text: inputValue.trim(), done: false }]);
        setInputValue("");
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="todo-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <form onSubmit={handleAdd} style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', padding: '6px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)' }}>
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '0 16px', outline: 'none', fontSize: '14px' }}
                />
                <button type="submit" style={{ background: 'var(--accent-gradient)', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(217, 70, 239, 0.25)' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    Add
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                {todos.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>✨ No tasks yet. Add one!</div>
                ) : (
                    todos.map(todo => (
                        <div key={todo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(217, 70, 239, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div onClick={() => toggleTodo(todo.id)} style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${todo.done ? 'var(--success-color)' : 'rgba(255,255,255,0.3)'}`, background: todo.done ? 'var(--success-color)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    {todo.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                </div>
                                <span style={{ fontSize: '14px', color: todo.done ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: todo.done ? 'line-through' : 'none', wordBreak: 'break-word', transition: 'color 0.2s' }}>
                                    {todo.text}
                                </span>
                            </div>
                            <button onClick={() => deleteTodo(todo.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#fca5a5', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} title="Delete task" onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#fca5a5'; }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
            {todos.length > 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 'bold' }}>
                    {todos.filter(t => t.done).length} / {todos.length} COMPLETED
                </div>
            )}
        </div>
    );
}
