import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

class Note {
  id: number = -1;
  title: string = '';
  content: string = '';
}

function App() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'test note 1',
      content: 'bal sjfdkfdj dfjd ffe'
    },
    {
      id: 2,
      title: 'test note 2',
      content: 'bal sjfdkfdj dfjd ffe'
    },
    {
      id: 3,
      title: 'test note 3',
      content: 'bal sjfdkfdj dfjd ffe'
    },
    {
      id: 4,
      title: 'test note 4',
      content: 'bal sjfdkfdj dfjd ffe'
    },
    {
      id: 5,
      title: 'test note 5',
      content: 'bal sjfdkfdj dfjd ffe'
    },
    {
      id: 6,
      title: 'test note 6',
      content: 'bal sjfdkfdj dfjd ffe'
    },
  ])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const newNote: Note = {
    id: notes.length + 1,
    title: title,
    content: content,
  }

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    setNotes([newNote, ...notes])
  }

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedNote) return

    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content
    }

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

