/*import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '../firebase'
import { doc as fDoc, getDoc } from 'firebase/firestore'
import { parseYouTubeId } from '../utils'

export default function PatientView(){
  const { id } = useParams()
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    if(!id) return
    setLoading(true)
    const fetchDoc = async ()=>{
      try{
        const snapshot = await getDoc(fDoc(db,'prescriptions', id))
        if(!snapshot.exists()){
          setError('Prescription not found')
          setPrescription(null)
        } else {
          setPrescription({ id: snapshot.id, ...snapshot.data() })
        }
      }catch(err){
        console.error(err)
        setError('Failed to fetch')
      }finally{
        setLoading(false)
      }
    }
    fetchDoc()
    // Optionally, you can set up a real-time listener with onSnapshot if you want live updates.
  },[id])

  if(loading) return <div className="container"><p>Loading…</p></div>
  if(error) return <div className="container"><p>{error}</p><Link to="/admin">Back to Admin</Link></div>
  if(!prescription) return null

  return (
    <div className="container">
      <h2>Prescription for {prescription.patientName}</h2>
      <div className="card">
        <div><strong>Date:</strong> {prescription.date || '—'}</div>
        <div style={{ marginTop: 6 }}>
  <strong>Last Updated:</strong> {prescription.updatedAt ? new Date(prescription.updatedAt).toLocaleString() : '—'}
</div>

        <div style={{marginTop:6}}><strong>Notes:</strong> {prescription.notes || '—'}</div>
      </div>

      <h3>Exercises</h3>
      {prescription.exercises && prescription.exercises.length > 0 ? (
        prescription.exercises.map((ex, idx)=> {
          const videoId = parseYouTubeId(ex.videoUrl)
          return (
            <div key={idx} className="card">
              <strong>{ex.title}</strong>
              <div className="muted">{ex.reps}</div>
              {videoId ? (
                <div className="video-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={ex.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="muted">No valid YouTube URL provided.</div>
              )}
            </div>
          )
        })
      ) : <p>No exercises.</p>}

      <div style={{marginTop:16}}>
        <small className="muted">If your therapist updates this prescription, this page will show the latest version.</small>
      </div>
      <div style={{marginTop:12}}>
        <Link to="/admin">Back to Admin</Link>
      </div>
    </div>
  )
}*/
/*import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '../firebase'
import { doc as fDoc, getDoc } from 'firebase/firestore'
import { parseYouTubeId } from '../utils'

export default function PatientView(){
  const { id } = useParams()
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    if(!id) return
    setLoading(true)
    const fetchDoc = async ()=>{
      try{
        const snapshot = await getDoc(fDoc(db,'prescriptions', id))
        if(!snapshot.exists()){
          setError('Prescription not found')
          setPrescription(null)
        } else {
          setPrescription({ id: snapshot.id, ...snapshot.data() })
        }
      }catch(err){
        console.error(err)
        setError('Failed to fetch')
      }finally{
        setLoading(false)
      }
    }
    fetchDoc()
  },[id])

  if(loading) return <div className="container"><p>Loading…</p></div>
  if(error) return (
    <div className="container">
      <p>{error}</p>
      <Link to="/admin" className="secondary">Back to Admin</Link>
    </div>
  )
  if(!prescription) return null

  return (
    <div className="container">
      <h2>Prescription for {prescription.patientName}</h2>
      <div className="card">
        <div><strong>Date:</strong> {prescription.date || '—'}</div>
        <div style={{marginTop:6}}><strong>Notes:</strong> {prescription.notes || '—'}</div>
        <div style={{marginTop:6}}>
          <strong>Last Updated:</strong> {prescription.updatedAt ? new Date(prescription.updatedAt).toLocaleString() : '—'}
        </div>
      </div>

      <h3>Exercises</h3>
      {prescription.exercises && prescription.exercises.length > 0 ? (
        prescription.exercises.map((ex, idx)=> {
          const videoId = parseYouTubeId(ex.videoUrl)
          return (
            <div key={idx} className="card">
              <strong>{ex.title}</strong>
              <div className="muted">{ex.reps}</div>
              {videoId ? (
                <div className="video-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={ex.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="muted">No valid YouTube URL provided.</div>
              )}
            </div>
          )
        })
      ) : <p>No exercises.</p>}

      <div style={{marginTop:16}}>
        <small className="muted">If your therapist updates this prescription, this page will show the latest version.</small>
      </div>
      
    </div>
  )
}*/

