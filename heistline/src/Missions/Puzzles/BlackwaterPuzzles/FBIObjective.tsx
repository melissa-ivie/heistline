import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../../App.css';
import styles from './styleFBIO.module.css';
import { useState, useEffect } from 'react';

interface EvidenceStatus {
  airport: boolean;
  contaminationReport: boolean;
  emailServers: boolean;
}

export default function FBIObjective() {
  const { heistName } = useParams();
  const navigate = useNavigate();
  const [complete, setComplete] = useState(
    localStorage.getItem(`${heistName}-objective-fbi`) === 'complete'
  );

  const [evidence, setEvidence] = useState<EvidenceStatus>({
    airport: false,
    contaminationReport: false,
    emailServers: false,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFirewall, setShowFirewall] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  // Check for evidence completion on mount and when storage changes
  useEffect(() => {
    const checkEvidence = () => {
      setEvidence({
        airport: localStorage.getItem(`${heistName}-objective-airport`) === 'complete',
        contaminationReport: localStorage.getItem(`${heistName}-objective-contamination-report`) === 'complete',
        emailServers: localStorage.getItem(`${heistName}-objective-email-servers`) === 'complete',
      });
    };

    checkEvidence();

    // Listen for storage changes (if other tabs/windows complete objectives)
    window.addEventListener('storage', checkEvidence);
    return () => window.removeEventListener('storage', checkEvidence);
  }, [heistName]);

  const handleSubmitToFBI = () => {
    const allEvidenceCollected = evidence.airport && evidence.contaminationReport && evidence.emailServers;

    if (allEvidenceCollected) {
      setIsSubmitting(true);
      setError('');

      // Simulate submission delay
      setTimeout(() => {
        localStorage.setItem(`${heistName}-objective-fbi`, 'complete');
        setComplete(true);
        setIsSubmitting(false);

        // Navigate back to main page after a short delay
        setTimeout(() => {
          navigate(`/heist/${heistName}/start`);
        }, 1500);
      }, 2000);
    } else {
      setError('Cannot submit: Not all evidence has been collected. Complete all objectives first.');
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* Firewall Overlay */}
      {showFirewall && (
        <div className={styles.firewallOverlay} id="firewall-barrier">
          <div className={styles.firewallContent}>
            <div className={styles.cautionTriangle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className={styles.firewallTitle}>ACCESS DENIED</h1>
            <div className={styles.firewallMessage}>
              <p>UNAUTHORIZED ACCESS ATTEMPT DETECTED</p>
              <p className={styles.firewallCode}>ERROR CODE: 0x403_FORBIDDEN</p>
              <p>This system is protected by FBI cybersecurity protocols</p>
            </div>
            <button
              className={styles.analyzeButton}
              onClick={() => setShowTerminal(true)}
            >
              🔍 Analyze Firewall
            </button>
          </div>

          {/* Hacker Terminal Window */}
          {showTerminal && (
            <div className={styles.hackerTerminalContainer}>
            <div className={styles.hackerTerminal}>
              <div className={styles.terminalHeader}>
                <span
                  className={`${styles.terminalDot} ${styles.red}`}
                  onClick={() => setShowTerminal(false)}
                  title="Close terminal"
                ></span>
                <span className={`${styles.terminalDot} ${styles.yellow}`}></span>
                <span className={`${styles.terminalDot} ${styles.green}`}></span>
                <span className={styles.terminalTitle}>root@bypass:~/firewall-breach</span>
              </div>
              <div className={styles.terminalContent}>
                <div className={styles.terminalLine}>
                  <span className={styles.terminalPrompt}>$</span> ./firewall_analyzer.sh
                </div>
                <div className={styles.terminalLine}>
                  [!] FIREWALL DETECTED
                </div>
                <div className={styles.terminalLine}>
                  [+] Analyzing protection layer...
                </div>
                <div className={styles.terminalLine}>
                  [+] Vulnerability found: Client-side barrier
                </div>
                <div className={`${styles.terminalLine} ${styles.terminalHighlight}`}>
                  <br />
                  === ACCESS PREVENTED - MUST BYPASS FIREWALL ===
                </div>
                <div className={styles.terminalLine}>
                  <br />
                  <strong>INSTRUCTIONS TO BYPASS:</strong>
                </div>
                <div className={styles.terminalLine}>
                  1. RIGHT-CLICK on the firewall overlay
                </div>
                <div className={styles.terminalLine}>
                  2. Select "Inspect" or "Inspect Element"
                </div>
                <div className={styles.terminalLine}>
                  3. Locate the HTML element in the DevTools panel
                </div>
                <div className={styles.terminalLine}>
                  4. DELETE the element from the HTML
                </div>
                <div className={styles.terminalLine}>
                  <br />
                  [*] Hint: Look for id="firewall-barrier"
                </div>
                <div className={styles.terminalLine}>
                  <br />
                  [!] Note: If something goes wrong, refresh the page
                </div>
                <div className={styles.terminalLine}>
                  <br />
                  <span className={styles.terminalBlink}>▋</span>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      <h1 className={styles.appTitle}>Objective: FBI Submission</h1>
      <p className={styles.panelText}>
        Deliver the collected evidence anonymously to the FBI without leaving a digital trail.
      </p>

      {!complete ? (
        <>
          {/* Evidence Collection Status */}
          <div className={styles.evidenceContainer}>
            <h2 className={styles.evidenceTitle}>Evidence Collection Status</h2>
            <p className={styles.evidenceSubtext}>
              All evidence must be collected before submitting to the FBI
            </p>

            <div className={styles.evidenceGrid}>
              {/* Airport Evidence */}
              <div className={`${styles.evidenceCard} ${evidence.airport ? styles.evidenceComplete : styles.evidenceLocked}`}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.evidenceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className={styles.evidenceLabel}>Airport Intel</div>
                {!evidence.airport && (
                  <div className={styles.evidenceTooltip}>Evidence not available</div>
                )}
                {evidence.airport && (
                  <div className={styles.evidenceCheckmark}>✓</div>
                )}
              </div>

              {/* Contamination Report Evidence */}
              <div className={`${styles.evidenceCard} ${evidence.contaminationReport ? styles.evidenceComplete : styles.evidenceLocked}`}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.evidenceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className={styles.evidenceLabel}>Contamination Report</div>
                {!evidence.contaminationReport && (
                  <div className={styles.evidenceTooltip}>Evidence not available</div>
                )}
                {evidence.contaminationReport && (
                  <div className={styles.evidenceCheckmark}>✓</div>
                )}
              </div>

              {/* Email Servers Evidence */}
              <div className={`${styles.evidenceCard} ${evidence.emailServers ? styles.evidenceComplete : styles.evidenceLocked}`}>
                <div className={styles.iconWrapper}>
                  <svg className={styles.evidenceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className={styles.evidenceLabel}>Email Records</div>
                {!evidence.emailServers && (
                  <div className={styles.evidenceTooltip}>Evidence not available</div>
                )}
                {evidence.emailServers && (
                  <div className={styles.evidenceCheckmark}>✓</div>
                )}
              </div>
            </div>
          </div>

          {/* Mission Briefing */}
          <div className={styles.missionBriefing}>
            <h3 className={styles.briefingTitle}>Mission Briefing</h3>
            <p className={styles.briefingText}>
              Once all evidence has been collected, you will establish a secure, anonymous connection
              to the FBI tip line. The evidence will be transmitted through an encrypted channel,
              ensuring that your identity remains protected while exposing Nexacore's criminal activities.
            </p>
            <p className={styles.briefingText}>
              <strong>Warning:</strong> Do not attempt submission until all evidence is secured.
              Incomplete submissions may compromise the investigation and alert Nexacore to our activities.
            </p>
          </div>

          {/* Submit Button */}
          <button
            className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
            onClick={handleSubmitToFBI}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.loadingSpinner}></span>
                Transmitting Evidence...
              </>
            ) : (
              <>
                📡 Submit Evidence to FBI
              </>
            )}
          </button>

          {error && (
            <div className={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}
        </>
      ) : (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Mission Complete</h2>
          <p className={styles.successText}>
            Evidence successfully transmitted to the FBI. The investigation into Nexacore's
            criminal activities has been initiated. Your identity remains protected.
          </p>
        </div>
      )}

      <Link to={`/heist/${heistName}/start`}>
        <button className={styles.backButton}>
          ← Back to Objectives
        </button>
      </Link>
    </div>
  );
}
