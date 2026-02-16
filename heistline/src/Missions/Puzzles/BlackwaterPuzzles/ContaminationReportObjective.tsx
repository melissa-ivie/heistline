import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import '../../../App.css';
import styles from './ContaminationReportStyles.module.css';
import FacebookBrowser from './FacebookBrowser';

type PuzzlePhase = 'initial' | 'hacking' | 'login' | 'forgot-password' | 'report';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

const hackingLines = [
  '[INITIATING SECURE TUNNEL...]',
  'Connecting to 192.168.45.102:8443...',
  'Bypassing firewall layer 1... OK',
  'Bypassing firewall layer 2... OK',
  'Spoofing source IP: 10.0.0.254',
  'Injecting payload into memory buffer...',
  '0x7fff5fbff8c0: mov rax, [rbp-0x8]',
  '0x7fff5fbff8c4: call 0x100001234',
  'Dumping authentication tokens...',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Decrypting session cookies...',
  'NEXACORE_SESSION=a3f8b2c1d4e5f6a7b8c9d0e1f2',
  'Mapping network topology...',
  'Found workstation: DJONES-PC (172.16.0.45)',
  'Establishing remote connection...',
  'Loading keylogger bypass module...',
  'Intercepting RDP session...',
  '[REMOTE DESKTOP ACQUIRED]',
  'Target: David Jones',
  'Department: R&D Analytics',
  'Clearance Level: 4',
  '[CONNECTION ESTABLISHED]',
];

const ppmData = [
  { date: 'Apr 9', value: 12, type: 'safe' },
  { date: 'Apr 10', value: 12, type: 'safe' },
  { date: 'Apr 13', value: 16, type: 'safe' },
  { date: 'Apr 16', value: 21, type: 'warning' },
  { date: 'Apr 17', value: 23, type: 'warning' },
  { date: 'Apr 19', value: 28, type: 'warning' },
  { date: 'Apr 21', value: 35, type: 'danger' },
  { date: 'Apr 22', value: 43, type: 'critical' },
  { date: 'Apr 23', value: 58, type: 'critical' },
];

