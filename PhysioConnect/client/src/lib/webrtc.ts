export class WebRTCManager {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private socket: WebSocket | null = null;
  private sessionId: string;
  private onRemoteStreamCallback?: (stream: MediaStream) => void;
  private onLocalStreamCallback?: (stream: MediaStream) => void;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    this.setupPeerConnection();
  }

  private setupPeerConnection() {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket) {
        this.socket.send(JSON.stringify({
          type: 'webrtc-ice-candidate',
          sessionId: this.sessionId,
          candidate: event.candidate
        }));
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.onRemoteStreamCallback?.(this.remoteStream);
    };
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
    
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'webrtc-offer':
          console.log('Received WebRTC offer', data);
          this.handleOffer(data.offer);
          break;
        case 'webrtc-answer':
          console.log('Received WebRTC answer', data);
          this.handleAnswer(data.answer);
          break;
        case 'webrtc-ice-candidate':
          console.log('Received ICE candidate', data);
          this.handleIceCandidate(data.candidate);
          break;
        case 'user-joined':
          console.log('User joined session', data);
          break;
      }
    });
  }

  async startLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream!);
      });
      
      this.onLocalStreamCallback?.(this.localStream);
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async createOffer() {
    try {
      console.log('Creating WebRTC offer');
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('Sending WebRTC offer');
        this.socket.send(JSON.stringify({
          type: 'webrtc-offer',
          sessionId: this.sessionId,
          offer: offer
        }));
      } else {
        console.error('WebSocket not ready for sending offer');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    try {
      console.log('Handling WebRTC offer');
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('Sending WebRTC answer');
        this.socket.send(JSON.stringify({
          type: 'webrtc-answer',
          sessionId: this.sessionId,
          answer: answer
        }));
      } else {
        console.error('WebSocket not ready for sending answer');
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      console.log('Handling WebRTC answer');
      await this.peerConnection.setRemoteDescription(answer);
      console.log('WebRTC connection established');
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      console.log('Adding ICE candidate');
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  toggleAudio(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback;
  }

  onLocalStream(callback: (stream: MediaStream) => void) {
    this.onLocalStreamCallback = callback;
  }

  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    this.peerConnection.close();
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream() {
    return this.remoteStream;
  }
}
