import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../../../App.css';
import styles from './styleAirport.module.css';

import planeImg from "./resources/plane-seats.png";

function Slider({ value, onChange, color, orientation = 'horizontal' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsGrabbing(false);
  };

  const updateValue = (e) => {
    e.preventDefault(); // Prevent text selection
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();

      if (orientation === 'vertical') {
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        const percentage = 100 - (y / rect.height) * 100;
        onChange(Math.round(percentage));
      } else {
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        onChange(Math.round(percentage));
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const gradientClass = orientation === 'vertical'
    ? (color === 'red' ? styles.gradientRedVertical : styles.gradientBlueVertical)
    : (color === 'red' ? styles.gradientRedHorizontal : styles.gradientBlueHorizontal);

  const borderClass = color === 'red' ? styles.borderRed : styles.borderBlue;

  if (orientation === 'vertical') {
    return (
      <div
        ref={sliderRef}
        className={styles.sliderTrackVertical}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`${styles.sliderFillVertical} ${gradientClass}`}
          style={{ height: `${value}%` }}
        />
        <div
          className={`${styles.sliderHandleVertical} ${borderClass} ${isGrabbing ? styles.sliderHandleGrabbing : ''}`}
          style={{ bottom: `${value}%` }}
          onMouseDown={() => setIsGrabbing(true)}
          onMouseUp={() => setIsGrabbing(false)}
        />
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className={styles.sliderTrackHorizontal}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`${styles.sliderFillHorizontal} ${gradientClass}`}
        style={{ width: `${value}%` }}
      />
      <div
        className={`${styles.sliderHandleHorizontal} ${borderClass} ${isGrabbing ? styles.sliderHandleGrabbing : ''}`}
        style={{ left: `${value}%` }}
        onMouseDown={() => setIsGrabbing(true)}
        onMouseUp={() => setIsGrabbing(false)}
      />
    </div>
  );
}

export default function AirportObjective() {
  const { heistName } = useParams();

  const [redVertical, setRedVertical] = useState(50);
  const [redHorizontal, setRedHorizontal] = useState(50);
  const [blueVertical, setBlueVertical] = useState(50);
  const [blueHorizontal, setBlueHorizontal] = useState(50);

  const [seatInput, setSeatInput] = useState("");
  const [validationResult, setValidationResult] = useState<"correct" | "incorrect" | null>(null);

  // ============ PUZZLE CONFIGURATION ============
  // CHANGE THESE VALUES TO ADJUST THE PUZZLE

  // Solution slider positions (where dots align)
  const SOLUTION_RED_HORIZONTAL = 82;
  const SOLUTION_RED_VERTICAL = 34;
  const SOLUTION_BLUE_HORIZONTAL = 62;
  const SOLUTION_BLUE_VERTICAL = 61;

  // Target seat positions
  // where dots should align (x, y coordinates on 500x500 grid)
  const TARGET_SEATS = [
    { x: 177, y: 93, label: "B1" },
    { x: 287, y: 141, label: "C3" },
    { x: 280, y: 261, label: "E4" },
    { x: 222, y: 348, label: "G3" }
  ];

  const CORRECT_SEATS = ["B1", "C3", "E4", "G3"];

  // Multipliers for the 4 aligning dots (different rates for red vs blue)
  const RED_ALIGN_MULTIPLIERS = [0.4, 0.6, 0.8, 1.2];
  const BLUE_ALIGN_MULTIPLIERS = [1.0, 1.3, 1.5, 1.8];

  // ============ END CONFIGURATION ============

  // Calculate base positions for aligning dots based on target and solution
  const maxOffset = 195;

  const calculateBasePosFromTarget = (
    targetX: number,
    targetY: number,
    solutionH: number,
    solutionV: number,
    multiplier: number
  ) => {
    const xOffset = ((solutionH - 50) * multiplier * maxOffset) / 50;
    const yOffset = ((solutionV - 50) * multiplier * maxOffset) / 50;
    return {
      baseX: targetX - xOffset,
      baseY: targetY + yOffset
    };
  };

  const redDots = [
    // These 4 align with blue dots at solution positions (but with different multipliers!)
    ...TARGET_SEATS.map((seat, i) => {
      const base = calculateBasePosFromTarget(
        seat.x, seat.y,
        SOLUTION_RED_HORIZONTAL, SOLUTION_RED_VERTICAL,
        RED_ALIGN_MULTIPLIERS[i]
      );
      return { ...base, multiplier: RED_ALIGN_MULTIPLIERS[i] };
    }),
    // These 4 don't align (different multipliers and positions)
    { baseX: 100, baseY: 180, multiplier: 0.7 },
    { baseX: 10, baseY: 280, multiplier: 1.1 },
    { baseX: 180, baseY: 10, multiplier: 1.5 },
    { baseX: 100, baseY: 240, multiplier: 1.9 }
  ];

  const blueDots = [
    // These 4 align with red dots at solution positions (but with different multipliers!)
    ...TARGET_SEATS.map((seat, i) => {
      const base = calculateBasePosFromTarget(
        seat.x, seat.y,
        SOLUTION_BLUE_HORIZONTAL, SOLUTION_BLUE_VERTICAL,
        BLUE_ALIGN_MULTIPLIERS[i]
      );
      return { ...base, multiplier: BLUE_ALIGN_MULTIPLIERS[i] };
    }),
    // These 4 don't align (different multipliers and positions)
    { baseX: 200, baseY: 150, multiplier: 0.5 },
    { baseX: 250, baseY: 10, multiplier: 0.9 },
    { baseX: 80, baseY: 140, multiplier: 0.8 },
    { baseX: 80, baseY: 10, multiplier: 1.6 }
  ];

  const calculatePosition = (horizontal: number, vertical: number, dot: any) => {
    const maxOffset = 195;

    const xOffset = ((horizontal - 50) * dot.multiplier * maxOffset) / 50;
    const yOffset = ((vertical - 50) * dot.multiplier * maxOffset) / 50;

    return {
      x: dot.baseX + xOffset,
      y: dot.baseY - yOffset
    };
  };

  // Check if a dot is near a target position (within threshold distance)
  const isDotNearTarget = (dotPos: { x: number; y: number }, targetPos: { x: number; y: number }, threshold = 20) => {
    const distance = Math.sqrt(
      Math.pow(dotPos.x - targetPos.x, 2) + Math.pow(dotPos.y - targetPos.y, 2)
    );
    return distance <= threshold;
  };

  // Check if ALL 4 target seats have both red and blue dots aligned
  const areAllSeatsAligned = () => {
    return TARGET_SEATS.every(target => {
      // Check if any red dot is near this target
      const redNear = redDots.some(dot => {
        const pos = calculatePosition(redHorizontal, redVertical, dot);
        return isDotNearTarget(pos, target);
      });

      // Check if any blue dot is near this target
      const blueNear = blueDots.some(dot => {
        const pos = calculatePosition(blueHorizontal, blueVertical, dot);
        return isDotNearTarget(pos, target);
      });

      // Both red and blue must be present at this target
      return redNear && blueNear;
    });
  };

  // Only reveal seat labels when ALL seats are aligned
  const isTargetRevealed = (targetIndex: number) => {
    return areAllSeatsAligned();
  };

  const handleSubmitSeats = () => {
    // Parse input - split by commas, spaces, or newlines and trim
    const enteredSeats = seatInput
      .toUpperCase()
      .split(/[,\s\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Check if entered seats match correct seats (in any order, no extras)
    if (enteredSeats.length === CORRECT_SEATS.length) {
      const allCorrect = CORRECT_SEATS.every(seat => enteredSeats.includes(seat));
      const noExtras = enteredSeats.every(seat => CORRECT_SEATS.includes(seat));

      if (allCorrect && noExtras) {
        setValidationResult("correct");
        localStorage.setItem(`${heistName}-objective-airport`, 'complete');
      } else {
        setValidationResult("incorrect");
      }
    } else {
      setValidationResult("incorrect");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Objective: Airport</h1>

      {/* Mission Brief */}
      <div className={styles.missionBrief}>
        <div className={styles.briefHeader}>
          <span className={styles.briefLabel}>CLASSIFIED INTEL</span>
          <span className={styles.briefTag}>URGENT</span>
        </div>
        <div className={styles.briefContent}>
          <p className={styles.briefText}>
            <strong>SITUATION:</strong> Nexacore has arranged a "business retreat" for four whistleblowers
            who were preparing to expose their illegal operations. Flight BW-2401 departs in 20 min.
          </p>
          <p className={styles.briefText}>
            <strong>THREAT:</strong> Intelligence suggests Nexacore has planted an explosive device in luggage
            stored beneath specific seats. The plane will be destroyed mid-flight, eliminating all witnesses.
          </p>
          <p className={styles.briefText}>
            <strong>YOUR MISSION:</strong> Our agent is already on board, but we need the exact seat numbers
            NexaCore purchased. Decrypt their booking system to identify the target seats. Time is running out.
          </p>
        </div>
      </div>

      <div className={styles.controlsContainer}>
        {/* Left Vertical Slider (Red) */}
        <div className={styles.verticalSliderContainer}>
          <div className={styles.verticalSliderHeight}>
            <Slider
              value={redVertical}
              onChange={setRedVertical}
              color="red"
              orientation="vertical"
            />
          </div>
        </div>

        {/* Middle Section */}
        <div className={styles.middleSection}>
          {/* Top Horizontal Slider (Red) */}
          <div className={styles.horizontalSliderContainer}>
            <div className={styles.horizontalSliderWidth}>
              <Slider
                value={redHorizontal}
                onChange={setRedHorizontal}
                color="red"
              />
            </div>
          </div>

          {/* Seating Plan with Dots */}
          <div className={`${styles.seatingPlan} ${styles.seatingPlanContainer}`}>
            <img src={planeImg} className={styles.seatingPlan} alt="Airplane seating plan" />

            {/* Dots Container */}
            <div className={styles.dotsContainer}>
              {/* Red Dots */}
              {redDots.map((dot, i) => {
                const pos = calculatePosition(redHorizontal, redVertical, dot);
                return (
                  <div
                    key={`red-${i}`}
                    className={`${styles.dot} ${styles.dotRed}`}
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}px`
                    }}
                  />
                );
              })}

              {/* Blue Dots */}
              {blueDots.map((dot, i) => {
                const pos = calculatePosition(blueHorizontal, blueVertical, dot);
                return (
                  <div
                    key={`blue-${i}`}
                    className={`${styles.dot} ${styles.dotBlue}`}
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}px`
                    }}
                  />
                );
              })}

              {/* Seat Labels (revealed when red and blue overlap) */}
              {TARGET_SEATS.map((seat, i) => (
                <div
                  key={`label-${i}`}
                  className={styles.seatLabel}
                  style={{
                    left: `${seat.x}px`,
                    top: `${seat.y}px`,
                    opacity: isTargetRevealed(i) ? 1 : 0
                  }}
                >
                  {seat.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Horizontal Slider (Blue) */}
          <div className={styles.horizontalSliderContainer}>
            <div className={styles.horizontalSliderWidth}>
              <Slider
                value={blueHorizontal}
                onChange={setBlueHorizontal}
                color="blue"
              />
            </div>
          </div>
        </div>

        {/* Right Vertical Slider (Blue) */}
        <div className={styles.verticalSliderContainer}>
          <div className={styles.verticalSliderHeight}>
            <Slider
              value={blueVertical}
              onChange={setBlueVertical}
              color="blue"
              orientation="vertical"
            />
          </div>
        </div>
      </div>

      {/* Plane Ticket Input */}
      <div className={styles.ticketContainer}>
        <div className={styles.ticket}>
          <div className={styles.ticketHeader}>
            <div>
              <h2 className={styles.ticketTitle}>Global Airlines</h2>
            </div>
            <div className={styles.ticketBarcode}>||||||||||||||||||||||||</div>
          </div>

          <div className={styles.ticketBody}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>FLIGHT</span>
                <span className={styles.ticketValue}>BW-2401</span>
              </div>

              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>DATE</span>
                <span className={styles.ticketValue}>OCT 26</span>
              </div>

              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>FROM</span>
                <span className={styles.ticketValue}>BLACKWATER (BWX)</span>
              </div>

              <div className={styles.ticketRow}>
                <span className={styles.ticketLabel}>TO</span>
                <span className={styles.ticketValue}>UNKNOWN</span>
              </div>
            </div>

            <div className={styles.ticketRow} style={{ marginTop: '0.5rem' }}>
              <span className={styles.ticketLabel}>SEAT</span>
              <textarea
                className={styles.seatInput}
                value={seatInput}
                onChange={(e) => setSeatInput(e.target.value)}
                placeholder="Enter seat numbers..."
                rows={1}
              />
            </div>
          </div>

          <button
            className={styles.searchButton}
            onClick={handleSubmitSeats}
            disabled={validationResult === "correct"}
          >
            Search Suitcases
          </button>

          {validationResult && (
            <div className={styles.validationFeedback}>
              {validationResult === "correct" ? (
                <div className={styles.correctFeedback}>
                  <svg className={styles.checkmark} viewBox="0 0 52 52">
                    <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                    <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                  <span>Correct!</span>
                </div>
              ) : (
                <div className={styles.incorrectFeedback}>
                  <svg className={styles.xmark} viewBox="0 0 52 52">
                    <circle className={styles.xmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                    <path className={styles.xmarkX} fill="none" d="M16 16 36 36 M36 16 16 36"/>
                  </svg>
                  <span>Incorrect</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Link to={`/heist/${heistName}/start`}>
        <button className={`developer-button ${styles.buttonWithMargin}`}>
          Back to Objectives
        </button>
      </Link>
    </div>
  );
}