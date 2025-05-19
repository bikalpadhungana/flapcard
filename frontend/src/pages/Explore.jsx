import { useEffect, useRef, useState } from 'react';
import { FiCamera, FiVideo, FiRefreshCcw, FiZap, FiVideoOff, FiSquare } from 'react-icons/fi';
import Navbar from "../ui/Navbar";
import "../styles/Explore.css";

export default function ExplorePage() {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Check if mediaDevices is available
  const checkMediaDevicesSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }
    return true;
  };

  // Initialize camera with fallback
  const startCamera = async () => {
    try {
      setError(null);

      // Check if mediaDevices is supported
      if (!checkMediaDevicesSupport()) {
        throw new Error(
          'Camera not supported by this browser. Please try a different browser or update your current one.'
        );
      }

      // Check if page is served over HTTPS (excluding localhost)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error(
          'Camera access requires HTTPS. Please access this page through a secure connection.'
        );
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30 },
          aspectRatio: { ideal: 1.7777777778 }
        },
        audio: false
      };

      // Fallback for older browsers
      const getUserMedia = navigator.mediaDevices.getUserMedia ||
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      if (!getUserMedia) {
        throw new Error('Camera access not supported by this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            setError("Failed to start video playback: " + err.message);
          });
        };
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      });

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      setCameraActive(true);
    } catch (err) {
      setError(`Camera error: ${err.message}`);
      setCameraActive(false);
      console.error('Camera initialization error:', err);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const handleRealTimeScan = async () => {
    if (!isScanning) {
      scanIntervalRef.current = setInterval(async () => {
        const frame = await captureFrame();
        if (frame) scanEnvironment(frame);
      }, 3000);
    } else {
      clearInterval(scanIntervalRef.current);
    }
    setIsScanning(!isScanning);
  };

  const scanEnvironment = async (imageData) => {
    setAiResult("Analyzing...");
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-11b-vision-instruct:free",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Describe this scene concisely" },
              { type: "image_url", image_url: { url: imageData } }
            ]
          }]
        })
      });
      const data = await response.json();
      setAiResult(data.choices[0]?.message?.content || "No description available");
    } catch (err) {
      setAiResult("Analysis failed: " + err.message);
    }
  };

  const toggleCameraDirection = async () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"));
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    await startCamera();
  };

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      clearInterval(scanIntervalRef.current);
    };
  }, []);

  return (
    <div className="explore-page">
      <Navbar />

      <div className="explore-container">
        {error && (
          <div className="error-message">
            {error}
            {error.includes('HTTPS') && (
              <p>Please use a secure connection or test on localhost.</p>
            )}
          </div>
        )}

        <div className="camera-wrapper">
          {!cameraActive ? (
            <button className="enable-camera" onClick={startCamera}>
              <FiVideo /> Enable Camera
            </button>
          ) : (
            <>
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="live-feed"
                style={{
                  width: '100%',
                  maxWidth: '100vw',
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
              
              <div className="controls">
                <button 
                  className={`control-btn ${isScanning ? 'scanning' : ''}`}
                  onClick={handleRealTimeScan}
                >
                  <FiZap />
                </button>

                <button
                  className="control-btn"
                  onClick={() => {
                    if (isRecording) {
                      mediaRecorderRef.current.stop();
                    } else {
                      mediaRecorderRef.current.start();
                    }
                    setIsRecording(!isRecording);
                  }}
                >
                  {isRecording ? <FiSquare /> : <FiVideo />}
                </button>

                <button 
                  className="control-btn"
                  onClick={toggleCameraDirection}
                >
                  <FiRefreshCcw />
                </button>

                <button 
                  className="control-btn"
                  onClick={() => {
                    if (videoRef.current?.srcObject) {
                      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                    }
                    setCameraActive(false);
                  }}
                >
                  <FiVideoOff />
                </button>
              </div>
            </>
          )}
        </div>

        {aiResult && (
          <div className="ai-result">
            <div className="ai-header">
              <FiZap /> Live Analysis
            </div>
            <p>{aiResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}