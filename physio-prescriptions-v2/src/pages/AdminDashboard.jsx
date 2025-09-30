import React, { useEffect, useState } from 'react'
import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { parseYouTubeId } from '../utils'
import '../AdminDashboard.css'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminDashboard() {
  // --- Prescriptions state ---
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [exercises, setExercises] = useState([{ title: '', videoUrl: '', reps: '', notes: '' }]);
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Patients state ---
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');

  // --- Exercises state ---
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseUrl, setNewExerciseUrl] = useState('');
  const [exercisesList, setExercisesList] = useState([]); // all exercises
  const [loadingExercises, setLoadingExercises] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Autocomplete states for Patient name input
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [exerciseSuggestions, setExerciseSuggestions] = useState([]); // For current exercise row
  const [showExerciseSuggestions, setShowExerciseSuggestions] = useState([]); // Array of booleans per row
  // --- Tabs ---
  const [activeTab, setActiveTab] = useState('create');

  // Feedback state
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [editingExerciseId, setEditingExerciseId] = useState(null);

  useEffect(() => {
    //if (!user) return; // Don't fetch data if user is not authenticated
    if (activeTab === 'saved' || activeTab === 'create') fetchPrescriptions();
    else if (activeTab === 'patients') fetchPatients();
    else if (activeTab === 'exercises') fetchExercises();
    else if (activeTab === 'feedback') fetchFeedback();
    // eslint-disable-next-line
  }, [activeTab])

  useEffect(() => {
    // Always fetch patients and exercises on mount for autocomplete
    fetchPatients();
    fetchExercises();
    // eslint-disable-next-line
  }, []);

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Only allow a specific admin email (optional)
  const adminEmail = "dr.unnatilodha@gmail.com"; // <-- set your admin email here

  useEffect(() => {
    if (authChecked && (!user || user.email !== adminEmail)) {
      navigate("/admin-login", { replace: true });
    }
  }, [authChecked, user, navigate, adminEmail]);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  if (!user || user.email !== adminEmail) {
    return null; // Don't render dashboard while redirecting
  }

  function showToastMessage(message) {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  // Fetch Prescriptions
  async function fetchPrescriptions() {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'prescriptions'))
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      arr.sort((a, b) => {
        if (!a.date) return 1
        if (!b.date) return -1
        return b.date.localeCompare(a.date)
      })
      setPrescriptions(arr)
    } catch (e) {
      console.error('Error fetching prescriptions', e)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Patients
  async function fetchPatients() {
    setLoadingPatients(true)
    try {
      const snap = await getDocs(collection(db, 'patients'))
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setPatients(arr)
    } catch (e) {
      console.error('Error fetching patients', e)
    } finally {
      setLoadingPatients(false)
    }
  }

  // Fetch Exercises
  async function fetchExercises() {
    setLoadingExercises(true);
    try {
      const snap = await getDocs(collection(db, 'exercises'));
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setExercisesList(arr);
    } catch (e) {
      console.error('Error fetching exercises', e);
    } finally {
      setLoadingExercises(false);
    }
  }

  // Fetch feedback for all prescriptions
  async function fetchFeedback() {
    setLoadingFeedback(true);
    try {
      const snap = await getDocs(collection(db, 'feedback'));
      let feedbackArr = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt
          ? (typeof docSnap.data().createdAt.toDate === 'function'
              ? docSnap.data().createdAt.toDate()
              : new Date(docSnap.data().createdAt))
          : null,
      }));
      // Sort by date, newest first
      feedbackArr.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
      setFeedbackList(feedbackArr);
    } catch (err) {
      console.error('Error fetching feedback', err);
    } finally {
      setLoadingFeedback(false);
    }
  }

  // Create Patient
  async function createPatient(e) {
    e.preventDefault()
    if (!newPatientName.trim()) {
      alert('Patient name is required')
      return
    }
    try {
      await addDoc(collection(db, 'patients'), {
        name: newPatientName,
        email: newPatientEmail,
        phone: newPatientPhone,
        createdAt: new Date().toISOString(),
      })
      setNewPatientName('')
      setNewPatientEmail('')
      setNewPatientPhone('')
      fetchPatients()
      showToastMessage('Patient created successfully');
    } catch (err) {
      console.error('Error creating patient', err)
      showToastMessage('Failed to create patient. Please try again.');
    }
  }

  async function handleDeletePatient(id) {
    if (!window.confirm('Delete this patient? This will not delete their prescriptions.')) return
    try {
      await deleteDoc(doc(db, 'patients', id))
      fetchPatients()
    } catch (err) {
      console.error('Delete patient failed', err)
      showToastMessage('Failed to delete patient. Please try again.');  
    }
  }

  // Prescription helpers
  function addExerciseRow() {
    setExercises(prev => [...prev, { title: '', videoUrl: '', reps: '', notes: '' }])
  }
  function updateExercise(idx, field, value) {
    setExercises(prev => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
    if (field === 'title') {
      // Show suggestions for this row
      const matches = exercisesList
        .filter(ex => ex.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setExerciseSuggestions(prev => {
        const arr = [...prev];
        arr[idx] = matches;
        return arr;
      });
      setShowExerciseSuggestions(prev => {
        const arr = [...prev];
        arr[idx] = matches.length > 0 && value.length > 0;
        return arr;
      });
    }
  }
  function removeExercise(idx) {
    setExercises(prev => prev.filter((_, i) => i !== idx))
  }

  // Autocomplete handlers for Patient Name input
  function onPatientNameChange(e) {
    const input = e.target.value
    setPatientName(input)

    if (input.length === 0) {
      setFilteredSuggestions([])
      setShowSuggestions(false)
      return
    }

    const matches = patients
      .filter(p => p.name.toLowerCase().startsWith(input.toLowerCase()))
      .slice(0, 5) // limit suggestions

    setFilteredSuggestions(matches)
    setShowSuggestions(matches.length > 0)
  }

  function onSuggestionClick(name) {
    setPatientName(name)
    setFilteredSuggestions([])
    setShowSuggestions(false)
  }

  function validateForm() {
    if (!patientName.trim()) {
      alert('Patient name is required')
      return false
    }
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i]
      if (!ex.title.trim()) {
        alert(`Exercise ${i + 1}: Title is required`)
        return false
      }
      if (ex.videoUrl.trim() && !parseYouTubeId(ex.videoUrl)) {
        alert(`Exercise ${i + 1}: Invalid YouTube URL`)
        return false
      }
    }
    return true
  }

  function buildPayload() {
    return {
      patientName,
      date,
      exercises: exercises.map(e => ({
        title: e.title || 'Exercise',
        videoUrl: e.videoUrl || '',
        reps: e.reps || '',
        notes: e.notes || '',
      })),
      updatedAt: new Date().toISOString(),
    }
  }

  async function addExercise() {
    if (!newExerciseName.trim() || !newExerciseUrl.trim()) return;
    try {
      await addDoc(collection(db, 'exercises'), {
        name: newExerciseName.trim(),
        url: newExerciseUrl.trim(),
        createdAt: new Date().toISOString(),
      });
      setNewExerciseName('');
      setNewExerciseUrl('');
      fetchExercises(); // Refresh the list after adding
      showToastMessage('Exercise added!');
    } catch (err) {
      console.error('Error adding exercise', err);
      showToastMessage('Failed to add exercise.');
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!validateForm()) return
    const payload = buildPayload()
    try {
      if (editingId) {
        await updateDoc(doc(db, 'prescriptions', editingId), payload)
        setEditingId(null)
      } else {
        await addDoc(collection(db, 'prescriptions'), payload)
      }
      clearForm()
      fetchPrescriptions()
      setActiveTab('saved')
    } catch (err) {
      console.error('Save failed', err)
      alert('Failed to save prescription. Please try again.')
    }
  }

  function clearForm() {
    setPatientName('')
    setDate('')
    setExercises([{ title: '', videoUrl: '', reps: '', notes: '' }])
    setEditingId(null)
  }

  async function handleEdit(id) {
    try {
      const snapshot = await getDoc(doc(db, 'prescriptions', id))
      if (!snapshot.exists()) {
        alert('Prescription not found')
        return
      }
      const data = snapshot.data()
      setPatientName(data.patientName || '')
      setDate(data.date || '')
      setExercises(data.exercises || [{ title: '', videoUrl: '', reps: '', notes: '' }])
      setEditingId(id)
      setActiveTab('create')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Edit failed', err)
      showToastMessage('Failed to load prescription. Please try again.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this prescription?')) return
    try {
      await deleteDoc(doc(db, 'prescriptions', id))
      fetchPrescriptions()
    } catch (err) {
      console.error('Delete failed', err)
      showToastMessage('Failed to delete prescription. Please try again.');
    }
  }

  function copyLink(id, patientName) {
    const patientSlug = patientName.trim().toLowerCase().replace(/\s+/g, '-')
    const prescriptionUrl = `${window.location.origin}/${patientSlug}/prescription/${id}`
    navigator.clipboard.writeText(prescriptionUrl)
    showToastMessage('Link copied to clipboard!')
  }

  async function handleDeleteExercise(id) {
    if (!window.confirm('Delete this exercise?')) return;
    try {
      await deleteDoc(doc(db, 'exercises', id));
      fetchExercises();
      showToastMessage('Exercise deleted!');
    } catch (err) {
      console.error('Error deleting exercise', err);
      showToastMessage('Failed to delete exercise.');
    }
  }

  async function handleEditExercise(ex) {
    setEditingExerciseId(ex.id);
    setNewExerciseName(ex.name);
    setNewExerciseUrl(ex.url);
  }

  async function handleUpdateExercise() {
    if (!editingExerciseId) return;
    try {
      await updateDoc(doc(db, 'exercises', editingExerciseId), {
        name: newExerciseName.trim(),
        url: newExerciseUrl.trim(),
      });
      setEditingExerciseId(null);
      setNewExerciseName('');
      setNewExerciseUrl('');
      fetchExercises();
      showToastMessage('Exercise updated!');
    } catch (err) {
      console.error('Error updating exercise', err);
      showToastMessage('Failed to update exercise.');
    }
  }

  function onExerciseSuggestionClick(idx, suggestion) {
    setExercises(prev =>
      prev.map((e, i) =>
        i === idx
          ? { ...e, title: suggestion.name, videoUrl: suggestion.url }
          : e
      )
    );
    setShowExerciseSuggestions(prev => {
      const arr = [...prev];
      arr[idx] = false;
      return arr;
    });
  }

  function handleSignOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      window.location.href = '/admin-login'; // or use navigate('/admin-login')
    });
  }

  return (
    <div className={`admin-dashboard${sidebarOpen ? ' sidebar-open' : ''}`}>
      {/* Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            zIndex: 9999,
            opacity: showToast ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          {toastMessage}
        </div>
      )}
      {/* Sidebar menu */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button
          className="sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ×
        </button>
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => {
            setActiveTab('create');
            clearForm();
          }}
        >
          Create Prescription
        </button>
        <button
          className={activeTab === 'saved' ? 'active' : ''}
          onClick={() => setActiveTab('saved')}
        >
          Saved Prescriptions
        </button>
        <button
          className={activeTab === 'patients' ? 'active' : ''}
          onClick={() => setActiveTab('patients')}
        >
          Patients
        </button>
        <button
          className={activeTab === 'exercises' ? 'active' : ''}
          onClick={() => setActiveTab('exercises')}
        >
          Exercises
        </button>
        <button
          className={activeTab === 'feedback' ? 'active' : ''}
          onClick={() => setActiveTab('feedback')}
        >
          Feedback
        </button>
      </aside>

      {/* Header bar */}
      <header className="header-bar">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open sidebar"
        >
          <span className="sidebar-hamburger"></span>
        </button>
        Physio Prescriptions Admin
        {/* Add Sign Out button here */}
        <button
          onClick={handleSignOut}
          style={{
            marginLeft: 'auto',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '6px 16px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Main content */}
      <main className="content">
        {/* Create / Edit Prescription */}
        {activeTab === 'create' && (
          <>
            <h2>{editingId ? 'Edit Prescription' : 'New Prescription'}</h2>
            <form onSubmit={handleSave} className="card" autoComplete="off">
              <label style={{ position: 'relative' }}>
                Patient name
                <input
                  value={patientName}
                  onChange={onPatientNameChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() =>
                    patientName && filteredSuggestions.length > 0 && setShowSuggestions(true)
                  }
                  required
                  autoComplete="off"
                />
                {showSuggestions && (
                  <ul className="suggestions-list">
                    {filteredSuggestions.map(s => (
                      <li key={s.id} onClick={() => onSuggestionClick(s.name)}>
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </label>
              <label>
                Date
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </label>

              <h4>Exercises</h4>
              {exercises.map((ex, idx) => {
                const videoId = parseYouTubeId(ex.videoUrl);
                return (
                  <div
                    className="exercise-row"
                    key={idx}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      marginBottom: 16,
                      padding: 12,
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexWrap: 'wrap'
                    }}>
                      <input
                        placeholder="Title"
                        value={ex.title}
                        onChange={e => updateExercise(idx, 'title', e.target.value)}
                        onFocus={() => {
                          if (ex.title) {
                            const matches = exercisesList
                              .filter(exSaved => exSaved.name.toLowerCase().includes(ex.title.toLowerCase()))
                              .slice(0, 5);
                            setExerciseSuggestions(prev => {
                              const arr = [...prev];
                              arr[idx] = matches;
                              return arr;
                            });
                            setShowExerciseSuggestions(prev => {
                              const arr = [...prev];
                              arr[idx] = matches.length > 0;
                              return arr;
                            });
                          }
                        }}
                        onBlur={() => setTimeout(() => {
                          setShowExerciseSuggestions(prev => {
                            const arr = [...prev];
                            arr[idx] = false;
                            return arr;
                          });
                        }, 200)}
                        required
                        autoComplete="off"
                        style={{ flex: '2 1 200px' }}
                      />
                      {/* Exercise suggestions dropdown */}
                      {showExerciseSuggestions[idx] && exerciseSuggestions[idx] && exerciseSuggestions[idx].length > 0 && (
                        <ul className="suggestions-list" style={{ zIndex: 10 }}>
                          {exerciseSuggestions[idx].map(suggestion => (
                            <li
                              key={suggestion.id}
                              onClick={() => onExerciseSuggestionClick(idx, suggestion)}
                            >
                              {suggestion.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <input
                        placeholder="YouTube URL"
                        value={ex.videoUrl}
                        onChange={e => updateExercise(idx, 'videoUrl', e.target.value)}
                        style={{ flex: '2 1 200px' }}
                      />
                      <input
                        placeholder="Reps / sets"
                        value={ex.reps}
                        onChange={e => updateExercise(idx, 'reps', e.target.value)}
                        style={{ flex: '1 1 100px' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExercise(idx)}
                        className="small"
                        style={{ 
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: 4
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    {/* Notes field for this exercise */}
                    <div style={{ marginTop: 8 }}>
                      <label style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#555',
                        marginBottom: 4,
                        display: 'block'
                      }}>
                        Notes for this exercise:
                      </label>
                      <textarea
                        placeholder="Add specific notes for this exercise..."
                        value={ex.notes}
                        onChange={e => updateExercise(idx, 'notes', e.target.value)}
                        style={{
                          width: '100%',
                          minHeight: '60px',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: 4,
                          resize: 'vertical',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    {/* Inline YouTube iframe */}
                    {videoId && (
                      <iframe
                        width="100%"
                        height="300"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Exercise Video ${idx + 1}`}
                        style={{
                          borderRadius: 6,
                          marginTop: 8,
                          maxWidth: '400px'
                        }}
                      />
                    )}
                  </div>
                );
              })}

              <button type="button" onClick={addExerciseRow} className="add-exercise-btn">
                Add Exercise
              </button>


              <div className="form-buttons">
                <button type="submit">{editingId ? 'Update Prescription' : 'Create Prescription'}</button>
                <button type="button" onClick={clearForm} className="secondary">
                  Clear
                </button>
              </div>
            </form>
          </>
        )}

        {/* Saved Prescriptions */}
        {activeTab === 'saved' && (
          <>
            <h2>Saved Prescriptions!</h2>
            {loading ? (
              <p>Loading prescriptions...</p>
            ) : prescriptions.length === 0 ? (
              <p>No prescriptions yet</p>
            ) : (
              prescriptions.map(p => (
                <div key={p.id} className="card small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{p.patientName}</strong>{' '}
                      <span className="muted">({p.date || 'no date'})</span>
                      <br />
                      <span className="muted">ID: {p.id}</span>
                      <br />
                      <small className="muted">
                        Updated: {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '—'}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(p.id)}>Edit</button>
                      <button onClick={() => copyLink(p.id, p.patientName)}>Copy Link</button>
                      <button onClick={() => handleDelete(p.id)} className="danger">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {p.exercises &&
                      p.exercises.slice(0, 2).map((ex, i) => (
                        <div key={i} className="muted">
                          {i + 1}. {ex.title} — {ex.reps}
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <>
            <h2>Patients</h2>
            <form onSubmit={createPatient} className="card patient-form">
              <label>
                Name
                <input
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={newPatientEmail}
                  onChange={e => setNewPatientEmail(e.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  value={newPatientPhone}
                  onChange={e => setNewPatientPhone(e.target.value)}
                />
              </label>
              <button type="submit">Create Patient</button>
            </form>

            <h3>Existing Patients</h3>
            {loadingPatients ? (
              <p>Loading patients...</p>
            ) : patients.length === 0 ? (
              <p>No patients yet.</p>
            ) : (
              patients.map(p => (
                <div key={p.id} className="card small">
                  <strong>{p.name}</strong>
                  <br />
                  {p.email && <span>{p.email} <br /></span>}
                  {p.phone && <span>{p.phone} <br /></span>}
                  <button
                    onClick={() => handleDeletePatient(p.id)}
                    className="danger small"
                    style={{ marginTop: '5px' }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </>
        )}
        
        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <>
            <h2>Exercises</h2>

            {/* Add Exercise Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (editingExerciseId) {
                  handleUpdateExercise();
                } else {
                  addExercise();
                }
              }}
              className="card"
              style={{ marginBottom: '2rem' }}
            >
              <label>
                Name
                <input
                  type="text"
                  value={newExerciseName}
                  onChange={e => setNewExerciseName(e.target.value)}
                  required
                />
              </label>
              <label>
                YouTube URL
                <input
                  type="url"
                  value={newExerciseUrl}
                  onChange={e => setNewExerciseUrl(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="add-exercise-btn">
                {editingExerciseId ? 'Update Exercise' : 'Add Exercise'}
              </button>
              {editingExerciseId && (
                <button
                  type="button"
                  className="secondary"
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    setEditingExerciseId(null);
                    setNewExerciseName('');
                    setNewExerciseUrl('');
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            {/* Exercises List */}
            {exercisesList.length === 0 ? (
              <p>No exercises added yet.</p>
            ) : (
              exercisesList.map((ex, idx) => {
                const videoId = parseYouTubeId(ex.url);
                const thumbnailUrl = videoId
                  ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                  : null;

                return (
                  <div
                    key={ex.id || idx}
                    className="card small"
                    style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    <strong>{ex.name}</strong>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={`Thumbnail for ${ex.name}`}
                          style={{
                            width: 160,
                            height: 90,
                            borderRadius: 6,
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 160,
                            height: 90,
                            borderRadius: 6,
                            backgroundColor: '#ddd',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#999',
                            fontSize: 14,
                          }}
                        >
                          No thumbnail
                        </div>
                      )}

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ex.url);
                          showToastMessage('Link copied to clipboard!');
                        }}
                        style={{
                          marginLeft: 'auto',
                          padding: '6px 12px',
                          backgroundColor: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: '600',
                          userSelect: 'none',
                        }}
                        title="Copy YouTube link"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleEditExercise(ex)}
                        style={{
                          marginLeft: 8,
                          padding: '6px 12px',
                          backgroundColor: '#f1c40f',
                          color: '#222',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: '600',
                          userSelect: 'none',
                        }}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(ex.id)}
                        style={{
                          marginLeft: 8,
                          padding: '6px 12px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: '600',
                          userSelect: 'none',
                        }}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={async () => {
                const added = await syncExercisesFromPrescriptions();
                alert(`${added} new exercises added from prescriptions!`);
                fetchExercises(); // Refresh the list
              }}
              style={{
                marginBottom: 16,
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sync Exercises from Prescriptions
            </button>
          </>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <>
            <h2>Patient Feedback</h2>
            {loadingFeedback ? (
              <p>Loading feedback...</p>
            ) : feedbackList.length === 0 ? (
              <p>No feedback yet.</p>
            ) : (
              feedbackList.map(fb => (
                <div key={fb.id} className="card small">
                  <div>
                    <strong>Patient:</strong> {fb.patientName || <span className="muted">Unknown</span>}
                    <br />
                    <strong>Prescription ID:</strong> {fb.prescriptionId}
                    <br />
                    <strong>Feedback:</strong>
                    <div style={{ margin: '6px 0' }}>{fb.feedbackText}</div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {fb.createdAt ? fb.createdAt.toLocaleString() : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
}

//import { db, collection, getDocs, addDoc } from '../firebase';

async function syncExercisesFromPrescriptions() {
  // 1. Fetch all exercises in the library
  const exercisesSnap = await getDocs(collection(db, 'exercises'));
  const existingUrls = new Set();
  exercisesSnap.forEach(doc => {
    const data = doc.data();
    if (data.url) existingUrls.add(data.url.trim());
  });

  // 2. Fetch all prescriptions
  const prescriptionsSnap = await getDocs(collection(db, 'prescriptions'));
  const newExercises = [];

  prescriptionsSnap.forEach(doc => {
    const data = doc.data();
    if (Array.isArray(data.exercises)) {
      data.exercises.forEach(ex => {
        const url = ex.videoUrl?.trim();
        const name = ex.title?.trim();
        if (url && name && !existingUrls.has(url)) {
          newExercises.push({ name, url });
          existingUrls.add(url); // Prevent duplicates in this run
        }
      });
    }
  });

  // 3. Add new exercises to the library
  for (const ex of newExercises) {
    await addDoc(collection(db, 'exercises'), {
      name: ex.name,
      url: ex.url,
      createdAt: new Date().toISOString(),
    });
  }

  return newExercises.length;
}

