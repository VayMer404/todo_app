"use client";

import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  // загрузка задач
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);
  const toggleTask = async (id: number) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
    });

    const updated = await res.json();

    setTasks((prev: any) =>
      prev.map((task: any) => (task.id === id ? updated : task)),
    );
  };
  const updateTask = async (id: number) => {
    console.log("UPDATE ID:", id);

    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
      }),
    });

    if (!res.ok) return;

    const updated = await res.json();

    setTasks((prev: any) => prev.map((t: any) => (t.id === id ? updated : t)));

    setEditId(null);
    setEditTitle("");
  };

  // создание задачи
  const createTask = async () => {
    if (!title.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev: any) => [newTask, ...prev]);
      setTitle("");
    }
  };

  // удаление задачи
  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks((prev: any) => prev.filter((task: any) => task.id !== id));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название задачи"
      />

      <button onClick={createTask}>Создать</button>

      <div style={{ marginTop: "20px" }}>
        {tasks.map((task: any) => (
          <div key={task.id} style={{ marginBottom: "10px" }}>
            <span
              style={{
                textDecoration: task.status ? "line-through" : "none",
                marginRight: "10px",
              }}
            >
              {task.title}
            </span>

            {/* ГАЛОЧКА */}
            <button
              onClick={() => toggleTask(task.id)}
              style={{ marginLeft: "10px" }}
            >
              {task.status ? "☑" : "☐"}
            </button>

            {/* РЕДАКТИРОВАТЬ */}
            <button
              onClick={() => {
                const newTitle = prompt("Новое название задачи:", task.title);

                if (!newTitle || newTitle === task.title) return;

                fetch(`/api/tasks/${task.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    title: newTitle,
                  }),
                })
                  .then((res) => res.json())
                  .then((updated) => {
                    setTasks((prev: any) =>
                      prev.map((t: any) => (t.id === task.id ? updated : t)),
                    );
                  });
              }}
              style={{ marginLeft: "10px" }}
            >
              ✏️
            </button>

            {/* УДАЛИТЬ */}
            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "10px" }}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <LogoutButton />
      </div>
    </div>
  );
}
