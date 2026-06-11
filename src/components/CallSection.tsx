import React, { useState, useEffect, useRef } from 'react';
import { CallRecord, UserProfile } from '../types';
import { Phone, Video, PhoneOff, Mic, MicOff, VideoOff, Volume2, Grid, Plus, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';

interface CallSectionProps {
  calls: CallRecord[];
  setCalls: React.Dispatch<React.SetStateAction<CallRecord[]>>;
  currentUser: UserProfile;
}

export default function CallSection({ calls, setCalls, currentUser }: CallSectionProps) {
  const [activeCall, setActiveCall] = useState<{
    name: string;
    avatar: string;
    type: 'voice' | 'video';
    id: string;
  } | null>(null);

  const [callDuration, setCallDuration] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  
  // Dialer State
  const [dialNumber, setDialNumber] = useState('');
  const [speakerOn, setSpeakerOn] = useState(true);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Active call timer
  useEffect(() => {
    let timerRef: NodeJS.Timeout;
    if (activeCall) {
      setCallDuration(0);
      timerRef = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      stopCameraStream();
    }
    return () => clearInterval(timerRef);
  }, [activeCall]);

  // Hook into real camera when in a video call
  useEffect(() => {
    if (activeCall && activeCall.type === 'video' && !camOff) {
      startCameraStream();
    } else {
      stopCameraStream();
    }
    return () => stopCameraStream();
  }, [activeCall, camOff]);

  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
      setWebcamEnabled(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.warn("Camera permissions not granted or no webcam available. Falling back to avatar.", e);
      setWebcamEnabled(false);
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setWebcamEnabled(false);
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const triggerCall = (name: string, avatar: string, type: 'voice' | 'video') => {
    setActiveCall({ name, avatar, type, id: `call_${Date.now()}` });

    // Prepend to logs
    const newLog: CallRecord = {
      id: `c_rec_${Date.now()}`,
      name,
      avatar,
      type,
      direction: 'outgoing',
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCalls([newLog, ...calls]);
  };

  const hangUpCall = () => {
    if (!activeCall) return;
    
    // Append duration to the last log
    const durationStr = formatDuration(callDuration);
    setCalls(prevCalls => 
      prevCalls.map((c, i) => i === 0 ? { ...c, duration: durationStr } : c)
    );

    setActiveCall(null);
    stopCameraStream();
  };

  const handleDialPadPress = (num: string) => {
    if (dialNumber.length < 15) {
      setDialNumber(prev => prev + num);
    }
  };

  const clearLogs = () => {
    if (confirm("Are you sure you want to clear call history?")) {
      setCalls([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] overflow-hidden pb-16" id="call-section">
      {!activeCall ? (
        // Standard calling hub view (History and Dialer)
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-[#11131A] border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center sticky top-0 z-10 shrink-0">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white font-display uppercase tracking-wider">Calling Hub</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-display uppercase tracking-widest block mt-0.5">HD voice & video connection</p>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-[9px] font-bold uppercase tracking-wider bg-green-50 dark:bg-green-950/20 p-1.5 px-3 rounded-full font-display">
              <ShieldCheck size={12} /> Secure E2E
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="p-4 grid grid-cols-2 gap-3 shrink-0">
            <button
              onClick={() => triggerCall('Group Tech Space 🚀', 'https://picsum.photos/id/8/150/150', 'video')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all text-center group shadow-md shadow-blue-500/10 active-press"
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Grid size={15} className="group-hover:rotate-45 transition-transform" />
              </div>
              <span className="text-[10px] font-bold uppercase font-display tracking-wider">Conference</span>
              <span className="text-[8px] opacity-75 uppercase tracking-wide font-display mt-0.5">Multi-Friend Link</span>
            </button>
            <button
              onClick={() => triggerCall('Alice Vance', 'https://picsum.photos/id/1025/150/150', 'video')}
              className="bg-white dark:bg-[#11131A] border border-slate-200 dark:border-white/5 p-4 rounded-[24px] flex flex-col items-center justify-center gap-2 hover:border-pink-500/10 transition-all text-slate-700 dark:text-white active-press"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/20 flex items-center justify-center">
                <Video size={15} className="text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-[10px] font-bold uppercase font-display tracking-wider">Quick Video</span>
              <span className="text-[8px] text-slate-400 dark:text-slate-505 uppercase tracking-wide font-display mt-0.5">Call @alice</span>
            </button>
          </div>

          {/* Touch Dialer Keyboard container */}
          <div className="px-4 py-1 shrink-0">
            <div className="bg-white dark:bg-[#11131A] rounded-[32px] border border-slate-200 dark:border-white/5 p-4.5 shadow-xs">
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest font-display">SECURE DIALER KEYPAD</span>
                <button onClick={() => setDialNumber('')} className="text-[9px] text-red-500 font-bold uppercase tracking-wider font-display">Clear</button>
              </div>

              <div className="text-center font-mono py-2 text-base text-slate-800 dark:text-slate-200 font-bold bg-[#F4F5F8] dark:bg-[#1C1F28] border border-slate-200/30 dark:border-white/5 rounded-2xl mb-4 tracking-widest min-h-[44px] flex items-center justify-center px-4">
                {dialNumber || 'Type or Dial...'}
              </div>

              {/* Grid 3x4 */}
              <div className="grid grid-cols-3 gap-2.5 max-w-[210px] mx-auto text-center mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(num => (
                  <button
                    key={num}
                    onClick={() => handleDialPadPress(num)}
                    className="w-11 h-11 rounded-xl bg-[#F4F5F8] hover:bg-slate-200 dark:bg-[#1C1F28] dark:hover:bg-[#252A37] border border-slate-200/40 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-slate-200 font-mono transition flex items-center justify-center mx-auto active-press"
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => triggerCall(dialNumber || 'Unknown Dialed', 'https://picsum.photos/id/1011/150/150', 'voice')}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 px-4 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider font-display transition active-press"
                  disabled={!dialNumber}
                >
                  <Phone size={11} fill="currentColor" /> Voice
                </button>
                <button
                  onClick={() => triggerCall(dialNumber || 'Unknown Dialed', 'https://picsum.photos/id/1011/150/150', 'video')}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 px-4 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider font-display transition active-press"
                  disabled={!dialNumber}
                >
                  <Video size={11} fill="currentColor" /> Video
                </button>
              </div>
            </div>
          </div>

          {/* Call Logs Section */}
          <div className="p-4 flex-1">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display">Call history logs</span>
              {calls.length > 0 && (
                <button onClick={clearLogs} className="text-[9px] text-red-500 font-bold uppercase tracking-wider font-display flex items-center gap-1">
                  <Trash2 size={11} /> Clear History
                </button>
              )}
            </div>

            {calls.length === 0 ? (
              <div className="text-center py-6 bg-white dark:bg-[#11131A] rounded-[24px] border border-dashed border-slate-200 dark:border-white/5">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-display">No calls history found in database.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {calls.map((log) => (
                  <div key={log.id} className="flex justify-between items-center bg-white dark:bg-[#11131A] p-3.5 rounded-[24px] border border-slate-150 dark:border-white/5 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img src={log.avatar} className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-white/10" alt="" />
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{log.name}</h4>
                        <div className="flex items-center gap-1 mt-1 text-[8px] uppercase font-display tracking-wider text-slate-400">
                          {log.type === 'video' ? <Video size={10} /> : <Phone size={10} />}
                          <span className={log.direction === 'missed' ? 'text-red-500 font-bold' : ''}>
                            {log.direction === 'incoming' ? '↙️ Incoming' : log.direction === 'outgoing' ? '↗️ Outgoing' : '❌ Missed'}
                          </span>
                          <span>• {log.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {log.duration && (
                        <span className="text-[9px] font-mono font-bold bg-[#F4F5F8] dark:bg-[#1C1F28] px-2 py-0.5 rounded-md text-slate-500 border border-slate-200/20">
                          {log.duration}
                        </span>
                      )}
                      <button
                        onClick={() => triggerCall(log.name, log.avatar, log.type)}
                        className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 rounded-xl transition-all"
                        id={`redial-button-${log.id}`}
                      >
                        <RefreshCw size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Active Calling Immersive Screen Mockup
        <div className="absolute inset-0 bg-[#0A0B10] z-[100] flex flex-col justify-between p-6 text-white animate-fade-in select-none">
          {/* Call Header info */}
          <div className="flex justify-between items-center pt-2">
            <div>
              <span className="text-[9px] text-[#4ade80] font-black tracking-widest font-display flex items-center gap-1.5 uppercase bg-green-950/30 p-2 px-3 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> Live Connected
              </span>
              <p className="text-[8px] text-slate-550 mt-1.5 uppercase tracking-widest font-display font-semibold">RTC 128-BIT E2E ENCRYPTED LINK</p>
            </div>

            <span className="text-xs font-mono font-bold bg-white/10 px-3.5 py-1.5 rounded-full text-white/90">
              {formatDuration(callDuration)}
            </span>
          </div>

          {/* Direct Visual Frame */}
          <div className="flex-1 my-6 relative flex flex-col items-center justify-center">
            {activeCall.type === 'video' ? (
              <div className="w-full h-full rounded-[36px] overflow-hidden relative bg-[#11131A] border border-white/5">
                {/* Local user camera output */}
                {webcamEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#11131A] text-center px-4">
                    <img src={currentUser.avatar} className="w-20 h-20 rounded-full border border-blue-500/30 p-1.5 animate-pulse" alt="Local webcam stream placeholder" />
                    <span className="text-[10px] text-slate-400 mt-3 font-display uppercase tracking-widest font-bold">Uploading Local Video Feed...</span>
                    <span className="text-[8px] text-slate-500 mt-1 uppercase tracking-widest font-mono font-medium">CAMERA WEBCAM SIMULATOR</span>
                  </div>
                )}

                {/* Peer Friend floating thumbnail inside card */}
                <div className="absolute bottom-4 right-4 w-24 h-36 rounded-2xl border-2 border-white/10 overflow-hidden shadow-2xl bg-[#0A0B10]">
                  <img src={activeCall.avatar} className="w-full h-full object-cover" alt="" />
                  <span className="absolute bottom-1.5 left-2 bg-black/60 text-[8px] px-2 py-0.5 rounded-md font-display font-semibold uppercase tracking-wider">{activeCall.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              // Audio Voice Call screen visualizer waves
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-[ping_2.5s_infinite_100ms]" />
                  <div className="absolute inset-0 rounded-full bg-blue-550/10 animate-[ping_2.5s_infinite_600ms]" />
                  <img src={activeCall.avatar} className="w-28 h-28 rounded-full border-2 border-blue-400 shadow-xl object-cover relative z-10" alt="" />
                </div>
                <h3 className="text-base font-extrabold font-display leading-tight mt-6 tracking-wide text-white uppercase">{activeCall.name}</h3>
                <span className="text-[9px] text-slate-400 mt-1.5 font-display uppercase tracking-widest font-bold">Voice calling...</span>
              </div>
            )}
          </div>

          {/* Calling Action Tray Controls */}
          <div className="bg-[#1C1F28]/95 backdrop-blur-md rounded-full p-4 flex justify-around items-center max-w-[290px] mx-auto w-full mb-4 border border-white/5 shadow-xl">
            <button
              onClick={() => setMicMuted(!micMuted)}
              className={`p-3 rounded-full transition-all hover:bg-white/10 active-press ${micMuted ? 'bg-red-650 text-white' : 'bg-white/5 text-white/90'}`}
              title={micMuted ? 'Unmute' : 'Mute'}
            >
              {micMuted ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {activeCall.type === 'video' && (
              <button
                onClick={() => setCamOff(!camOff)}
                className={`p-3 rounded-full transition-all hover:bg-white/10 active-press ${camOff ? 'bg-red-650 text-white' : 'bg-white/5 text-white/90'}`}
                title={camOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {camOff ? <VideoOff size={15} /> : <Video size={15} />}
              </button>
            )}

            <button
              onClick={() => setSpeakerOn(!speakerOn)}
              className={`p-3 rounded-full transition-all hover:bg-white/10 active-press ${speakerOn ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'bg-white/5 text-white/90'}`}
              title="Speakerphone"
            >
              <Volume2 size={15} />
            </button>

            <button
              onClick={hangUpCall}
              className="p-3 bg-red-650 hover:bg-red-705 text-white rounded-full hover:scale-110 active-press transition-all shadow-lg text-white"
              title="Hang Up"
              id="btn-hang-up"
            >
              <PhoneOff size={15} fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
