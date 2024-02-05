import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

class Note {
  id: number = -1;
  title: string = '';
  content: string = '';
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const newNote: Note = {
    id: notes.length + 1,
    title: title,
    content: content,
  }

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          })
        }
      );

      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setTitle('')
      setContent('')

    } catch (err) {
      console.log(err)
    }

  }

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedNote) return

    const response = await fetch(
      `http://localhost:5000/api/notes/${selectedNote.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      }
    ); 

    const updatedNote = await response.json()

    const updatedNotesList = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note))
    setNotes(updatedNotesList)
    setTitle('');
    setContent('');
    setSelectedNote(null)
  };

  const handleCancel = () => {
    setTitle('')
    setContent('')
    setSelectedNote(null)
  }

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
  };

  const deleteNote = (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation()

    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes)
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes");
      const jsonResponse = await response.json()
      const notes: Note[] = jsonResponse.result
      console.log(JSON.stringify(notes))
      if (Array.isArray(notes)) {
        setNotes(notes)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //empty dependency array ensures that this code only runs once the component is first mounted
  useEffect(() => {
    fetchNotes();
  },);

  return (
    <div className="app-container">
      <form className='note-form' onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleAddNote(event))}>
        <input placeholder='Title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required>
        </input>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder='Content'
          rows={10} required></textarea>

        {selectedNote ? (
          <div className='edit-buttons'>
            <button type='submit'>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type='submit'>Add Note</button>
        )}
      </form>

      <div className='notes-grid'>
        {notes.map((note) => (
          <div key={note.id} className='note-item'
            onClick={() => handleNoteClick(note)}
          >
            <div className='notes-header'>
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

