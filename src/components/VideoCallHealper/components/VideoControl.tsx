import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faMicrophoneSlash, faVideo, faVideoSlash, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";


const VideoControl = ({ isVideoOn, isMicOn, onToggleVideo, onToggleMute, onEndCall, onScreenShare, isScreenSharing, className = "", ...props }: any) => {
    return (
        <div className={`py-2 flex items-center justify-center gap-8 ${className}`} {...props}>
            <button type="button" className={`bg-white h-14 w-14 border rounded-full text-xl flex items-center justify-center shadow-xl ${isMicOn ? "text-black" : "text-red-500"}`} onClick={onToggleMute}>
                <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
            </button>

            <button type="button" className="bg-red-500 h-14 w-14 text-white p-20 rounded-2xl text-3xl flex items-center justify-center shadow-xl" onClick={onEndCall}>
                <FontAwesomeIcon icon={faPhone} className="transform rotate-[135deg] mt-1" />
            </button>

            <button type="button" className={`bg-white h-14 w-14 border rounded-full text-xl flex items-center justify-center shadow-xl ${isVideoOn ? "text-black" : "text-red-500"}`} onClick={onToggleVideo}>
                <FontAwesomeIcon icon={isVideoOn ? faVideo : faVideoSlash} />
            </button>

            <button type="button" className={`bg-white h-14 w-14 border rounded-full text-xl flex items-center justify-center shadow-xl ${isScreenSharing ? "text-green-600" : "text-black"}`} onClick={onScreenShare}>
                <FontAwesomeIcon icon={faDesktop} />
            </button>
        </div>
    );
};

export default VideoControl