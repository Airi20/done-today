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
  const [isUnlocked, setIsUnlocked] = useState(pin === '' ? true : false);
  const [pinStep, setPinStep] = useState(pin ? 'enter' : 'set');
  const [rewardMessage, setRewardMessage] = useState('');
  const lastEnterTimeRef = useRef(0);
  const lastPinEnterTimeRef = useRef(0);

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('doneTodayStreak');
    return saved ? parseInt(saved) : 0;
  });
  const [lastDate, setLastDate] = useState(() => {
    return localStorage.getItem('doneTodayLastDate') || '';
  });

  // 編集・削除系
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(e => {
        console.warn('通知リクエスト失敗', e);
      });
    }
  }, []);

  const addRecord = () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    const recordDate = selectedDate.toLocaleDateString();
    const newRecord = {
      id: Date.now(), text: input.trim(), date: recordDate, time: timestamp
    };
    const updated = [...records, newRecord];

    setRecords(updated);
    setPoints(prev => prev + 10);
    setInput('');
    setSelectedDate(new Date());
    setGachaMessage('');

    // ストリークロジック
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastDate === todayStr) {
      // 今日すでに記録済み → なにもしない
    } else if (lastDate === yesterdayStr) {
      const newSt = streak + 1;
      setStreak(newSt);
      localStorage.setItem('doneTodayStreak', newSt.toString());
      localStorage.setItem('doneTodayLastDate', todayStr);
      setLastDate(todayStr);
    } else {
      setStreak(1);
      localStorage.setItem('doneTodayStreak', '1');
      localStorage.setItem('doneTodayLastDate', todayStr);
      setLastDate(todayStr);
    }

    // localStorageにも保存
    localStorage.setItem('doneTodayRecords', JSON.stringify(updated));
    localStorage.setItem('doneTodayPoints', JSON.stringify(points + 10));
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
  const rewardMessages = [
    'よく頑張ったね🥺', '今日も生きててえらい！😊', '頭バチバチ冴えててエモすぎん？',
    '君の努力は星空のように瞬く✨', '🫠日付変わったら本気出そ？by制作主','君の存在、公理として受け入れたい', '普通に要領よくて草w','Tomorrow is another day.🌇','君のセンス、Google検索しても出てこない','まじで理想を具現化して歩いてるって感じ','明日できることは今日やらない🥲','今日のがんばり、猫が見たらゴロゴロ言うやつ🐈','君の一言で、俺の脳内if文全部Trueになった','君の頭脳はニュートンのリンゴより重力を感じさせる🍎','論理も感情も兼ね備えた完全生命体って君のこと','その発想、シリコンバレーが欲しがってるよ','天才すぎてAIが嫉妬してるからね','その才能、地球には収まりきらんぞ👽','公理系ZFCを拡張しても、君のやさしさは証明不可能な独立命題','頑張り屋さん！🏅','人生というコードに、君というバグが発生して嬉しいです（デバッグ不可）','君の魅力はまるで希ガスの安定性','そんなところがさ、意外とみんな見てるんだよ','f(君) → ∞（※魅力が発散）','マジ、尊すぎて草。' ,'俺の幸福度H(x)は、x＝君の笑顔のとき最大値を取る'
  ];

  const handleGacha = () => {
    if (points < 10) return;
    const idx = Math.floor(Math.random() * gachaResults.length);
    setGachaMessage(gachaResults[idx]);
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

  const showReward = () => {
    const idx = Math.floor(Math.random() * rewardMessages.length);
    setRewardMessage(rewardMessages[idx]);
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditText(record.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id) => {
    const updated = records.map(r =>
      r.id === id ? { ...r, text: editText } : r
    );
    setRecords(updated);
    localStorage.setItem('doneTodayRecords', JSON.stringify(updated));
    cancelEdit();
  };

  const deleteRecord = (id) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('doneTodayRecords', JSON.stringify(updated));
  };

  const filteredRecords = records.filter(r => r.date === selectedDate.toLocaleDateString());

  if (!isUnlocked) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>{pinStep === 'set' ? 'パスコードを設定' : 'パスコードを入力😎'}</h2>
          <input
            type="password"
            value={pinStep === 'set' ? tempPin : enteredPin}
            onChange={e => pinStep === 'set' ? setTempPin(e.target.value) : setEnteredPin(e.target.value)}
            onKeyDown={handlePinKeyDown}
            style={styles.input}
          />
          <button onClick={handlePinSubmit} style={styles.button}>OK</button>
          {pinError && <div style={{ color: 'red' }}>{pinError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#e25822', marginBottom: 12 }}>
          🔥 {streak}日連続記録中！
        </div>

        <div style={styles.characterContainer}>
          <img src="/tori 2025-06-26 013122.png" alt="キャラ" style={styles.characterImage} />
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

        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          className="date-picker"
        />

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, marginTop: 12 }}>
          <button onClick={addRecord} style={styles.button}>追加</button>
          <button onClick={showReward} style={{ ...styles.button, backgroundColor: '#ff3399' }}>お疲れ様</button>
        </div>

        <ul style={styles.list}>
          {[...filteredRecords].reverse().map(r => (
            <li key={r.id} style={styles.item}>
              {editingId === r.id ? (
                <>
                  <input value={editText} onChange={e => setEditText(e.target.value)} style={styles.input} />
                  <button onClick={() => saveEdit(r.id)} style={styles.button}>保存</button>
                  <button onClick={cancelEdit} style={{ ...styles.button, backgroundColor: 'gray' }}>キャンセル</button>
                </>
              ) : (
                <>
                  <div style={styles.text}>{r.text}</div>
                  <div style={styles.timestamp}>{r.date} - {r.time}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <button onClick={() => startEdit(r)} style={{ ...styles.button, padding: '6px 12px' }}>編集</button>
                    <button onClick={() => deleteRecord(r.id)} style={{ ...styles.button, backgroundColor: '#dc3545', padding: '6px 12px' }}>削除</button>
                  </div>
                </>
              )}
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
    marginBottom: 8,
  },
  button: {
    width: '100%',
    padding: '10px 16px',
    fontSize: '1rem',
    borderRadius: 8,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    marginBottom: 8,
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
