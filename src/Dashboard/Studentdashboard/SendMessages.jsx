import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import MessageService from "../../services/message.service";
import { toast } from "react-toastify";
import { useAuth } from "../../context/UseAuth";

export default function SendMessages() {
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
                    // Check if participants are populated
                    const needsPopulation = conversation.participants.some(p => typeof p === 'string');
                    const tutor = location.state?.tutor;

                    if (needsPopulation && tutor && user) {
                         conversation = {
                             ...conversation,
                             participants: [user, tutor] 
                         };
                    }

                    navigate('/dashboard/messages', { state: { conversation } });
                } else {
                    toast.error("Could not create conversation");
                    navigate('/dashboard/messages');
                }
            } catch (error) {
                console.error("Error creating conversation:", error);
                toast.error("Failed to start conversation");
                navigate('/dashboard/messages');
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