/*import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '../firebase'
import { doc as fDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { parseYouTubeId } from '../utils'

export default function PatientView() {
  const { patientName, id } = useParams()
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openExercise, setOpenExercise] = useState({})
  
  // Feedback state
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    const fetchDoc = async () => {
      try {
        const snapshot = await getDoc(fDoc(db, 'prescriptions', id))
        if (!snapshot.exists()) {
          setError('Prescription not found')
          setPrescription(null)
        } else {
          setPrescription({ id: snapshot.id, ...snapshot.data() })
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch')
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [id])

  const toggleExercise = (idx) => {
    setOpenExercise(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  async function submitFeedback() {
    if (!feedbackText.trim()) return
    try {
      const feedbackRef = collection(db, 'prescriptions', id, 'feedback')
      await addDoc(feedbackRef, {
        feedbackText,
        createdAt: serverTimestamp()
      })
      setFeedbackStatus('✅ Feedback submitted. Thank you!')
      setFeedbackText('')
      setTimeout(() => setFeedbackStatus(''), 4000)
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setFeedbackStatus('❌ Failed to submit feedback. Try again.')
    }
  }

  if (loading) return <div className="container"><p>Loading…</p></div>
  if (error) return (
    <div className="container">
      <p>{error}</p>
      <Link to="/admin" className="secondary">Back to Admin</Link>
    </div>
  )
  if (!prescription) return null

  return (
    <div className="container">
      <h2>Prescription for {prescription.patientName}</h2>
      <div className="card">
        <div><strong>Date:</strong> {prescription.date || '—'}</div>
        <div style={{ marginTop: 6 }}><strong>Notes:</strong> {prescription.notes || '—'}</div>
        <div style={{ marginTop: 6 }}>
          <strong>Last Updated:</strong> {prescription.updatedAt ? new Date(prescription.updatedAt).toLocaleString() : '—'}
        </div>
      </div>

      <h3>Exercises</h3>
      {prescription.exercises && prescription.exercises.length > 0 ? (
        prescription.exercises.map((ex, idx) => {
          const videoId = parseYouTubeId(ex.videoUrl)
          const isOpen = openExercise[idx]
          return (
            <div key={idx} className="card">
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => toggleExercise(idx)}
              >
                <div>
                  <strong>{ex.title}</strong>
                  <div className="muted">{ex.reps}</div>
                </div>
                <span>{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <div style={{ marginTop: 8 }}>
                  {videoId ? (
                    <div className="video-wrap">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={ex.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="muted">No valid YouTube URL provided.</div>
                  )}
                </div>
              )}
            </div>
          )
        })
      ) : <p>No exercises.</p>}

      {/* Feedback Form *//*}
      <div style={{ marginTop: 24 }}>
        <h3>Leave Feedback</h3>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Write your feedback..."
          rows={3}
          style={{ width: '100%', marginBottom: 8 }}
        />
        <button onClick={submitFeedback}>Submit Feedback</button>
        {feedbackStatus && <p style={{ marginTop: 8 }}>{feedbackStatus}</p>}
      </div>

      <div style={{ marginTop: 16 }}>
        <small className="muted">If your therapist updates this prescription, this page will show the latest version.</small>
      </div>
    </div>
  )
}*/

