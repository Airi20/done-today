import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('doneTodayRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('doneTodayPoints');
    return saved ? JSON.parse(saved) : 0;
  });

  const [input, setInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const lastEnterTimeRef = useRef(0);

  useEffect(() => {
    localStorage.setItem('doneTodayRecords', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('doneTodayPoints', JSON.stringify(points));
  }, [points]);

  const addRecord = () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString();

    // stateをまとめて更新（多少早く感じるかも）
    setRecords(prev => [
      ...prev,
      {
        id: Date.now(),
        text: input.trim(),
        date: selectedDate.toLocaleDateString(),
        time: timestamp,
      },
    ]);
    setPoints(prev => prev + 10);
    setInput('');
    setSelectedDate(new Date());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const now = Date.now();
      if (now - lastEnterTimeRef.current < 500) { // 0.5秒以内に2回目のEnter
        addRecord();
      }
      lastEnterTimeRef.current = now;
    }
  };

  // 褒めメッセージの決定
  const getPraiseMessage = () => {
    if (points >= 200) return '天才！🔥 200ポイント達成！';
    if (points >= 100) return 'さすが！👏 100ポイント達成！';
    return '';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.characterContainer}>
          <img
            src="/tori 2025-06-26 013122.png"
            alt="手書きキャラ"
            style={styles.characterImage}
          />
        </div>

        {getPraiseMessage() && (
          <div style={styles.congratsText}>{getPraiseMessage()}</div>
        )}

        <div style={styles.pointsText}>
          ポイント: {points}pt
        </div>

        <h1 style={styles.heading}>今日できたこと😎</h1>

        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="できたことを書こう"
            style={styles.input}
            onKeyDown={handleKeyDown}
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
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6e3',
    padding: 20,
    boxSizing: 'border-box',
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
    justifyContent: 'center',
    marginBottom: 8,
  },
  characterImage: {
    width: 250,
    height: 250,
    borderRadius: '50%',
    objectFit: 'contain',
  },
  congratsText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 8,
  },
  pointsText: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#007bff',
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
    width: '95%',
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
