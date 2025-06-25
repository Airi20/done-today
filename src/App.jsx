import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('doneTodayRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('doneTodayRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    setRecords([
      ...records,
      {
        id: Date.now(),
        text: input.trim(),
        date: selectedDate.toLocaleDateString(),
        time: timestamp,
      },
    ]);
    setInput('');
    setSelectedDate(new Date()); // デフォルトに戻す
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* キャラ＋吹き出し */}
        <div style={styles.characterContainer}>
          <img
            src="/screenshot_20250626_010256.png"
            alt="手書きキャラ"
            style={styles.characterImage}
          />
          <div style={styles.speechBubble}>
            今日もよく頑張ったね！
          </div>
        </div>

        <h1 style={styles.heading}>今日できたこと</h1>

        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="できたことを書こう"
            style={styles.input}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="date-picker"
            style={{ width: '100%' }}
          />
        </div>

        <button onClick={addRecord} style={styles.button}>追加</button>

        <ul style={styles.list}>
          {[...records].reverse().map(r => (
            <li key={r.id} style={styles.item}>
              <div style={styles.text}>{r.text}</div>
              <div style={styles.timestamp}>
                {r.date} - {r.time}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center', // スマホでも中央揃え
    alignItems: 'center',
    backgroundColor: '#fdf6e3',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    color: '#000',
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 400,
  },
  characterContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
  },
  characterImage: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: 12,
    flexShrink: 0,
  },
  speechBubble: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 16px',
    borderRadius: 20,
    maxWidth: '70%',
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  heading: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: '1rem',
    borderRadius: 8,
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px 16px',
    fontSize: '1rem',
    borderRadius: 8,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    marginBottom: 16,
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginBottom: 6,
    borderRadius: 6,
  },
  text: {
    fontSize: '1rem',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#666',
  },
};

export default App;
