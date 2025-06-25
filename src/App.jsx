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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6e3',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    color: '#000',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  inputContainer: {
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px 16px',
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    marginBottom: '6px',
    borderRadius: '6px',
  },
  text: {
    fontSize: '1rem',
    marginBottom: '4px',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#666',
  },
};

export default App;
