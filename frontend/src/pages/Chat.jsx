import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, onSnapshot, addDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthContext } from "../hooks/use.auth.context";
import "../styles/Chat.css";
import Navbar from "../ui/Navbar";

export default function ChatPage() {
  const { id } = useParams();
  const context = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userPresent, setUserPresent] = useState(true);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState(null);
  const [otherUserAvailable, setOtherUserAvailable] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [canJoinCall, setCanJoinCall] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const messagesRef = useRef(null);

  const ROOMS = {
    ROOM1: "room-alpha-123",
    ROOM2: "room-beta-456",
    ROOM3: "room-gamma-789"
  };

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id || id === "example") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://backend.flaap.me/api/user-info/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user data');

        const resData = await response.json();
        if (!resData?.user) throw new Error('Invalid user data format');

        if (resData.user.selected_url && resData.user.selected_url !== "default_url") {
          setRedirecting(true);
          window.location.href = resData.user[resData.user.selected_url];
          return;
        }

        setUserInfo(resData.user);
      } catch (error) {
        console.error('User data fetch error:', error);
        setUserPresent(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (userInfo.username) {
      const firstName = userInfo.username.split(' ')[0];
      document.title = `${firstName}'s Flap`;
    }
  }, [userInfo.username]);

  useEffect(() => {
    if (!id || !context?.user) return;

    const messagesCollection = collection(db, "chats", id, "messages");
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setError('Failed to load messages: ' + error.message);
    });

    return () => unsubscribe();
  }, [id, context?.user]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedRoom && userInfo.room1) {
      if (selectedRoom === userInfo.room1) {
        setCanJoinCall(true);
      } else {
        setCanJoinCall(false);
        setError('Room codes do not match. Please select the correct room.');
      }
    }
  }, [selectedRoom, userInfo.room1]);

  const setupPeerConnection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;

      peerConnectionRef.current = new RTCPeerConnection(iceServers);
      stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));

      peerConnectionRef.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          addDoc(collection(db, 'calls', id, 'candidates'), {
            candidate: event.candidate.toJSON(),
            senderId: context.user.unique_id
          });
        }
      };

      peerConnectionRef.current.onconnectionstatechange = () => {
        if (peerConnectionRef.current.connectionState === 'disconnected' || 
            peerConnectionRef.current.connectionState === 'failed') {
          endCall();
          setError('Call disconnected');
        }
      };

      onSnapshot(doc(db, 'calls', id), (snapshot) => {
        const data = snapshot.data();
        if (data && data.offer && data.offer.senderId !== context.user.unique_id && !isCallActive && canJoinCall) {
          handleOffer(data.offer);
        }
        if (data && data.answer && data.answer.senderId !== context.user.unique_id) {
          handleAnswer(data.answer);
        }
      }, (error) => {
        console.error('Error listening to call document:', error);
        setError('Failed to connect video call: ' + error.message);
      });

      onSnapshot(collection(db, 'calls', id, 'candidates'), (snapshot) => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const candidateData = change.doc.data();
            if (candidateData.senderId !== context.user.unique_id) {
              handleCandidate(candidateData.candidate);
            }
          }
        });
      }, (error) => {
        console.error('Error listening to candidates:', error);
        setError('Failed to process ICE candidates: ' + error.message);
      });
    } catch (error) {
      console.error('Error setting up media:', error);
      setError('Failed to access camera/microphone: ' + error.message);
    }
  };

  const startCall = async () => {
    if (!peerConnectionRef.current || !context?.user) {
      setError('Cannot start call. Please try again.');
      return;
    }
    if (!canJoinCall) {
      setError('Cannot start call: Room codes do not match.');
      return;
    }
    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      await setDoc(doc(db, 'calls', id), {
        offer: { sdp: offer.sdp, senderId: context.user.unique_id, room: selectedRoom }
      });
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
      setError('Failed to start call: ' + error.message);
    }
  };

  const handleOffer = async (offer) => {
    if (!peerConnectionRef.current || isCallActive || offer.senderId === context.user.unique_id || offer.room !== selectedRoom) return;
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offer.sdp }));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      await setDoc(doc(db, 'calls', id), {
        answer: { sdp: answer.sdp, senderId: context.user.unique_id, room: selectedRoom }
      }, { merge: true });
      setIsCallActive(true);
    } catch (error) {
      console.error('Error handling offer:', error);
      setError('Failed to handle incoming call: ' + error.message);
    }
  };

  const handleAnswer = async (answer) => {
    if (!peerConnectionRef.current) return;
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer.sdp }));
    } catch (error) {
      console.error('Error handling answer:', error);
      setError('Failed to connect call: ' + error.message);
    }
  };

  const handleCandidate = async (candidate) => {
    if (!peerConnectionRef.current) return;
    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling candidate:', error);
      setError('Failed to add ICE candidate: ' + error.message);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !context?.user || !id) return;

    try {
      await addDoc(collection(db, "chats", id, "messages"), {
        senderId: context.user.unique_id,
        senderName: context.user.username,
        content: inputValue,
        timestamp: new Date(),
      });
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError('Failed to send message: ' + error.message);
    }
  };

  const checkUserAvailability = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", id));
      if (userDoc.exists() && userDoc.data().isOnline) {
        setOtherUserAvailable(true);
      } else {
        setOtherUserAvailable(false);
        setError('Other user is not available');
      }
    } catch (error) {
      console.error('Error checking user availability:', error);
      setError('Failed to check user availability: ' + error.message);
    }
  };

  useEffect(() => {
    if (context?.user && id && userPresent) {
      setupPeerConnection();
    }
    return () => endCall();
  }, [context?.user, id, userPresent]);

  if (!context || !context.user) return <div>Please log in to access the chat.</div>;
  if (context.loading || loading) return <div>Loading...</div>;
  if (!userPresent) return <div>User not found</div>;
  if (redirecting) return null;

  return (
    <div className="chat-page">
      <Navbar />
      <h1 className="chat-title">{userInfo.username}'s Chat</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="chat-container">
        <div className="video-section">
          <div className="video-container">
            <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
            {remoteStream && (
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            )}
          </div>
          <div className="call-controls">
            {!isCallActive ? (
              <button onClick={startCall} disabled={!canJoinCall} className="call-button">
                Start Video Call
              </button>
            ) : (
              <button onClick={endCall} className="call-button end-call">
                End Call
              </button>
            )}
          </div>
        </div>

        <div className="chat-section">
          <div className="room-selection">
            <label>Select a Room: </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="room-select"
            >
              <option value="">-- Select Room --</option>
              <option value={ROOMS.ROOM1}>Room 1 ({ROOMS.ROOM1})</option>
              <option value={ROOMS.ROOM2}>Room 2 ({ROOMS.ROOM2})</option>
              <option value={ROOMS.ROOM3}>Room 3 ({ROOMS.ROOM3})</option>
            </select>
            {selectedRoom && (
              <p>Selected Room Code: {selectedRoom}</p>
            )}
            {userInfo.room1 && (
              <p>User's Room Code: {userInfo.room1}</p>
            )}
          </div>
          <div className="messages-container" ref={messagesRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.senderId === context.user?.unique_id ? "sent" : "received"}`}
              >
                <div className="message-header">
                  <span className="message-sender">{message.senderName}</span>
                  <span className="message-timestamp">
                    {message.timestamp?.toDate()?.toLocaleTimeString()}
                  </span>
                </div>
                <p className="message-content">{message.content}</p>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input"
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="send-button">Send</button>
          </div>
          <button onClick={checkUserAvailability} className="connect-button">
            Check User Availability
          </button>
          {otherUserAvailable && (
            <button onClick={startCall} disabled={!canJoinCall} className="call-button">
              Share Call/Video
            </button>
          )}
        </div>
      </div>
    </div>
  );
}