import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import { useStore } from '../store/useStore';

export const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const requestRef = useRef<number>();
  
  const { 
    cameraEnabled, 
    setGesture, 
    phase, 
    setPhase, 
    setNebulaRotation 
  } = useStore();

  // Initialize MediaPipe
  useEffect(() => {
    const initHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });
      setHandLandmarker(landmarker);
    };
    initHandLandmarker();
  }, []);

  // Process Video Stream
  useEffect(() => {
    if (!cameraEnabled || !handLandmarker || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx!);

    let lastVideoTime = -1;

    const renderLoop = () => {
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const startTimeMs = performance.now();
        
        const result = handLandmarker.detectForVideo(video, startTimeMs);

        // Draw overlay
        canvasCtx!.save();
        canvasCtx!.clearRect(0, 0, canvas.width, canvas.height);
        
        if (result.landmarks.length > 0) {
            // Draw Hand landmarks
            for (const landmarks of result.landmarks) {
                drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, { color: "#FFFFFF", lineWidth: 2 });
                drawingUtils.drawLandmarks(landmarks, { color: "#FF0000", lineWidth: 1 });
            }

            const landmarks = result.landmarks[0];
            
            // --- Gesture Logic ---
            // 1. Calculate fingertips vs wrist (index 0)
            const wrist = landmarks[0];
            const tips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
            const mcp = [landmarks[1], landmarks[5], landmarks[9], landmarks[13], landmarks[17]]; // Knuckles

            // Simple heuristic: Are fingers extended?
            // Distance from tip to wrist should be significantly larger than knuckle to wrist
            let extendedFingers = 0;
            // Skip thumb (index 0 in tips/mcp arrays) for simpler open/close logic often
            for(let i=1; i<5; i++) {
                const distTip = Math.hypot(tips[i].x - wrist.x, tips[i].y - wrist.y);
                const distMcp = Math.hypot(mcp[i].x - wrist.x, mcp[i].y - wrist.y);
                if (distTip > distMcp * 1.5) extendedFingers++;
            }

            let currentGesture = 'None';
            if (extendedFingers >= 4) currentGesture = 'Open_Palm';
            else if (extendedFingers === 0) currentGesture = 'Closed_Fist';

            setGesture(currentGesture as any);

            // --- Phase Control Logic ---
            if (currentGesture === 'Open_Palm' && phase === 'tree') {
                setPhase('blooming');
            } else if (currentGesture === 'Closed_Fist' && phase === 'nebula') {
                setPhase('collapsing');
            }

            // --- Interaction Logic (Nebula Rotation) ---
            if (phase === 'nebula' && currentGesture === 'Open_Palm') {
                // Map hand X position (0-1) to rotation speed
                // Center is 0.5. < 0.5 rotates left, > 0.5 rotates right
                const delta = (0.5 - wrist.x) * 0.1; 
                setNebulaRotation(delta);
            }
        } else {
            setGesture('None');
        }

        canvasCtx!.restore();
      }
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.addEventListener("loadeddata", () => {
                renderLoop();
            });
        } catch (err) {
            console.error("Error accessing webcam:", err);
        }
    };

    startCamera();

    return () => {
        if(requestRef.current) cancelAnimationFrame(requestRef.current);
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
    };
  }, [cameraEnabled, handLandmarker, phase, setPhase, setGesture, setNebulaRotation]);

  if (!cameraEnabled) return null;

  return (
    <div className="absolute bottom-4 left-4 w-48 h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/50 z-50 glass">
        <video 
            ref={videoRef} 
            className="absolute w-full h-full object-cover -scale-x-100" // Mirror effect
            autoPlay 
            playsInline 
            muted 
        />
        <canvas 
            ref={canvasRef} 
            className="absolute w-full h-full object-cover -scale-x-100"
            width={320}
            height={240}
        />
    </div>
  );
};
