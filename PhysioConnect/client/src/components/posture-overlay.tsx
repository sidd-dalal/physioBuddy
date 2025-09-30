interface PostureData {
  landmarks: Array<{
    x: number;
    y: number;
    z: number;
    visibility: number;
  }>;
  connections: Array<[number, number]>;
}

interface PostureOverlayProps {
  postureData: PostureData;
}

export default function PostureOverlay({ postureData }: PostureOverlayProps) {
  if (!postureData?.landmarks) return null;

  // MediaPipe Pose landmark indices
  const POSE_LANDMARKS = {
    NOSE: 0,
    LEFT_EYE_INNER: 1,
    LEFT_EYE: 2,
    LEFT_EYE_OUTER: 3,
    RIGHT_EYE_INNER: 4,
    RIGHT_EYE: 5,
    RIGHT_EYE_OUTER: 6,
    LEFT_EAR: 7,
    RIGHT_EAR: 8,
    MOUTH_LEFT: 9,
    MOUTH_RIGHT: 10,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_PINKY: 17,
    RIGHT_PINKY: 18,
    LEFT_INDEX: 19,
    RIGHT_INDEX: 20,
    LEFT_THUMB: 21,
    RIGHT_THUMB: 22,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
    LEFT_HEEL: 29,
    RIGHT_HEEL: 30,
    LEFT_FOOT_INDEX: 31,
    RIGHT_FOOT_INDEX: 32
  };

  // Define connections between landmarks
  const connections = [
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
    [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
    [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
    [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
    [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
    [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
    [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
    [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
    [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
  ];

  // Calculate posture metrics
  const calculatePostureMetrics = () => {
    const leftShoulder = postureData.landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rightShoulder = postureData.landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const leftHip = postureData.landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rightHip = postureData.landmarks[POSE_LANDMARKS.RIGHT_HIP];

    // Shoulder alignment
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    const shoulderAlignment = shoulderDiff < 0.05 ? "Good" : shoulderDiff < 0.1 ? "Fair" : "Poor";

    // Spine angle (simplified calculation)
    const spineAngle = Math.abs(
      Math.atan2(
        (leftShoulder.y + rightShoulder.y) / 2 - (leftHip.y + rightHip.y) / 2,
        (leftShoulder.x + rightShoulder.x) / 2 - (leftHip.x + rightHip.x) / 2
      ) * 180 / Math.PI - 90
    );

    // Balance score (based on hip alignment)
    const hipDiff = Math.abs(leftHip.y - rightHip.y);
    const balanceScore = Math.max(0, 10 - hipDiff * 100);

    return {
      shoulderAlignment,
      spineAngle: Math.round(spineAngle),
      balanceScore: balanceScore.toFixed(1)
    };
  };

  const metrics = calculatePostureMetrics();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SVG Overlay for skeleton */}
      <svg className="w-full h-full" viewBox="0 0 1 1" preserveAspectRatio="none">
        <g stroke="#2DD4BF" strokeWidth="0.003" fill="#2DD4BF">
          {/* Draw landmarks */}
          {postureData.landmarks.map((landmark, index) => {
            if (landmark.visibility > 0.5) {
              return (
                <circle
                  key={index}
                  cx={landmark.x}
                  cy={landmark.y}
                  r="0.008"
                  fill="#2DD4BF"
                />
              );
            }
            return null;
          })}
          
          {/* Draw connections */}
          {connections.map(([start, end], index) => {
            const startLandmark = postureData.landmarks[start];
            const endLandmark = postureData.landmarks[end];
            
            if (startLandmark?.visibility > 0.5 && endLandmark?.visibility > 0.5) {
              return (
                <line
                  key={index}
                  x1={startLandmark.x}
                  y1={startLandmark.y}
                  x2={endLandmark.x}
                  y2={endLandmark.y}
                  stroke="#2DD4BF"
                  strokeWidth="0.003"
                />
              );
            }
            return null;
          })}
        </g>
      </svg>

      {/* Posture Analysis Metrics */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span>Shoulder Alignment:</span>
            <span className={`${
              metrics.shoulderAlignment === 'Good' ? 'text-green-400' : 
              metrics.shoulderAlignment === 'Fair' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.shoulderAlignment}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Spine Angle:</span>
            <span className={`${
              metrics.spineAngle < 15 ? 'text-green-400' : 
              metrics.spineAngle < 25 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.spineAngle}°
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Balance Score:</span>
            <span className={`${
              parseFloat(metrics.balanceScore) > 8 ? 'text-green-400' : 
              parseFloat(metrics.balanceScore) > 6 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.balanceScore}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
