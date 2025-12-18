import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa"; // React Icons

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: auto;
  padding: 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #fff;
  /* background: linear-gradient(145deg, #0d0d0d, #1a1a1a); */
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  color: #00aaff;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background: black;
  border: 1px solid #353535;
  color: white;
  &:focus {
    border-color: #3f51ff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background: black;
  border: 1px solid #353535;
  color: white;
  resize: vertical;
  &:focus {
    border-color: #3f51ff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  background: #194bfd;
  background: linear-gradient(
    90deg,
    rgba(25, 75, 253, 1) 0%,
    rgba(173, 19, 251, 1) 100%
  );
  transition: all 0.3s ease;
  color: #ffffff;

  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5a189a;
    box-shadow: 0 6px 16px rgba(90, 24, 154, 0.5);
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const NoteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const NoteCard = styled.div`
  background: #1e1e1e;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);

  h3 {
    margin-top: 0;
    color: #00aaff;
  }

  p {
    color: #ccc;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;

    button {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    .edit {
      background-color: #ffaa00;
      color: #121212;

      &:hover {
        background-color: #e69a00;
      }
    }

    .delete {
      background-color: #ff4d4d;
      color: white;

      &:hover {
        background-color: #e04343;
      }
    }
  }
`;

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const addOrUpdateNote = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/notes/${editingId}`, 
form);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/notes", form);
      }
      fetchNotes();
      setForm({ title: "", content: "" });
    } catch (error) {
      console.error("Error adding/updating note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const editNote = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
  };

  useEffect(() => {
    fetchNotes();
  }, []);


  return (
    <Container>
      <Title>📝 Notes App</Title>
      <Form>
        <Input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextArea
          placeholder="Content"
          rows={4}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <Button onClick={addOrUpdateNote}>
          {editingId ? "Update Note" : "Add Note"}
        </Button>
      </Form>

      <h2 style={{ color: "#ccc" }}>All Notes</h2>
      <NoteGrid>
        {notes.map((note) => (
          <NoteCard key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="actions">
              <button className="edit" onClick={() => editNote(note)}>
                <FaEdit /> Edit
              </button>
              <button className="delete" onClick={() => deleteNote(note._id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </NoteCard>
        ))}
      </NoteGrid>
    </Container>
  );
}

export default App;

