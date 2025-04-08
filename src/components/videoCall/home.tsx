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

            const response = await fetch(`http://localhost:8000/room/create`, {
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

            const response = await fetch(`http://localhost:8000/room/verify`, {
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
        <div className="h-screen h-dvh flex items-center justify-center px-2">
            <div className="flex flex-col items-center justify-center gap-8 text-white bg-gray-900 p-8 md:p-12 rounded-2xl shadow-lg min-w-md">
                <div className="flex items-center gap-4 text-4xl md:text-5xl">
                    <FontAwesomeIcon icon={faComments} />
                    <h1 className="font-bold select-none">Video Chat</h1>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="space-y-1 w-full">
                            <input type="text" placeholder="Room Code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} className="px-4 py-2 rounded-md bg-gray-800 w-full" />
                            {roomCodeError && <p className="text-red-500 text-sm">{roomCodeError}</p>}
                        </div>

                        <div className="space-y-1 w-full">
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 rounded-md bg-gray-800 w-full" />
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center  w-full">
                        <button type="button" onClick={handleCreateRoom} className={`whitespace-nowrap px-4 py-2 bg-blue-600 rounded-lg shadow-md w-full flex items-center justify-center gap-2 ${loading ? "opacity-75 bg-opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
                            <Spin spinning={createRoomLoading}>
                                <span>Create Room</span>
                            </Spin>
                        </button>

                        <button type="button" onClick={handleJoinRoom} className={`whitespace-nowrap px-4 py-2 bg-green-600 rounded-lg shadow-md w-full flex items-center justify-center gap-2 ${loading ? "opacity-75 bg-opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>

                            <Spin spinning={joinRoomLoading}>

                                <span>Join Room</span>
                            </Spin>

                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
