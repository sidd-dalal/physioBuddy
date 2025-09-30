# YourPhysioBuddy - Testing Guide

## How to Test the Physiotherapy Platform

### 1. Basic Flow Test
1. **Start the application** - It should be running at the URL shown in Replit
2. **Create a session:**
   - Click "Create New Session"
   - Enter doctor name (required): `Dr. Unnati Lodha`
   - Enter patient name (optional): `John Patient`
   - Click "Create"
   - Copy the session ID (format: PHY-[timestamp])

3. **Join as second user:**
   - Open the same URL in a new browser tab/window (or incognito mode)
   - Click "Join Session"
   - Paste the session ID and click "Join Session"

### 2. Video Conferencing Test
- **Camera/Audio permissions**: Both browser windows should ask for camera/microphone access
- **Local video**: You should see your own video in both windows
- **Video controls**: Test mute/unmute microphone and enable/disable camera buttons
- **Remote video**: Each window should show the other user's video (this requires WebRTC signaling)

### 3. Chat System Test
- **Real-time messaging**: Type messages in either window and they should appear in both
- **Message display**: Messages should show sender name and timestamp
- **Message styling**: Your messages appear on the right (teal), others on the left (gray)

### 4. Session Management Test
- **Connection status**: Green dot should show "Connected" in the header
- **End session**: Click "End Session" button to terminate and return to home page
- **Session persistence**: Refresh the page - session should still be accessible

### 5. UI/UX Test
- **Responsive design**: Test on mobile - layout should stack vertically
- **Medical theme**: Clean, professional healthcare appearance
- **Loading states**: Smooth transitions and proper loading indicators

## Expected Behaviors

### ✅ Working Features
- Session creation and joining
- Real-time chat messaging
- WebSocket connectivity with auto-reconnection
- Video stream capture (local video)
- Professional medical UI/UX
- Mobile responsive design

### 🔄 In Progress Features
- **WebRTC peer-to-peer connection**: Remote video between users
- **MediaPipe pose detection**: Real-time posture analysis (currently shows placeholder)

### 📝 Test Results Template
```
✓ Session creation works
✓ Chat messaging works
✓ Local video capture works
✓ UI is responsive and professional
⚠ Remote video: [describe what you see]
⚠ Posture analysis: [shows placeholder - expected]
```

## Troubleshooting

### Camera/Microphone Issues
- Browser must have camera/microphone permissions
- HTTPS required for real camera access (Replit provides this)
- Check browser console for error messages

### WebSocket Issues
- Check connection status indicator in header
- Browser console should show "WebSocket connected"
- Auto-reconnection should work if connection drops

### General Issues
- Refresh the page if anything seems stuck
- Clear browser cache if needed
- Try different browsers (Chrome, Firefox, Safari)

## Testing Different User Roles
- **Doctor view**: Create session, see session tools, manage consultation
- **Patient view**: Join session, see exercise instructions, participate in analysis
- Both users see the same chat and video features

## Performance Notes
- Application handles multiple simultaneous sessions
- WebSocket connections are managed per session
- Video quality auto-adjusts based on connection speed