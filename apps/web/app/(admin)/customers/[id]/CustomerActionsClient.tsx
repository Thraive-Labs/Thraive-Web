'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Note {
  id: string
  note: string
  date: string
}

interface Props {
  customerId: string
  existingNotes: Note[]
}

export default function CustomerActionsClient({ customerId, existingNotes }: Props) {
  const [notes, setNotes] = useState<Note[]>(existingNotes)
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function saveNote() {
    if (!noteText.trim()) return
    setSavingNote(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('customer_notes').insert({
      customer_id: customerId,
      staff_id: user!.id,
      note: noteText.trim(),
    }).select('id, note, created_at').single()

    if (error) {
      showToast('Failed to save note.')
    } else if (data) {
      setNotes((prev) => [
        { id: data.id as string, note: data.note as string, date: new Date(data.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
        ...prev,
      ])
      setNoteText('')
      showToast('Note saved.')
    }
    setSavingNote(false)
  }

  return (
    <>
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#1F2937',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '12px 18px',
            fontSize: 13,
            color: '#E5E7EB',
            zIndex: 9999,
          }}
        >
          {toast}
        </div>
      )}

      {/* Admin notes */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563', marginBottom: 12 }}>
        Admin Notes
      </p>
      <div
        style={{
          background: '#111113',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          padding: '16px 20px',
        }}
      >
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add an internal note..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#0A0A0B',
            color: '#F9FAFB',
            fontSize: 14,
            resize: 'vertical',
            lineHeight: 1.6,
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button
            type="button"
            onClick={saveNote}
            disabled={savingNote || !noteText.trim()}
            style={{
              padding: '7px 18px',
              borderRadius: 8,
              background: savingNote ? '#374151' : '#6366F1',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: savingNote ? 'not-allowed' : 'pointer',
            }}
          >
            {savingNote ? 'Saving...' : 'Save note'}
          </button>
        </div>

        {notes.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notes.map((n) => (
              <div
                key={n.id}
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: 10,
                }}
              >
                <p style={{ fontSize: 13, color: '#D1D5DB', lineHeight: 1.6 }}>{n.note}</p>
                <p style={{ fontSize: 11, color: '#4B5563', marginTop: 4 }}>{n.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
