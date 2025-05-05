import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import VideoPreview from "../VideoCallHealper/components/VideoPreview";
import VideoControl from "../VideoCallHealper/components/VideoControl";
import FullPageLoader from "../VideoCallHealper/components/FullPageLoader";
import NoUserScreen from "../VideoCallHealper/components/NoUserScreen";
import FullPageError from "../VideoCallHealper/components/FullPageError";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { Modal } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

let socket: any = null;

const Room = () => {

    const { goTo } = useAppNavigation();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const divRef = useRef(null);
    const location = useLocation();
    const appointment_id = location?.state?.id;

    const { roomCode } = useParams();

    // Local User Video Stream
    const [videoStream, setVideoStream] = useState<any>(null);
    const [videoStreamHasVideo, setVideoStreamHasVideo] = useState<any>(false);
    const [videoStreamHasAudio, setVideoStreamHasAudio] = useState<any>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    // Peer Video Stream
    const [peerVideoStream, setPeerVideoStream] = useState(null);
    const [peerVideoStreamHasVideo, setPeerVideoStreamHasVideo] = useState(false);
    const [peerVideoStreamHasAudio, setPeerVideoStreamHasAudio] = useState(false);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const screenTrackRef = useRef<MediaStreamTrack | null>(null);

    const peerConnection = useRef(
        new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun.l.google.com:5349" },
                { urls: "stun:stun1.l.google.com:3478" },
                { urls: "stun:stun1.l.google.com:5349" },
                { urls: "stun:stun2.l.google.com:19302" },
                { urls: "stun:stun2.l.google.com:5349" },
                { urls: "stun:stun3.l.google.com:3478" },
                { urls: "stun:stun3.l.google.com:5349" },
                { urls: "stun:stun4.l.google.com:19302" },
                { urls: "stun:stun4.l.google.com:5349" },
            ],
        })
    );

    useEffect(() => {
        console.log(screenStream ,)
        const verifyRoom = async (password: any) => {
            try {
                const response = await fetch(
                    `https://video-call-be-6eie.onrender.com/room/verify`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ roomCode, password }),
                    }
                );
                const data = await response.json();

                if (!data.status) throw new Error(data.message);
            } catch (error: any) {
                throw new Error(error.message);
            }
        };

        if (socket) {
            socket.disconnect();
            socket = null;
        }

        const userId = Math.random().toString(36);
        const password = getPassword();

        verifyRoom(password)
            .then(() => {
                return navigator?.mediaDevices
                    ?.getUserMedia({
                        video: {
                            width: { min: 640, ideal: 1280, max: 1920 },
                            height: { min: 400, ideal: 720, max: 1080 },
                        },
                        audio: true,
                    })
                    .then((stream: any) => {
                        setVideoStream(stream);

                        setVideoStreamHasVideo(
                            stream.getVideoTracks().some((track: any) => track.enabled)
                        );
                        setVideoStreamHasAudio(
                            stream.getAudioTracks().some((track: any) => track.enabled)
                        );

                        stream.getTracks().forEach((track: any) => {
                            peerConnection.current.addTrack(track, stream);
                        });

                        socket = io("https://video-call-be-6eie.onrender.com/", {
                            transports: ["websocket"],
                        });

                        console.log(socket);

                        bindEvents();

                        socket.emit("join-room", { roomCode, password, userId });
                    });
            })
            .catch((err) => {
                if (
                    err.name === "NotAllowedError" ||
                    err.name === "PermissionDeniedError"
                ) {
                    setError(
                        "Please allow camera and microphone access to join the meeting by clicking on the lock icon in the address bar."
                    );
                } else {
                    setError(err.message);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }, [roomCode]);

    const getPassword = () => {
        // Check if password is in URL and set it in localStorage
        const urlParams = new URLSearchParams(window.location.search);
        let urlPassword = urlParams.get("password");

        if (urlPassword) {
            try {
                urlPassword = atob(urlPassword);
            } catch {
                urlPassword = null;
            }
        }

        if (urlPassword) {
            localStorage.setItem("password", urlPassword);
            window.history.replaceState({}, document.title, window.location.pathname); // Remove query params from URL
        }

        return localStorage.getItem("password") ?? null;
    };

    const bindEvents = () => {
        socket.on("user-connected", () => {
            peerConnection.current.createOffer().then((offer) => {
                peerConnection.current.setLocalDescription(offer);
                socket.emit("offer", offer);
            });
        });

        socket.on("user-disconnected", () => {
            setPeerVideoStream(null);
        });

        socket.on("offer", (offer: any) => {
            peerConnection.current
                .setRemoteDescription(new RTCSessionDescription(offer))
                .then(() => peerConnection.current.createAnswer())
                .then((answer) => {
                    peerConnection.current.setLocalDescription(answer);
                    socket.emit("answer", answer);
                });
        });

        socket.on("answer", (answer: any) => {
            peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        });

        socket.on("candidate", (candidate: any) => {
            peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
        });

        socket.on("stateChange", ({ hasVideo, hasAudio }: any) => {
            setPeerVideoStreamHasVideo(hasVideo);
            setPeerVideoStreamHasAudio(hasAudio);
        });

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) socket.emit("candidate", event.candidate);
        };

        peerConnection.current.ontrack = (event: any) => {
            setPeerVideoStream(event.streams[0]);

            setPeerVideoStreamHasVideo(event.streams[0].getVideoTracks().length > 0);
            setPeerVideoStreamHasAudio(event.streams[0].getAudioTracks().length > 0);
        };

        peerConnection.current.onconnectionstatechange = () => {
            if (
                peerConnection.current.connectionState === "disconnected" ||
                peerConnection.current.connectionState === "closed"
            )
                setPeerVideoStream(null);
        };
    };

    const unbindEvents = () => {
        if (socket) {
            socket.off("user-connected");
            socket.off("user-disconnected");
            socket.off("offer");
            socket.off("answer");
            socket.off("candidate");
            socket.off("stateChange");
        }

        if (peerConnection.current) {
            peerConnection.current.onicecandidate = null;
            peerConnection.current.ontrack = null;
            peerConnection.current.onconnectionstatechange = null;
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8002/delete-appointment/${id}`);
            if (response.status === 200) {
                toast.success("Appointment closed successfully!");
            } else {
                toast.warning("Something went wrong while deleting.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to close the Appointment.");
        }
    }

    const handleVideoToggle = () => {
        peerConnection.current.getSenders().forEach((sender) => {
            if (sender?.track?.kind === "video") {
                sender.track.enabled = !videoStreamHasVideo;
            }
        });

        socket.emit("stateChange", {
            hasVideo: !videoStreamHasVideo,
            hasAudio: videoStreamHasAudio,
        });

        setVideoStreamHasVideo(!videoStreamHasVideo);
    };

    const handleMuteToggle = () => {
        peerConnection.current.getSenders().forEach((sender) => {
            if (sender?.track?.kind === "audio") {
                sender.track.enabled = !videoStreamHasAudio;
            }
        });

        socket.emit("stateChange", {
            hasVideo: videoStreamHasVideo,
            hasAudio: !videoStreamHasAudio,
        });

        setVideoStreamHasAudio(!videoStreamHasAudio);
    };

    const handleEndCall = () => {
        try {
            unbindEvents();
            peerConnection.current.close();
            if (videoStream) {
                videoStream.getTracks().forEach((track: any) => track.stop());
            }
            localStorage.removeItem("password");
            socket.disconnect();
            goTo("/appointments")
        } catch (error) {
            console.error(error)
        } finally {
            setModalOpen(false)
        }
    };

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false, // You can set true if you want to capture audio too
            });

            const screenTrack = stream.getVideoTracks()[0];
            screenTrackRef.current = screenTrack;
            setScreenStream(stream);

            const videoSender = peerConnection.current.getSenders().find(
                (sender) => sender.track?.kind === "video"
            );

            if (videoSender) {
                videoSender.replaceTrack(screenTrack);
            }

            screenTrack.onended = () => {
                stopScreenShare();
            };

            toast.info("You are now screen sharing.");
        } catch (err) {
            console.error("Error sharing screen:", err);
        }
    };

    const stopScreenShare = () => {
        const originalVideoTrack = videoStream?.getVideoTracks()[0];

        const videoSender = peerConnection.current.getSenders().find(
            (sender) => sender.track?.kind === "video"
        );

        if (videoSender && originalVideoTrack) {
            videoSender.replaceTrack(originalVideoTrack);
        }

        if (screenTrackRef.current) {
            screenTrackRef.current.stop();
            screenTrackRef.current = null;
        }

        setScreenStream(null);
        toast.info("Screen sharing stopped.");
    };

    const handleScreenShare = async () => {
        if (isScreenSharing) {
            stopScreenShare();
        } else {
            await startScreenShare();
        }
        setIsScreenSharing(!isScreenSharing);
    };

    if (isLoading) return <FullPageLoader />;

    if (error) return <FullPageError error={error} />;


    // const stopRecording = () => {
    //     if (mediaRecorderRef.current) {
    //         mediaRecorderRef.current?.stop();
    //         setIsRecording(false);
    //     }
    // };

    // const downloadRecording = () => {
    //     if (recordedChunks.length === 0) return;
    //     const blob = new Blob(recordedChunks, { type: "video/webm" });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = "recording.webm";
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    // };

    // const startRecording = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getDisplayMedia({
    //             video: { mediaSource: "screen" },
    //             audio: true,
    //         });

    //         const mediaRecorder = new MediaRecorder(stream, {
    //             mimeType: "video/webm",
    //         });

    //         mediaRecorder.ondataavailable = (event: any) => {
    //             if (event.data.size > 0) {
    //                 setRecordedChunks((prev: any) => [...prev, event.data]);
    //             }
    //         };

    //         mediaRecorder.start();
    //         mediaRecorderRef.current = mediaRecorder;
    //         setIsRecording(true);
    //     } catch (error) {
    //         console.error("Error starting recording:", error);
    //     }
    // };

    return (
        <div ref={divRef} className="h-[92vh] relative">
            {/* <div className="absolute top-4 right-4 z-50 bg-black p-2 rounded-full shadow-lg cursor-pointer">
                <img
                    style={{ borderRadius: "10vh", height: "10vh", width: "15vw" }}
                    src={img}
                ></img>
            </div>
            <div className="absolute top-20 right-6 z-50 bg-black p-2 rounded-full shadow-lg cursor-pointer">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="bg-red-500 text-white p-2 rounded"
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="bg-gray-500 text-white p-2 rounded"
                    >
                        Stop Recording
                    </button>
                )}
                {recordedChunks.length > 0 && (
                    <button
                        onClick={downloadRecording}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Download Recording
                    </button>
                )}
            </div> */}

            <div className="h-full w-full">
                {!peerVideoStream && <NoUserScreen />}
                {peerVideoStream && (
                    <VideoPreview
                        stream={peerVideoStream}
                        hasVideo={peerVideoStreamHasVideo}
                        hasAudio={peerVideoStreamHasAudio}
                    />
                )}
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 md:translate-x-0 top-6 md:left-6 z-40 border w-[300px] h-[200px] shadow-xl">
                <VideoPreview
                    stream={videoStream}
                    hasVideo={videoStreamHasVideo}
                    hasAudio={videoStreamHasAudio}
                    muted
                />
            </div>

            <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 z-50 space-y-3">
                <VideoControl
                    isVideoOn={videoStreamHasVideo}
                    isMicOn={videoStreamHasAudio}
                    onToggleVideo={handleVideoToggle}
                    onToggleMute={handleMuteToggle}
                    onScreenShare={handleScreenShare}
                    isScreenSharing={isScreenSharing}
                    onEndCall={() => {
                        setModalOpen(true);
                        console.log(appointment_id);
                    }}
                />

            </div>
            <Modal
                open={isModalOpen}
                onClose={() => {
                    setModalOpen(false)
                }}
                onCancel={() => {
                    setModalOpen(false)
                }}
                onOk={() => {
                    handleDelete(appointment_id)
                    handleEndCall()
                }
                }
            >
                You are ending the meeting , which once done can't be reversed . Please click yes to proceed .
            </Modal>
        </div>
    );
};

export default Room;