export default function ContaminationReportObjective() {
  const { heistName } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<PuzzlePhase>('initial');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [securityAnswers, setSecurityAnswers] = useState({
    graduationYear: '',
    firstPet: '',
    maidenName: '',
  });
  const [securityError, setSecurityError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });
  const [complete, setComplete] = useState(
    localStorage.getItem(`${heistName}-objective-contamination-report`) === 'complete'
  );
  const [showFacebook, setShowFacebook] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  // Hacking animation effect
  useEffect(() => {
    if (phase === 'hacking') {
      setVisibleLines(0);
      const lineInterval = setInterval(() => {
        setVisibleLines((prev) => {
          if (prev >= hackingLines.length) {
            clearInterval(lineInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 150);

      const transitionTimer = setTimeout(() => {
        setPhase('login');
      }, 4500);

      return () => {
        clearInterval(lineInterval);
        clearTimeout(transitionTimer);
      };
    }
  }, [phase]);

  // Auto-hide toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const handleEstablishConnection = () => {
    setPhase('hacking');
  };

  const handleUsernameFocus = () => {
    if (!username) {
      setUsername('David.Jones@nexacore.net');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('Invalid credentials. Please use Forgot Password to reset your access.');
  };

  const handleForgotPassword = () => {
    setPhase('forgot-password');
    setLoginError('');
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { graduationYear, firstPet, maidenName } = securityAnswers;

    const isCorrect =
      graduationYear.trim() === '1998' &&
      firstPet.trim().toLowerCase() === 'mittens' &&
      maidenName.trim().toLowerCase() === 'watson';

    if (isCorrect) {
      showToast('Login successful!', 'success');
      setTimeout(() => {
        setPhase('report');
      }, 1000);
    } else {
      setSecurityError('One or more answers are incorrect. Please try again.');
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      localStorage.setItem(`${heistName}-objective-contamination-report`, 'complete');
      setComplete(true);
      showToast('Report secured successfully!', 'success');
      // Navigate back to mission page after a short delay for toast to be visible
      setTimeout(() => {
        navigate(`/heist/${heistName}/start`);
      }, 1500);
    }, 2000);
  };

  const handleBackToLogin = () => {
    setPhase('login');
    setSecurityError('');
    setSecurityAnswers({ graduationYear: '', firstPet: '', maidenName: '' });
  };

  // If already complete, show the report directly
  if (complete && phase === 'initial') {
    setPhase('report');
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Contamination Report</h1>
      <p className="panel-text">
        Recover the original water contamination report from Nexacore's buried R&D archive.
      </p>

      {/* Initial Phase */}
      {phase === 'initial' && (
        <div className={styles.initialContainer}>
          <button className={styles.hackerButton} onClick={handleEstablishConnection}>
            Establish hacked connection to David Jones's machine
          </button>
        </div>
      )}

      {/* Hacking Animation Phase */}
      {phase === 'hacking' && (
        <div className={styles.hackingOverlay}>
          <div className={styles.hackingWindow}>
            <div className={styles.hackingWindowHeader}>
              <span className={`${styles.terminalDot} ${styles.red}`}></span>
              <span className={`${styles.terminalDot} ${styles.yellow}`}></span>
              <span className={`${styles.terminalDot} ${styles.green}`}></span>
              <span className={styles.terminalTitle}>root@kali:~/nexacore-exploit</span>
            </div>
            <div className={styles.hackingContent}>
              <div className={styles.matrixContainer}>
                {hackingLines.slice(0, visibleLines).map((line, index) => (
                  <div
                    key={index}
                    className={styles.matrixLine}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {line}
                  </div>
                ))}
                {visibleLines < hackingLines.length && <span className={styles.cursor}></span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Window Phase (also shows during forgot-password) */}
      {(phase === 'login' || phase === 'forgot-password') && (
        <div className={styles.loginWindowContainer}>
          <div className={styles.loginWindow}>
            {/* Window Chrome - OS-like title bar */}
            <div className={styles.windowChrome}>
              <span className={`${styles.windowDot} ${styles.close}`}></span>
              <span className={`${styles.windowDot} ${styles.minimize}`}></span>
              <span className={`${styles.windowDot} ${styles.maximize}`}></span>
              <span className={styles.windowTitle}>DJONES-PC - Remote Desktop</span>
            </div>

            {/* Scrollable content area */}
            <div className={styles.loginWindowContent}>
              <div className={styles.nexacoreHeader}>
                <div className={styles.nexacoreLogo}>
                  <div className={styles.logoIcon}></div>
                  <span className={styles.logoText}>NEXACORE</span>
                </div>
              </div>
              <div className={styles.loginFormCard}>
                <h2 className={styles.loginTitle}>Login to Your Account</h2>
                <div className={styles.loginDivider}></div>
                <form onSubmit={handleLogin}>
                  <div className={styles.inputGroup}>
                    <span className={styles.inputIcon}>👤</span>
                    <input
                      type="text"
                      className={styles.loginInput}
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={handleUsernameFocus}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <input
                      type="password"
                      className={styles.loginInput}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className={styles.loginButton}>
                    Login
                  </button>
                  {loginError && <div className={styles.loginError}>{loginError}</div>}
                </form>
                <button className={styles.forgotPassword} onClick={handleForgotPassword}>
                  Forgot Password?
                </button>
                <span
                  className={styles.facebookLink}
                  onClick={() => setShowFacebook(true)}
                >
                  Join our company's Facebook Group!
                </span>
              </div>
            </div>

            {/* Security Questions Modal - appears ON TOP of the login window */}
            {phase === 'forgot-password' && (
              <div className={styles.securityModalOverlay}>
                <div className={styles.securityModal}>
                  <div className={styles.securityModalHeader}>
                    <h2>Security Questions</h2>
                  </div>
                  <form onSubmit={handleSecuritySubmit}>
                    <div className={styles.securityQuestion}>
                      <label>What year did you graduate high school?</label>
                      <input
                        type="text"
                        value={securityAnswers.graduationYear}
                        onChange={(e) =>
                          setSecurityAnswers((prev) => ({ ...prev, graduationYear: e.target.value }))
                        }
                        placeholder="Enter year"
                      />
                    </div>
                    <div className={styles.securityQuestion}>
                      <label>What was the name of your first pet?</label>
                      <input
                        type="text"
                        value={securityAnswers.firstPet}
                        onChange={(e) =>
                          setSecurityAnswers((prev) => ({ ...prev, firstPet: e.target.value }))
                        }
                        placeholder="Enter pet name"
                      />
                    </div>
                    <div className={styles.securityQuestion}>
                      <label>What was your mother's Maiden name?</label>
                      <input
                        type="text"
                        value={securityAnswers.maidenName}
                        onChange={(e) =>
                          setSecurityAnswers((prev) => ({ ...prev, maidenName: e.target.value }))
                        }
                        placeholder="Enter maiden name"
                      />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                      Submit
                    </button>
                    {securityError && <div className={styles.errorMessage}>{securityError}</div>}
                    <button type="button" className={styles.cancelButton} onClick={handleBackToLogin}>
                      Back to Login
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contamination Report Phase */}
      {phase === 'report' && (
        <div className={styles.reportContainer}>
          <div className={styles.reportHeader}>
            <div className={styles.reportHeaderLeft}>
              <span className={styles.reportLogoIcon}>N</span>
              <div>
                <div className={styles.reportLogoText}>NEXACORE</div>
                <div className={styles.reportLogoSubtext}>INDUSTRIES</div>
              </div>
            </div>
            <div className={styles.classifiedStamp}>CLASSIFIED</div>
          </div>

          <div className={styles.reportTitleBar}>
            <span className={styles.biohazardIcon}>☣</span>
            <h2 className={styles.reportTitle}>CONTAMINATION REPORT</h2>
            <span className={styles.biohazardIcon}>☣</span>
          </div>

          <div className={styles.reportBody}>
            <div className={styles.reportMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>LOCATION:</span>
                <span className={styles.metaValue}>Small-town Midwest</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>April 24, 2024</span>
                <span className={styles.metaValue}> 🕐 5:42 AM</span>
              </div>
            </div>

            <div className={styles.investigatorLine}>
              <span className={styles.metaLabel}>INVESTIGATOR:</span>
              <span className={styles.metaValue}>ID-0427, Nexacore Industries Operative</span>
            </div>

            <div className={styles.statusSection}>
              <div className={styles.statusHeader}>CURRENT STATUS:</div>
              <div className={styles.statusTitle}>
                Experimental Solvents Detected in Municipal Water Supply
              </div>
              <div className={styles.statusText}>
                Nexacore Industries has been covertly dumping experimental solvents into the town's
                water supply under the guise of agricultural runoff treatment. Elevated levels of
                undisclosed, toxic chemical agents have been confirmed in local groundwater and
                municipal water reserves.
              </div>
            </div>

            <div className={styles.healthRisksSection}>
              <div className={styles.healthRisksHeader}>
                <span>⚠️</span>
                <span>HEALTH RISKS:</span>
              </div>
              <div className={styles.healthRisksGrid}>
                <div className={styles.healthRisksList}>
                  <div className={styles.healthRiskItem}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <div>
                      <div className={styles.riskTitle}>Neurological Damage</div>
                      <div className={styles.riskDescription}>
                        Neurotoxins cause symptoms: headaches, dizziness, cognitive impairment,
                        cognitive off-hinges
                      </div>
                    </div>
                  </div>
                  <div className={styles.healthRiskItem}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <div>
                      <div className={styles.riskTitle}>Organ Failure</div>
                      <div className={styles.riskDescription}>
                        Persistent exposure causes liver and kidney damage
                      </div>
                    </div>
                  </div>
                  <div className={styles.healthRiskItem}>
                    <span className={styles.warningIcon}>⚠️</span>
                    <div>
                      <div className={styles.riskTitle}>Cancer</div>
                      <div className={styles.riskDescription}>
                        Carcinogenic elements in water can cause long-term health effects
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.contaminationBadge}>
                  <div className={styles.contaminationBadgeLabel}>Critical</div>
                  <div className={styles.contaminationBadgeTitle}>Contamination</div>
                  <div className={styles.contaminationBadgeValue}>
                    58
                    <span className={styles.contaminationBadgeUnit}> PPM</span>
                  </div>
                  <div className={styles.contaminationBadgeLabel}>Current reading:</div>
                </div>
              </div>
            </div>

            <div className={styles.ppmChartSection}>
              <div className={styles.ppmChartLabel}>PPM (Parts per million)</div>
              <div className={styles.ppmChart}>
                <div className={styles.chartBars}>
                  {ppmData.map((item, index) => (
                    <div key={index} className={styles.chartBar}>
                      <span className={styles.barValue}>{item.value}</span>
                      <div
                        className={`${styles.barFill} ${styles[item.type]}`}
                        style={{ height: `${(item.value / 60) * 100}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className={styles.chartLabels}>
                  {ppmData.map((item, index) => (
                    <span key={index} className={styles.chartLabel}>
                      {item.date}
                    </span>
                  ))}
                </div>
                <div className={styles.safeLimitLine}>
                  <span className={styles.safeLimitLabel}>← Safe Limit: 15 PPM</span>
                </div>
              </div>
            </div>

            <div className={styles.publicAlert}>
              <div className={styles.publicAlertTitle}>PUBLIC NOT YET ALERTED.</div>
              <div className={styles.publicAlertText}>
                Continue disposal activities. Monitor health effects.
              </div>
              <div className={styles.publicAlertWarning}>DO NOT DISCLOSE TO THE PUBLIC.</div>
            </div>

            <div className={styles.confidentialFooter}>
              <span>🔒</span>
              <span>CONFIDENTIAL - PROPERTY OF NEXACORE INDUSTRIES</span>
            </div>
          </div>

          <button
            className={styles.downloadButton}
            onClick={handleDownload}
            disabled={isDownloading || complete}
          >
            {isDownloading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                Securing Report...
              </>
            ) : complete ? (
              <>✓ Report Secured</>
            ) : (
              <>📥 Download Report</>
            )}
          </button>
        </div>
      )}

      {/* Facebook Browser Window */}
      <FacebookBrowser
        isOpen={showFacebook}
        onClose={() => setShowFacebook(false)}
      />

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}

      {/* Back Button */}
      <Link to={`/heist/${heistName}/start`} className={styles.backButton}>
        ← Back to Objectives
      </Link>
    </div>
  );
}
