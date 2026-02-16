import { useParams, Link } from 'react-router-dom';
import '../../../App.css';
import styles from './styleFBIO.module.css';
import { useState, useEffect } from 'react';

export default function FBIObjective() {
  const { heistName } = useParams();
  const [complete, setComplete] = useState(
  localStorage.getItem(`${heistName}-objective-fbi`) === 'complete'
  );

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShowImage = () => {
    setShowImage((prev) => !prev); // toggles true ↔ false
  };


  const handlePasswordSubmit = () => {
  if (password === 'steveharvey') {
    setComplete(true);
    localStorage.setItem(`${heistName}-objective-fbi`, 'complete');
    setError('');
  } else {
    setError('Incorrect password. Try again.');
  }
};

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.appTitle}>Objective: FBI</h1>
      <p className={styles.panelText}>Deliver the files anonymously to the FDA and FBI without leaving a digital trail.</p>


      {!complete ? (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter mission password"
          />
          <button className={styles.developerButton} onClick={handlePasswordSubmit} style={{ marginLeft: '0.5rem' }}>
            Submit
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <p style={{ color: 'green', marginTop: '1rem' }}>✔ Mission Complete</p>
      )}


      <Link to={`/heist/${heistName}/start`}>
        <button className={styles.developerButton} style={{ marginTop: '1rem' }}>
          Back to Objectives
        </button>
      </Link>
      <button className={styles.developerButton} onClick={handleShowImage} style={{ marginTop: '2rem' }}>
          {showImage ? 'Hide Hint' : 'Show Hint'}
        </button>

        {showImage && (
        <img
          src="https://preview.redd.it/squint-your-eyes-v0-kq42sel1r2ge1.jpeg?width=640&crop=smart&auto=webp&s=97d2763a407753d17b006d81d898f4e4a9feb966"
          alt="FBI Logo"
          style={{ marginTop: '1rem', maxWidth: '100%', borderRadius: '8px' }}
        />
      )}
    </div>
  );
}
