import React, { useEffect, useState } from 'react';
import { getNotes, createNote, deleteNote, upgradeTenant } from '../api/api';
import NoteItem from '../components/NoteItem';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const tenantSlug = localStorage.getItem('tenantSlug');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createNote({ title, content });
      setTitle('');
      setContent('');
      fetchNotes();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating note');
    }
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  const handleUpgrade = async () => {
    try {
      await upgradeTenant(tenantSlug);
      fetchNotes();
      setError('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl">Notes Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Tenant: <span className="font-medium">{tenantSlug}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Logged in as: <span className="font-medium">{email}</span> ({role})
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create Note */}
      <form onSubmit={handleCreate} className="mb-4">
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Note
        </button>
      </form>

      {/* Error / Upgrade */}
      {error && error.includes('Upgrade') && (
        <div className="mb-4">
          <p className="text-red-500">{error}</p>
          {role === 'admin' ? (
            <button
              onClick={handleUpgrade}
              className="bg-blue-500 text-white p-2 rounded mt-2"
            >
              Upgrade to Pro
            </button>
          ) : (
            <p className="text-gray-500">Ask your Admin to upgrade.</p>
          )}
        </div>
      )}

      {/* Notes List */}
      <div>
        {notes.map(note => (
          <NoteItem key={note._id} note={note} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
