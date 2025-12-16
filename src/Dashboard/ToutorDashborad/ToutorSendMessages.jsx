import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import MessageService from "../../services/message.service";
import { toast } from "react-toastify";
import { useAuth } from "../../context/UseAuth";

export default function ToutorSendMessages() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const initConversation = async () => {
            if (!id) return;
            try {
                const res = await MessageService.createConversation(id);
                // API likely returns the conversation object
                let conversation = res?.data || res?.response?.data;
                
                if (conversation) {
                    // Check if participants are populated. If not (just IDs), we populate manually for immediate UI update.
                    const needsPopulation = conversation.participants.some(p => typeof p === 'string');
                    const student = location.state?.student;

                    if (needsPopulation && student && user) {
                         // Construct populated participants
                         // careful to match the order or just include both
                         // The structure usually is an array of objects
                         conversation = {
                             ...conversation,
                             participants: [user, student] 
                         };
                    }

                    // Navigate with the (potentially manually populated) conversation object
                    navigate('/toturdashbord/toutormessages', { state: { conversation } });
                } else {
                    toast.error("Could not create conversation");
                    navigate('/toturdashbord/toutormessages');
                }
            } catch (error) {
                console.error("Error creating conversation:", error);
                toast.error("Failed to start conversation");
                navigate('/toturdashbord/toutormessages');
            }
        };
        
        initConversation();
    }, [id, navigate, location.state, user]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <p className="text-gray-500">Starting conversation...</p>
        </div>
    );
}
