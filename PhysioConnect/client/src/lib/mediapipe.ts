export interface PostureData {
  landmarks: Array<{
    x: number;
    y: number;
    z: number;
    visibility: number;
  }>;
  connections: Array<[number, number]>;
}

export class MediapipeManager {
  private pose: any;
  private camera: any;
  private videoElement: HTMLVideoElement | null = null;
  private onResultsCallback?: (results: PostureData) => void;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load MediaPipe Pose
      const { Pose, POSE_CONNECTIONS } = await import('@mediapipe/pose');
      const { Camera } = await import('@mediapipe/camera_utils');

      this.pose = new Pose({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.pose.onResults((results: any) => {
        if (results.poseLandmarks && this.onResultsCallback) {
          const postureData: PostureData = {
            landmarks: results.poseLandmarks.map((landmark: any) => ({
              x: landmark.x,
              y: landmark.y,
              z: landmark.z,
              visibility: landmark.visibility || 1
            })),
            connections: POSE_CONNECTIONS
          };
          this.onResultsCallback(postureData);
        }
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize MediaPipe:', error);
      throw error;
    }
  }

  async startDetection(videoStream: MediaStream) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Create a video element for MediaPipe processing
    this.videoElement = document.createElement('video');
    this.videoElement.srcObject = videoStream;
    this.videoElement.style.display = 'none';
    document.body.appendChild(this.videoElement);

    const { Camera } = await import('@mediapipe/camera_utils');
    
    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.pose) {
          await this.pose.send({ image: this.videoElement! });
        }
      },
      width: 640,
      height: 480
    });

    this.camera.start();
  }

  stopDetection() {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }

    if (this.videoElement) {
      document.body.removeChild(this.videoElement);
      this.videoElement = null;
    }
  }

  onResults(callback: (results: PostureData) => void) {
    this.onResultsCallback = callback;
  }

  cleanup() {
    this.stopDetection();
    this.pose = null;
    this.isInitialized = false;
  }
}
