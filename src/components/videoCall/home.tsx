import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { Spin } from "antd";

const Home = () => {
    const navigate = useNavigate();

    const [roomCode, setRoomCode] = useState("");
    const [password, setPassword] = useState("");

    const [roomCodeError, setRoomCodeError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [createRoomLoading, setCreateRoomLoading] = useState(false);
    const [joinRoomLoading, setJoinRoomLoading] = useState(false);
    const loading = createRoomLoading || joinRoomLoading;

    const handleCreateRoom = async () => {
        try {
            setRoomCodeError("");
            setPasswordError("");
            setCreateRoomLoading(true);

            const response = await fetch(`https://video-call-be-6eie.onrender.com/room/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomCode, password }),
            });

            const data = await response.json();
            if (!data.status) {
                if (data.errors) {
                    Object.keys(data.errors).forEach((error) => {
                        if (error === "roomCode") setRoomCodeError(data.errors[error]);
                        if (error === "password") setPasswordError(data.errors[error]);
                    });

                    setCreateRoomLoading(false);
                    return;
                }

                throw new Error(data.message);
            }

            localStorage.setItem("password", password);
            navigate(`/room/${roomCode}`);
        } catch (error: any) {
            setPasswordError(error.message);
        }

        setCreateRoomLoading(false);
    };

    const handleJoinRoom = async () => {
        try {
            setRoomCodeError("");
            setPasswordError("");
            setJoinRoomLoading(true);

            const response = await fetch(`https://video-call-be-6eie.onrender.com/room/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomCode, password }),
            });

            const data = await response.json();
            if (!data.status) {
                if (data.errors) {
                    Object.keys(data.errors).forEach((error) => {
                        if (error === "roomCode") setRoomCodeError(data.errors[error]);
                        if (error === "password") setPasswordError(data.errors[error]);
                    });

                    setJoinRoomLoading(false);
                    return;
                }

                throw new Error(data.message);
            }

            localStorage.setItem("password", password);
            navigate(`/room/${roomCode}`);
        } catch (error: any) {
            setPasswordError(error.message);
        }

        setJoinRoomLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-md p-6 md:p-8 rounded-xl bg-gray-900 shadow-lg text-white space-y-6">
                <div className="flex items-center gap-4 justify-center text-4xl font-bold">
                    <FontAwesomeIcon icon={faComments} />
                    <h1 className="select-none">Video Chat</h1>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {roomCodeError && <p className="text-sm text-red-500 mt-1">{roomCodeError}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        type="button"
                        onClick={handleCreateRoom}
                        className={`w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
                        disabled={loading}
                    >
                        <Spin spinning={createRoomLoading}>
                            <span>Create Room</span>
                        </Spin>
                    </button>

                    <button
                        type="button"
                        onClick={handleJoinRoom}
                        className={`w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
                        disabled={loading}
                    >
                        <Spin spinning={joinRoomLoading}>
                            <span>Join Room</span>
                        </Spin>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
