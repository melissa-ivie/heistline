import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './EmailServersStyles.module.css';
import smokingGunImage from '../../../assets/ceo email.png';

type Phase = 'email-list' | 'email-detail' | 'hacking' | 'success';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
}

const emails: Email[] = [
  {
    id: 'email1',
    from: 'Alfred.Koch@nexacore.net',
    to: 'David.Jones@nexacore.net',
    subject: 'Great Sitting with You',
    body: `Hi David,

I just wanted to say I really enjoyed sitting next to you at the gala. That was one of the better conversations I've had at one of these events — especially the discussion about the Q2 projections and your thoughts on the expansion strategy.

Let's pick that up sometime when we're not competing with the dessert course.

Best,
Alfred`
  },
  {
    id: 'email2',
    from: 'writesusie@email.com',
    to: 'KRiddle@Poliform.org',
    subject: 'Jeannie & Gene Were Adorable!',
    body: `Hi Dr. Riddle!!

I don't know if you noticed, but Jeannie and Gene were holding hands almost the entire night — it was the sweetest thing. At one point I leaned over and whispered to someone that Gene's left hand was looking pale by the first hour from all that devoted hand-holding!

It's so rare to see that kind of affection at a corporate gala. It honestly made my evening.

Hope you had as much fun as I did!

Warmly,
Susie`
  },
  {
    id: 'email3',
    from: 'KRiddle@Poliform.org',
    to: 'Alfred.Koch@nexacore.net',
    subject: 'The Note Passing Incident',
    body: `Hi Alfred,

Did you see when David tried to pass a note to Eugene? I couldn't believe he had to pass it through Susan and then Michelle to pass it down the line before it finally reached him. It was like a middle school classroom for a moment there.

Wasn't that crazy? I'm still curious what the note even said.

Best regards,
Kirsten Riddle`
  },
  {
    id: 'email4',
    from: 'Jeannie.Bently@nexacore.net',
    to: 'Michelle.Fowler@nexacore.net',
    subject: 'A Small Observation',
    body: `Hi Michelle,

I noticed something interesting about how everyone ended up positioned last night — each woman was seated next to exactly one other woman.

I doubt anyone else paid attention to it, but it stood out to me. Funny how those little patterns emerge.

Best,
Jeannie`
  },
  {
    id: 'email5',
    from: 'writesusie@email.com',
    to: 'Jeannie.Bently@nexacore.net',
    subject: 'Across the Table?! Bold Move, Jeannie!',
    body: `Jeannie!!!

Okay. I HAVE to ask.

Daryl Fowler sitting directly across from Michelle this year instead of next to her?? At a Nexacore gala of all places?? You cannot tell me that wasn't intentional. After all the whispers about "internal optics", it felt… pointed.

Half the table looked like they were watching a tennis match every time one of them spoke.

Are they just above the usual married-couple seating thing? Either way, it was spicy.

Call me immediately.

— Susie`
  },
  {
    id: 'email6',
    from: 'Michelle.Fowler@nexacore.net',
    to: 'events@premiumcatering.com',
    subject: 'Table Setup for Corporate Gala',
    body: `Hi there,

Just confirming the table arrangements for next week's gala. Please ensure we have 8 seats at each table as discussed.

The seating arrangement is very important for this event, so please double-check that each table accommodates exactly 8 guests.

For reference, my table will also contain the following people:
• Daryl Fowler
• Alfred Koch
• David Jones
• Susan Wright
• Eugene Martinez
• Jeannie Bently
• Kirsten Riddle

Thank you,
Michelle Fowler
Event Coordinator, Nexacore Industries`
  }
];

