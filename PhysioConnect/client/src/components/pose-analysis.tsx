import { usePoseDetection } from "@/hooks/use-pose-detection";

interface PoseAnalysisProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled: boolean;
  onPoseData?: (data: any) => void;
}

export default function PoseAnalysis({ videoRef, enabled, onPoseData }: PoseAnalysisProps) {
  const { canvasRef, poseData, isLoading, error } = usePoseDetection(
    videoRef,
    enabled,
    onPoseData
  );

  if (!enabled) return null;

  return (
    <div className="absolute inset-0">
      {/* Canvas for pose overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Posture Metrics Overlay */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm z-20">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading pose detection...</p>
          </div>
        ) : error ? (
          <div className="text-red-400">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>Shoulder Alignment:</span>
              <span className={
                poseData.shoulderAlignment === 'Good' ? 'text-green-400' :
                poseData.shoulderAlignment === 'Fair' ? 'text-yellow-400' :
                'text-red-400'
              }>
                {poseData.shoulderAlignment}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Spine Angle:</span>
              <span className={
                poseData.spineAngle <= 15 ? 'text-green-400' :
                poseData.spineAngle <= 20 ? 'text-yellow-400' :
                'text-red-400'
              }>
                {poseData.spineAngle}°
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Balance Score:</span>
              <span className={
                poseData.balanceScore >= 8 ? 'text-green-400' :
                poseData.balanceScore >= 6 ? 'text-yellow-400' :
                'text-red-400'
              }>
                {poseData.balanceScore}/10
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
