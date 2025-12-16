import api from './api';

const MessageService = {
    // Get all conversations with pagination
    getConversations: async (params = {}) => {
        // params: page, limit, sort
        return await api.get('/message/all', { params });
    },

    // Get messages for a specific conversation
    getMessages: async (conversationId) => {
        return await api.get(`/message/${conversationId}/all`);
    },

    // Send a message (Text or File)
    sendMessage: async (conversationId, data) => {
        // data should be an object: { type, content, attachment? }
        // If attachment exists, use FormData
        
        if (data.attachment) {
            const formData = new FormData();
            formData.append('type', data.type);
            // content might be optional if just sending a file, but usually sent as empty string or caption
            if (data.content) formData.append('content', data.content); 
            formData.append('attachment', data.attachment);
            
            return await api.post(`/message/${conversationId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Let axios set boundary
            });
        } else {
            return await api.post(`/message/${conversationId}`, data);
        }
    },

    // Create or get existing conversation
    createConversation: async (targetUserId) => {
        return await api.post(`/message/create/${targetUserId}`);
    },
    
    // Mark message as read (if API exists, or just via socket)
    // The prompt only mentioned Socket for read-message, but usually there's an API sync too?
    // User request: "Socket: Emit join-conversation... Emit read-message" 
    // It doesn't explicitly list a REST API for marking read, so relying on Socket.
};

export default MessageService;