import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '../firebase'
import { doc as fDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { parseYouTubeId } from '../utils'
import '../PatientView.css'

export default function PatientView() {
  const { patientName, id } = useParams()
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openExercise, setOpenExercise] = useState({})
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    const fetchDoc = async () => {
      try {
        const snapshot = await getDoc(fDoc(db, 'prescriptions', id))
        if (!snapshot.exists()) {
          setError('Prescription not found')
          setPrescription(null)
        } else {
          setPrescription({ id: snapshot.id, ...snapshot.data() })
        }
      } catch (err) {
        console.error(err)
        setError('Failed to fetch')
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [id])

  const toggleExercise = (idx) => {
    setOpenExercise(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  async function submitFeedback() {
    if (!feedbackText.trim()) return
    try {
      await addDoc(collection(db, 'feedback'), {
        prescriptionId: id,
        patientName: prescription?.patientName || '',
        feedbackText,
        createdAt: serverTimestamp()
      })
      setFeedbackStatus('✅ Feedback submitted. Thank you!')
      setFeedbackText('')
      setTimeout(() => setFeedbackStatus(''), 4000)
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setFeedbackStatus('❌ Failed to submit feedback. Try again.')
    }
  }

  if (loading) return <div className="container"><p>Loading…</p></div>
  if (error) return (
    <div className="container">
      <p>{error}</p>
      <Link to="/admin" className="secondary">Back to Admin</Link>
    </div>
  )
  if (!prescription) return null

  return (
    <div className="pv-bg">
      {/* Header */}
      <div className="pv-header">
        <h1 className="pv-header-title">
          {prescription.patientName ? `Hello, ${prescription.patientName}` : 'Your Prescription'}
        </h1>
        <div className="pv-header-desc">
          Your personalized physiotherapy plan
        </div>
      </div>

      {/* Main container */}
      <div className="container pv-main">
        {/* Prescription summary */}
        <div className="card pv-summary-card">
          <div className="pv-summary-main">
            <div className="pv-summary-date">
              <span role="img" aria-label="calendar">📅</span> Date: <span>{prescription.date || '—'}</span>
            </div>
            <div className="pv-summary-notes">
              <span role="img" aria-label="note">📝</span> Notes: <span>{prescription.notes || '—'}</span>
            </div>
            <div className="pv-summary-updated">
              <span role="img" aria-label="clock">⏱️</span> Last Updated: {prescription.updatedAt ? new Date(prescription.updatedAt).toLocaleString() : '—'}
            </div>
          </div>
          <div className="pv-summary-id">
            Prescription ID<br />
            <span>{prescription.id}</span>
          </div>
        </div>

        {/* Exercises */}
        <h3 className="pv-ex-title">
          <span role="img" aria-label="dumbbell">🏋️‍♂️</span> Your Exercises
        </h3>
        {prescription.exercises && prescription.exercises.length > 0 ? (
          prescription.exercises.map((ex, idx) => {
            const videoId = parseYouTubeId(ex.videoUrl)
            const isOpen = openExercise[idx]
            return (
              <div
                key={idx}
                className="card pv-ex-card"
              >
                <div
                  className={`pv-ex-row${videoId ? ' pv-ex-row-clickable' : ''}`}
                  onClick={videoId ? () => toggleExercise(idx) : undefined}
                >
                  <div>
                    <strong className="pv-ex-title-text">{ex.title}</strong>
                    <div className="muted pv-ex-reps">{ex.reps}</div>
                    {ex.notes && (
                      <div className="pv-ex-notes">
                        <span role="img" aria-label="note">📝</span> {ex.notes}
                      </div>
                    )}
                  </div>
                  {videoId && (
                    <button
                      type="button"
                      className={`pv-ex-toggle-btn${isOpen ? ' open' : ''}`}
                    >
                      {isOpen ? 'Hide Video' : 'Show Video'}
                    </button>
                  )}
                </div>
                {isOpen && videoId && (
                  <div className="pv-ex-video-wrap">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={ex.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}
                {!videoId && (
                  <div className="muted pv-ex-no-video">No valid YouTube URL provided.</div>
                )}
              </div>
            )
          })
        ) : <p className="muted" style={{ marginBottom: 24 }}>No exercises.</p>}

        {/* Feedback Form */}
        <div className="card pv-feedback-card">
          <h3 className="pv-feedback-title">
            <span role="img" aria-label="feedback">💬</span> Leave Feedback
          </h3>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Write your feedback..."
            rows={3}
            className="pv-feedback-textarea"
          />
          <button
            onClick={submitFeedback}
            className="pv-feedback-btn"
          >
            Submit Feedback
          </button>
          {feedbackStatus && <p className="pv-feedback-status">{feedbackStatus}</p>}
        </div>

        <div className="pv-footer-note">
          <small className="muted">
            If your therapist updates this prescription, this page will show the latest version.
          </small>
        </div>
      </div>
    </div>
  )
}


