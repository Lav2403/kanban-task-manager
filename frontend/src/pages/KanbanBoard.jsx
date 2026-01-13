import { useContext, useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

function FancyBackground() {
  return (
    <>
      {/* soft blobs */}
      <div
        style={{
          position: "fixed",
          top: -80,
          left: -80,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(79,70,229,0.22)",
          filter: "blur(40px)",
          zIndex: -1
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -90,
          right: -90,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(6,182,212,0.22)",
          filter: "blur(45px)",
          zIndex: -1
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 220,
          right: 120,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(16,185,129,0.18)",
          filter: "blur(40px)",
          zIndex: -1
        }}
      />
    </>
  );
}

export default function KanbanBoard() {
  const { token, user, doLogout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Modal (Edit task)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState("");

  const headers = useMemo(() => {
    return { headers: { Authorization: `Bearer ${token}` } };
  }, [token]);

  // ✅ helper to show message and auto-clear
  const showMessage = (msg) => {
    setInfo(msg);
    setTimeout(() => setInfo(""), 2000);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks", headers);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
      showMessage("❌ Unable to load tasks. Please refresh once.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Add Task
  const addTask = async () => {
    setInfo("");

    if (!title.trim() || !dueDate) {
      showMessage("⚠️ Please enter title and due date.");
      return;
    }

    try {
      await api.post(
        "/tasks",
        {
          title: title.trim(),
          description: desc.trim(),
          due_date: dueDate
        },
        headers
      );

      setTitle("");
      setDesc("");
      setDueDate("");
      showMessage("✅ Task added to Pending!");
      fetchTasks();
    } catch (err) {
      showMessage(err.response?.data?.message || "❌ Could not create task.");
    }
  };

  // ✅ Delete Task
  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`, headers);
      showMessage("🗑️ Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      console.log(err);
      showMessage("❌ Unable to delete task.");
    }
  };

  // ✅ Update Status (Pending / In Progress / Completed)
  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status }, headers);

      if (status === "pending") {
        showMessage("🕒 Task moved to Pending.");
      } else if (status === "in-progress") {
        showMessage("🚀 Task moved to In Progress.");
      } else if (status === "completed") {
        showMessage("✅ Task marked as Completed successfully!");
      }

      fetchTasks();
    } catch (err) {
      console.log(err);
      showMessage("❌ Status update failed.");
    }
  };

  // ✅ Drag end handler
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const nextStatus = result.destination.droppableId;

    await updateTaskStatus(taskId, nextStatus);
  };

  const columns = [
    {
      id: "pending",
      label: "Pending",
      badge: "🕒",
      tint: "rgba(255,247,237,0.65)",
      border: "#fdba74"
    },
    {
      id: "in-progress",
      label: "In Progress",
      badge: "🚀",
      tint: "rgba(239,246,255,0.65)",
      border: "#93c5fd"
    },
    {
      id: "completed",
      label: "Completed",
      badge: "✅",
      tint: "rgba(236,253,245,0.65)",
      border: "#6ee7b7"
    }
  ];

  const grouped = {
    pending: tasks.filter((t) => t.status === "pending"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    completed: tasks.filter((t) => t.status === "completed")
  };

  // ✅ Open Edit Modal
  const openEditModal = (task) => {
    setEditId(task._id);
    setEditTitle(task.title || "");
    setEditDesc(task.description || "");
    setEditDate(task.due_date ? task.due_date.slice(0, 10) : "");
    setIsEditOpen(true);
  };

  // ✅ Save Edit Task
  const saveEdit = async () => {
    setInfo("");

    if (!editTitle.trim() || !editDate) {
      showMessage("⚠️ Title and due date cannot be empty.");
      return;
    }

    try {
      await api.put(
        `/tasks/${editId}`,
        {
          title: editTitle.trim(),
          description: editDesc.trim(),
          due_date: editDate
        },
        headers
      );

      setIsEditOpen(false);
      showMessage("✅ Task updated successfully!");
      fetchTasks();
    } catch (err) {
      console.log(err);
      showMessage("❌ Failed to update task.");
    }
  };

  const StatPill = ({ icon, label, value }) => (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(0,0,0,0.06)",
        fontSize: 13,
        display: "flex",
        gap: 8,
        alignItems: "center",
        backdropFilter: "blur(10px)"
      }}
    >
      <span>{icon}</span>
      <span style={{ color: "#475569" }}>{label}:</span>
      <b style={{ color: "#0f172a" }}>{value}</b>
    </div>
  );

  return (
    <div style={{ padding: 18, minHeight: "100vh" }}>
      <FancyBackground />

      {/* ✅ Glass Container */}
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          borderRadius: 20,
          background: "rgba(255,255,255,0.70)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 18px 60px rgba(15, 23, 42, 0.14)",
          backdropFilter: "blur(12px)",
          padding: 16
        }}
      >
        {/* ✅ Header */}
        <div
          style={{
            borderRadius: 18,
            padding: 16,
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.18), rgba(6,182,212,0.18))",
            border: "1px solid rgba(0,0,0,0.06)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>✨ Kanban Dashboard</h2>
              <p style={{ margin: "6px 0 0", color: "#475569" }}>
                Visual workflow — drag tasks and save status in MongoDB.
              </p>
            </div>

            {/* ✅ Right side buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="badge">👤 {user?.name || "User"}</span>

              <button
                onClick={() => (window.location.href = "/profile")}
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.7)",
                  cursor: "pointer"
                }}
              >
                Profile
              </button>

              <button
                onClick={doLogout}
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.7)",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <StatPill icon="📌" label="Total" value={tasks.length} />
            <StatPill icon="🕒" label="Pending" value={grouped.pending.length} />
            <StatPill icon="🚀" label="In Progress" value={grouped["in-progress"].length} />
            <StatPill icon="✅" label="Completed" value={grouped.completed.length} />
          </div>

          {loading && <p style={{ marginTop: 10 }}>⏳ Loading tasks...</p>}
          {!loading && info && <p style={{ marginTop: 10 }}>{info}</p>}
        </div>

        {/* ✅ Add Task Panel */}
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 18,
            background: "rgba(255,255,255,0.60)",
            border: "1px solid rgba(0,0,0,0.06)",
            backdropFilter: "blur(10px)"
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              className="field"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ flex: 1, minWidth: 220 }}
            />

            <input
              className="field"
              placeholder="Short description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{ flex: 1, minWidth: 220 }}
            />

            <input
              className="field"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ width: 170 }}
            />

            <button className="btn-primary" onClick={addTask} style={{ width: 160 }}>
              + Add Task
            </button>
          </div>
        </div>

        {/* ✅ Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14 }}>
            {columns.map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      width: 330,
                      minHeight: 470,
                      padding: 12,
                      borderRadius: 18,
                      background: col.tint,
                      border: `1px solid ${col.border}`,
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0 }}>
                        {col.badge} {col.label}
                      </h3>
                      <span className="badge">{grouped[col.id].length}</span>
                    </div>

                    {grouped[col.id].length === 0 && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: 12,
                          borderRadius: 14,
                          background: "rgba(255,255,255,0.6)",
                          border: "1px dashed rgba(0,0,0,0.15)",
                          color: "#475569",
                          fontSize: 13
                        }}
                      >
                        No tasks here. Add a task or drag one into this column.
                      </div>
                    )}

                    <div style={{ marginTop: 12 }}>
                      {grouped[col.id].map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                borderRadius: 16,
                                padding: 12,
                                marginBottom: 10,
                                background: "rgba(255,255,255,0.85)",
                                border: "1px solid rgba(0,0,0,0.06)",
                                boxShadow: "0 12px 25px rgba(15, 23, 42, 0.10)",
                                backdropFilter: "blur(10px)",
                                ...provided.draggableProps.style
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                <b style={{ fontSize: 14 }}>{task.title}</b>

                                <div style={{ display: "flex", gap: 10 }}>
                                  <button
                                    onClick={() => openEditModal(task)}
                                    title="Edit task"
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      cursor: "pointer",
                                      fontSize: 16
                                    }}
                                  >
                                    ✏️
                                  </button>

                                  <button
                                    onClick={() => deleteTask(task._id)}
                                    title="Delete task"
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      cursor: "pointer",
                                      fontSize: 16
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#334155" }}>
                                {task.description || "No description"}
                              </p>

                              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748b" }}>
                                📅 {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* ✅ Edit Modal */}
      {isEditOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            padding: 16
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 18,
              background: "rgba(255,255,255,0.92)",
              padding: 16,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              backdropFilter: "blur(12px)"
            }}
          >
            <h3 style={{ margin: 0 }}>✏️ Edit Task</h3>
            <p style={{ marginTop: 6, color: "#64748b" }}>
              Update task details and save changes.
            </p>

            <label style={{ fontSize: 13, color: "#334155" }}>Title</label>
            <input
              className="field"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ marginTop: 6, marginBottom: 10 }}
            />

            <label style={{ fontSize: 13, color: "#334155" }}>Description</label>
            <input
              className="field"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              style={{ marginTop: 6, marginBottom: 10 }}
            />

            <label style={{ fontSize: 13, color: "#334155" }}>Due Date</label>
            <input
              className="field"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              style={{ marginTop: 6, marginBottom: 14 }}
            />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setIsEditOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.7)",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              <button className="btn-primary" onClick={saveEdit} style={{ width: 140 }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