export default function EmailServersObjective() {
  const { heistName } = useParams();
  const decoded = decodeURIComponent(heistName || '');
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('email-list');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [hackingLines, setHackingLines] = useState<string[]>([]);
  const [isCorrectEmail, setIsCorrectEmail] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [attemptsRemaining, setAttemptsRemaining] = useState(() => {
    const stored = localStorage.getItem(`${decoded}-email-attempts-remaining`);
    return stored ? parseInt(stored) : 2;
  });

  const [complete, setComplete] = useState(
    localStorage.getItem(`${decoded}-objective-email-servers`) === 'complete'
  );

  // Restore phase based on state on mount
  useEffect(() => {
    if (complete) {
      setPhase('success');
    } else if (attemptsRemaining === 0) {
      // Trigger the main mission failure overlay
      const overlay = document.getElementById('outcome-overlay');
      if (overlay) {
        overlay.classList.add('show');
      }
    }
  }, []);

  // Hacking animation effect
  useEffect(() => {
    if (phase === 'hacking') {
      const lines = [
        '> Connecting to Nexacore mail servers...',
        '> Establishing secure tunnel: 192.168.45.102:8443',
        '> Authentication bypassed',
        '> Scanning deleted items folder...',
        '> Located archived message thread',
        '> Extracting email headers...',
        '> Decrypting message body...',
        '> Retrieving attachments...',
        '> Download complete',
        '> Retrieval successful'
      ];

      let index = 0;
      setHackingLines([]);

      const interval = setInterval(() => {
        if (index < lines.length) {
          setHackingLines((prev) => [...prev, lines[index]]);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Check if the email was correct
            if (isCorrectEmail) {
              setPhase('success');
              setComplete(true);
              localStorage.setItem(`${decoded}-objective-email-servers`, 'complete');
              // Show success toast
              setShowSuccessToast(true);
              setTimeout(() => setShowSuccessToast(false), 3000);
            } else {
              // Failed attempt - check if we're out of attempts
              if (attemptsRemaining <= 0) {
                // Navigate back to main mission page
                navigate(`/heist/${heistName}/start`);
                // Trigger mission failure overlay after navigation
                setTimeout(() => {
                  const overlay = document.getElementById('outcome-overlay');
                  if (overlay) {
                    overlay.classList.add('show');
                  }
                  localStorage.setItem(`${decoded}-timer`, '0');
                }, 100);
              } else {
                // Go back to email detail with error message and restore selectedEmail
                setPhase('email-detail');
                setError(`Incorrect email. ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining.`);
              }
            }
          }, 1000);
        }
      }, 150);

      return () => clearInterval(interval);
    }
  }, [phase, decoded, isCorrectEmail, attemptsRemaining, navigate, heistName]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setPhase('email-detail');
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
    setEmailInput('');
    setError('');
    setPhase('email-list');
  };

  const handleRetrievalAttempt = () => {
    // Prevent attempts if already at 0
    if (attemptsRemaining <= 0) {
      return;
    }

    const correctEmail = 'alfred.koch@nexacore.net';
    const input = emailInput.trim().toLowerCase();
    const isCorrect = input === correctEmail;

    // Set whether email is correct for use in hacking animation completion
    setIsCorrectEmail(isCorrect);
    setError('');

    // If wrong, decrement attempts BEFORE showing animation
    if (!isCorrect) {
      const newAttempts = attemptsRemaining - 1;
      setAttemptsRemaining(newAttempts);
      localStorage.setItem(`${decoded}-email-attempts-remaining`, newAttempts.toString());
    }

    // Always show hacking animation first
    setPhase('hacking');
  };

  return (
    <>
      {/* Hacking Phase Overlay */}
      {phase === 'hacking' && (
        <div className={styles.overlay}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>root@heistline:~/email-retrieval</div>
            {hackingLines.map((line, i) => (
              <div key={i} className={styles.terminalLine}>
                {line}
              </div>
            ))}
            <div className={styles.cursor}>_</div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className={styles.successToast}>
          ✓ Email Retrieved Successfully! Mission Complete.
        </div>
      )}

      <div className={styles.outerContainer}>
        <h1 className={styles.title}>Email Server Capture</h1>
        <p className={styles.instructionText}>
          We have only two chances to run the Deleted Email Retrieval Service before the servers
          permanently lock us out.
          <br />
          <br />
          An informant intercepted a key detail: during a recent corporate dinner, the person who
          sent the smoking gun email was seated immediately to the left of CEO Daryl Fowler.
          Unfortunately, no faces were identified.
          <br />
          <br />
          Determine who was seated to Daryl Fowler's left at the dinner. Locate that individual's
          email address and run the retrieval protocol.
        </p>

        {/* Email Modal */}
        <div className={styles.emailModal}>
          {phase === 'success' ? (
            /* Success - Show Incriminating Email Image */
            <div className={styles.successImageContainer}>
              <h2 className={styles.successTitle}>Incriminating Email Retrieved</h2>
              <img
                src={smokingGunImage}
                alt="CEO Incriminating Email"
                className={styles.incriminatingEmailImage}
              />
            </div>
          ) : (
            <>
              {(phase === 'email-list' || (phase === 'hacking' && !selectedEmail)) && (
                <>
                  <div className={styles.emailList}>
                    {emails.map((email) => (
                      <div key={email.id} className={styles.emailItem} onClick={() => handleEmailClick(email)}>
                        <div className={styles.emailSubject}>{email.subject}</div>
                        <div className={styles.emailFrom}>From: {email.from}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {((phase === 'email-detail' || (phase === 'hacking' && selectedEmail)) && selectedEmail) && (
                <>
                  <button className={styles.backButton} onClick={handleBackToList}>
                    ← Back to List
                  </button>
                  <div className={styles.emailDetail}>
                    <div className={styles.emailHeader}>
                      <p>
                        <strong>From:</strong> {selectedEmail.from}
                      </p>
                      <p>
                        <strong>To:</strong> {selectedEmail.to}
                      </p>
                      <p>
                        <strong>Subject:</strong> {selectedEmail.subject}
                      </p>
                    </div>
                    <div className={styles.emailBody}>{selectedEmail.body}</div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Retrieval Protocol Section - Outside and Below Modal */}
        <div className={styles.retrievalSection}>
          <h3>Deleted Email Retrieval Protocol</h3>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter target email address"
            className={styles.emailInput}
          />
          <button
            className={styles.hackerButton}
            onClick={handleRetrievalAttempt}
            disabled={!emailInput.trim()}
          >
            Run Retrieval Protocol
          </button>
          <p
            className={`${styles.attemptsCounter} ${
              attemptsRemaining === 1 ? styles.danger : attemptsRemaining === 2 ? styles.warning : ''
            }`}
          >
            Attempts remaining: {attemptsRemaining}
          </p>
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.centerButton}>
          <Link to={`/heist/${heistName}/start`}>
            <button className={styles.backButton}>Back to Objectives</button>
          </Link>
        </div>
      </div>
    </>
  );
}
