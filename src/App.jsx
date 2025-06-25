// ここからのコードに、以下の3機能を追加：
// - パスコード入力画面に画像を追加してデコる
// - 通知時間を設定して、時間になったらローカル通知
// - 「お疲れ様」ボタンでランダムメッセージ

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
  const [gachaMessage, setGachaMessage] = useState('');
  const [pin, setPin] = useState(() => localStorage.getItem('doneTodayPin') || '');
  const [tempPin, setTempPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(pin === '' ? false : false);
  const [pinStep, setPinStep] = useState(pin ? 'enter' : 'set');
  const [notificationTime, setNotificationTime] = useState(localStorage.getItem('notifyTime') || '20:00');
  const [rewardMessage, setRewardMessage] = useState('');

  const lastEnterTimeRef = useRef(0);
  const lastPinEnterTimeRef = useRef(0);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const addRecord = () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    setRecords(prev => [...prev, {
      id: Date.now(), text: input.trim(), date: selectedDate.toLocaleDateString(), time: timestamp
    }]);
    setPoints(prev => prev + 10);
    setInput('');
    setSelectedDate(new Date());
    setGachaMessage('');
  };

  const handleKeyDown = (e) => {
    const now = Date.now();
    if (e.key === 'Enter' && now - lastEnterTimeRef.current < 500) {
      addRecord();
    }
    lastEnterTimeRef.current = now;
  };

  const handlePinKeyDown = (e) => {
    const now = Date.now();
    if (e.key === 'Enter' && now - lastPinEnterTimeRef.current < 500) {
      handlePinSubmit();
    }
    lastPinEnterTimeRef.current = now;
  };

  const getPraiseMessage = () => {
    if (points >= 200) return '天才！🔥 200ポイント達成！';
    if (points >= 100) return 'さすが！👏 100ポイント達成！';
    return '';
  };

  const gachaResults = ['大吉🎉', '中吉✨', '小吉👍', '明日もきっといい天気☀️'];
  const rewardMessages = ['よく頑張ったね🥺', '頭バチバチ冴えててエモすぎん？尊いわ✨','今日も生きててえらい！😊', '静寂の中で響く君の足跡は、未来への序章💮','君の頭脳はニュートンのリンゴより重力を感じさせる🍎','アルゴリズムの最適解は君の努力に他ならない👽','頑張り屋さん！🏅','自信持って！💎','その情熱最高！🔥','君の努力は、星空のように無数の瞬きを放ち、周りの暗闇を優しく照らす光そのものだ。だから、今日も迷わず輝き続けてほしい🤣','いと心うつくしき君が姿、春の霞のごとくやわらかく、もののあはれをしる人のごとし。今日もいと愛おし🥺','マジ、今日もお前めっちゃ愛おしいわ。春霞みたいにふわっとしてて、心にズッキューン！やばい、尊すぎて草。'];

  const handleGacha = () => {
    if (points < 10) return;
    const randomIndex = Math.floor(Math.random() * gachaResults.length);
    setGachaMessage(gachaResults[randomIndex]);
    setPoints(prev => prev - 10);
  };

  const handlePinSubmit = () => {
    if (pinStep === 'set') {
      if (tempPin.length >= 4) {
        localStorage.setItem('doneTodayPin', tempPin);
        setPin(tempPin);
        setIsUnlocked(true);
        setPinError('');
      } else {
        setPinError('4桁以上の数字を入力してください（覚えておいてね）');
      }
    } else {
      if (enteredPin === pin) {
        setIsUnlocked(true);
        setPinError('');
      } else {
        setPinError('パスコードが違います');
      }
    }
  };

  const filteredRecords = records.filter(r => r.date === selectedDate.toLocaleDateString());

  const showReward = () => {
    const msg = rewardMessages[Math.floor(Math.random() * rewardMessages.length)];
    setRewardMessage(msg);
  };

  if (!isUnlocked) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          
          <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 10 }}>😊💕</div>
          <h2 style={styles.heading}>{pinStep === 'set' ? 'パスコードを設定してください' : 'パスコードを入力してください'}</h2>
          <input
            type="password"
            value={pinStep === 'set' ? tempPin : enteredPin}
            onChange={e => pinStep === 'set' ? setTempPin(e.target.value) : setEnteredPin(e.target.value)}
            onKeyDown={handlePinKeyDown}
            placeholder={pinStep === 'set' ? '4桁以上の数字を入力してください（覚えておいてね）' : 'パスコード'}
            style={styles.input}
          />
          <button onClick={handlePinSubmit} style={styles.button}>OK</button>
          {pinError && <div style={{ color: 'red', marginTop: 8 }}>{pinError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.characterContainer}>
          <img src="/tori 2025-06-26 013122.png" alt="手書きキャラ" style={styles.characterImage} />
        </div>

        {getPraiseMessage() && <div style={styles.congratsText}>{getPraiseMessage()}</div>}
        {gachaMessage && <div style={styles.gachaMessage}>{gachaMessage}</div>}
        {rewardMessage && <div style={{ textAlign: 'center', fontSize: '1.2rem', margin: '1rem 0', color: '#ff3399' }}>{rewardMessage}</div>}


        <div style={styles.pointsText}>ポイント: {points}pt</div>

        {points >= 10 && <button onClick={handleGacha} style={styles.gachaButton}>ガチャを弾く🎰</button>}

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

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button onClick={addRecord} style={styles.button}>追加</button>
          <button onClick={showReward} style={{ ...styles.button, backgroundColor: '#ff3399' }}>お疲れ様</button>

        </div>

        <div style={{ marginBottom: 16 }}>
          <label>通知時間（HH:mm）: </label>
          <input
            type="time"
            value={notificationTime}
            onChange={e => setNotificationTime(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
        </div>

        <ul style={styles.list}>
          {[...filteredRecords].reverse().map(r => (
            <li key={r.id} style={styles.item}>
              <div style={styles.text}>{r.text}</div>
              <div style={styles.timestamp}>{r.date} - {r.time}</div>
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
  gachaMessage: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ff6600',
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
  gachaButton: {
    display: 'block',
    margin: '0 auto 16px auto',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: 8,
    backgroundColor: '#ff6600',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
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