import { useEffect, useRef, useState, useCallback } from 'react';

interface PoseData {
  spineAngle: number;
  balanceScore: number;
  shoulderAlignment: 'Good' | 'Fair' | 'Poor';
}

export function usePoseDetection(
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean = false,
  onPoseData?: (data: PoseData) => void
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseData, setPoseData] = useState<PoseData>({
    spineAngle: 0,
    balanceScore: 0,
    shoulderAlignment: 'Good'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize MediaPipe Pose
  useEffect(() => {
    if (!enabled || !videoRef.current || !canvasRef.current) return;

    let pose: any = null;
    let camera: any = null;

    const initializePose = async () => {
      try {
        // Load MediaPipe scripts dynamically
        if (!(window as any).Pose) {
          await loadMediaPipeScripts();
        }

        const Pose = (window as any).Pose;
        const Camera = (window as any).Camera;

        if (!Pose || !Camera) {
          throw new Error('MediaPipe libraries not loaded');
        }

        pose = new Pose({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        camera = new Camera(videoRef.current!, {
          onFrame: async () => {
            if (videoRef.current) {
              await pose.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 720
        });

        setIsLoading(false);
        
      } catch (error) {
        console.error('Error initializing pose detection:', error);
        setError('Failed to initialize pose detection');
        setIsLoading(false);
      }
    };

    const onResults = (results: any) => {
      if (!canvasRef.current || !videoRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        // Draw pose landmarks and connections
        drawPose(ctx, results.poseLandmarks, canvas.width, canvas.height);
        
        // Calculate pose metrics
        const metrics = calculatePoseMetrics(results.poseLandmarks);
        setPoseData(metrics);
        onPoseData?.(metrics);
      }
    };

    initializePose();

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [enabled, videoRef, onPoseData]);

  const loadMediaPipeScripts = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).Pose) {
        resolve();
        return;
      }

      const script1 = document.createElement('script');
      script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js';
        script2.onload = () => {
          const script3 = document.createElement('script');
          script3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
          script3.onload = () => {
            const script4 = document.createElement('script');
            script4.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
            script4.onload = () => resolve();
            script4.onerror = () => reject(new Error('Failed to load MediaPipe pose'));
            document.head.appendChild(script4);
          };
          script3.onerror = () => reject(new Error('Failed to load MediaPipe drawing utils'));
          document.head.appendChild(script3);
        };
        script2.onerror = () => reject(new Error('Failed to load MediaPipe control utils'));
        document.head.appendChild(script2);
      };
      script1.onerror = () => reject(new Error('Failed to load MediaPipe camera utils'));
      document.head.appendChild(script1);
    });
  }, []);

  const drawPose = (
    ctx: CanvasRenderingContext2D, 
    landmarks: any[], 
    width: number, 
    height: number
  ) => {
    const POSE_CONNECTIONS = [
      // Face
      [0, 1], [1, 2], [2, 3], [3, 7],
      [0, 4], [4, 5], [5, 6], [6, 8],
      // Shoulders and arms
      [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
      [12, 14], [14, 16], [16, 18], [16, 20], [16, 22],
      // Torso
      [11, 23], [12, 24], [23, 24],
      // Legs
      [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30],
      [29, 31], [30, 32], [27, 31], [28, 32]
    ];

    // Draw connections
    ctx.strokeStyle = '#2DD4BF';
    ctx.lineWidth = 3;
    
    POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const start = landmarks[startIdx];
      const end = landmarks[endIdx];
      
      if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
        ctx.beginPath();
        ctx.moveTo(start.x * width, start.y * height);
        ctx.lineTo(end.x * width, end.y * height);
        ctx.stroke();
      }
    });

    // Draw landmarks
    ctx.fillStyle = '#2DD4BF';
    landmarks.forEach((landmark) => {
      if (landmark.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(landmark.x * width, landmark.y * height, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const calculatePoseMetrics = (landmarks: any[]): PoseData => {
    // Calculate spine angle (simplified)
    const neck = landmarks[0]; // Nose as proxy for head
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    let spineAngle = 0;
    let shoulderAlignment: 'Good' | 'Fair' | 'Poor' = 'Good';
    let balanceScore = 10;

    if (neck && leftShoulder && rightShoulder && leftHip && rightHip) {
      // Calculate shoulder center
      const shoulderCenter = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
      };

      // Calculate hip center
      const hipCenter = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2
      };

      // Calculate spine angle
      const deltaX = shoulderCenter.x - hipCenter.x;
      const deltaY = shoulderCenter.y - hipCenter.y;
      spineAngle = Math.abs(Math.atan2(deltaX, deltaY) * (180 / Math.PI));

      // Check shoulder alignment
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      if (shoulderDiff < 0.05) {
        shoulderAlignment = 'Good';
        balanceScore = Math.max(8, balanceScore - 1);
      } else if (shoulderDiff < 0.1) {
        shoulderAlignment = 'Fair';
        balanceScore = Math.max(6, balanceScore - 2);
      } else {
        shoulderAlignment = 'Poor';
        balanceScore = Math.max(4, balanceScore - 3);
      }

      // Adjust balance score based on spine angle
      if (spineAngle > 20) {
        balanceScore = Math.max(4, balanceScore - 2);
      } else if (spineAngle > 15) {
        balanceScore = Math.max(6, balanceScore - 1);
      }
    }

    return {
      spineAngle: Math.round(spineAngle),
      balanceScore: Math.round(balanceScore * 10) / 10,
      shoulderAlignment
    };
  };

  return {
    canvasRef,
    poseData,
    isLoading,
    error
  };
}
