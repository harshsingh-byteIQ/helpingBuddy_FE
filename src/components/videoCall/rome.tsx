import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import VideoPreview from "../VideoCallHealper/components/VideoPreview";
import VideoControl from "../VideoCallHealper/components/VideoControl";
import FullPageLoader from "../VideoCallHealper/components/FullPageLoader";
import NoUserScreen from "../VideoCallHealper/components/NoUserScreen";
import FullPageError from "../VideoCallHealper/components/FullPageError";
import { Excalidraw, exportToCanvas } from "@excalidraw/excalidraw";
import type {
    ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { Button, Modal } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { baseURL } from "../../utils/axios";
import { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

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

    //white board 
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
    const [elements, setElements] = useState<readonly ExcalidrawElement[]>([]);

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
        console.log(screenStream);
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
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            channelCount: 2,
                            sampleRate: 44100,
                        },
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
                    console.log(err);
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

    // useEffect(() => {
    //     if (socket && roomCode) {
    //         socket.emit("whiteboard:requestSync", { roomCode });
    //     }
    // }, [socket, roomCode]);

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

        // socket.on("whiteboard:sync", ({ elements }: any) => {
        //     if (excalidrawRef.current) {
        //         excalidrawRef.current.updateScene({ elements });
        //     }
        // });

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
            // socket.off("whiteboard:sync");
        }

        if (peerConnection.current) {
            peerConnection.current.onicecandidate = null;
            peerConnection.current.ontrack = null;
            peerConnection.current.onconnectionstatechange = null;
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(`${baseURL}delete-appointment/${id}`);
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
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                }
            });

            // Mix both audio streams
            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            // Create sources from each audio stream
            const systemSource = audioContext.createMediaStreamSource(screenStream);
            const micSource = audioContext.createMediaStreamSource(micStream);

            // Connect both sources to the destination (mix them)
            systemSource.connect(destination);
            micSource.connect(destination);

            // Get video track
            const screenVideoTrack = screenStream.getVideoTracks()[0];
            screenTrackRef.current = screenVideoTrack;
            setScreenStream(screenStream);

            // Replace video track in peer connection
            const videoSender = peerConnection.current.getSenders().find(
                (sender) => sender.track?.kind === "video"
            );
            if (videoSender) {
                videoSender.replaceTrack(screenVideoTrack);
            }

            // Get mixed audio track
            const mixedAudioTrack = destination.stream.getAudioTracks()[0];

            // Replace or add mixed audio track
            const audioSender = peerConnection.current.getSenders().find(
                (sender) => sender.track?.kind === "audio"
            );
            if (audioSender) {
                audioSender.replaceTrack(mixedAudioTrack);
            } else {
                peerConnection.current.addTrack(mixedAudioTrack, destination.stream);
            }

            screenVideoTrack.onended = () => {
                stopScreenShare(); // reset UI, stream, etc.
            };

            toast.info("You are now screen sharing with mic + tab audio.");
        } catch (err) {
            console.error("Error sharing screen with mixed audio:", err);
            toast.error("Screen sharing failed.");
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

    const handleExport = () => {
        if (excalidrawRef.current) {
            const canvas = exportToCanvas({
                elements,
                appState: {
                    ...excalidrawRef.current.getAppState(),
                    exportWithDarkMode: false,
                },
                files: excalidrawRef.current.getFiles(),
            });
            const link = document.createElement("a");
            link.download = "drawing.png";
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <div ref={divRef} className="h-[92vh] relative">
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
                    isDrawingBoard={showWhiteboard}
                    onToggleWhiteboard={() => {
                        setShowWhiteboard(!showWhiteboard);
                    }}
                    onScreenShare={handleScreenShare}
                    isScreenSharing={isScreenSharing}
                    onEndCall={() => {
                        setModalOpen(true);
                        console.log(appointment_id);
                    }}
                />

            </div>

            {/* <div className="absolute bottom-7 right-6 z-50 space-y-3">
                <button
                    onClick={() => {
                        setShowWhiteboard(!showWhiteboard);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {showWhiteboard ? "Hide Whiteboard" : "Show Whiteboard"}
                </button>
            </div> */}


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
            <Modal
                title="Whiteboard"
                open={showWhiteboard}
                onCancel={() => {
                    setShowWhiteboard(false)
                }}
                footer={[
                    <Button key="export" onClick={handleExport}>
                        Export
                    </Button>,
                    <Button key="close" type="primary" onClick={() => {
                        setShowWhiteboard(false)
                    }}>
                        Close
                    </Button>,
                ]}
                width="90vw"
                style={{ top: 20 }}
                bodyStyle={{ height: "80vh", padding: 0 }}
                destroyOnClose
            >
                <div style={{ height: "100%", width: "100%" }}>
                    <Excalidraw
                        onChange={(elements) => {
                            setElements(elements);

                            if (socket && socket.connected && roomCode) {
                                socket.emit("whiteboard:update", { elements, roomCode });
                            }
                        }}
                        initialData={{
                            elements: [],
                            appState: { viewBackgroundColor: "#ffffff" },
                        }}
                    />

                </div>
            </Modal>
        </div>
    );
};

export default Room;
