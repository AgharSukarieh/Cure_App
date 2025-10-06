// Chat Service
import { apiRequest } from '../config/apiConfig';
import API from '../config/apiConfig';

/**
 * Chat Service
 * Handles all chat-related API calls (single and group chat)
 */
class ChatService {
  
  // ==================== SINGLE CHAT METHODS ====================
  
  /**
   * Get single chat conversations
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Single chat conversations response
   */
  async getSingleChatConversations(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.chat.single_chat.get_conversations,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب محادثات الدردشة الفردية بنجاح' : 'فشل في جلب محادثات الدردشة الفردية'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Get single chat messages
   * @param {number} conversationId - Conversation ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Single chat messages response
   */
  async getSingleChatMessages(conversationId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.chat.single_chat.get_messages,
        params: {
          conversation_id: conversationId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب رسائل الدردشة الفردية بنجاح' : 'فشل في جلب رسائل الدردشة الفردية'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Send single chat message
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Send message response
   */
  async sendSingleChatMessage(messageData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.chat.single_chat.send_message,
        data: messageData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إرسال الرسالة بنجاح' : 'فشل في إرسال الرسالة',
        errors: response.data?.errors
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Mark single chat as seen
   * @param {number} conversationId - Conversation ID
   * @returns {Promise<Object>} Mark seen response
   */
  async markSingleChatAsSeen(conversationId) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.chat.single_chat.seen_chat,
        data: { conversation_id: conversationId }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تمييز المحادثة كمقروءة بنجاح' : 'فشل في تمييز المحادثة كمقروءة'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  // ==================== GROUP CHAT METHODS ====================
  
  /**
   * Get group chat conversations
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Group chat conversations response
   */
  async getGroupChatConversations(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.chat.group_chat.get_conversations,
        params
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب محادثات الدردشة الجماعية بنجاح' : 'فشل في جلب محادثات الدردشة الجماعية'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Get group chat messages
   * @param {number} groupId - Group ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Group chat messages response
   */
  async getGroupChatMessages(groupId, params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.chat.group_chat.get_messages,
        params: {
          group_id: groupId,
          ...params
        }
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم جلب رسائل الدردشة الجماعية بنجاح' : 'فشل في جلب رسائل الدردشة الجماعية'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Send group chat message
   * @param {Object} messageData - Message data
   * @returns {Promise<Object>} Send message response
   */
  async sendGroupChatMessage(messageData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.chat.group_chat.send_message,
        data: messageData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إرسال الرسالة الجماعية بنجاح' : 'فشل في إرسال الرسالة الجماعية',
        errors: response.data?.errors
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Mark group chat as seen
   * @param {number} groupId - Group ID
   * @returns {Promise<Object>} Mark seen response
   */
  async markGroupChatAsSeen(groupId) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.chat.group_chat.seen_chat,
        data: { group_id: groupId }
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم تمييز المجموعة كمقروءة بنجاح' : 'فشل في تمييز المجموعة كمقروءة'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Create new group
   * @param {Object} groupData - Group data
   * @returns {Promise<Object>} Create group response
   */
  async createGroup(groupData) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: API.chat.group_chat.create_group,
        data: groupData
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم إنشاء المجموعة بنجاح' : 'فشل في إنشاء المجموعة',
        errors: response.data?.errors
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  // ==================== SEARCH METHODS ====================
  
  /**
   * Get search results
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results response
   */
  async getSearchResults(searchParams) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: API.chat.search_results,
        params: searchParams
      });

      return {
        success: response.success,
        data: response.data?.data || response.data,
        pagination: response.data?.pagination,
        message: response.success ? 'تم البحث بنجاح' : 'فشل في البحث'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  // ==================== UTILITY METHODS ====================
  
  /**
   * Get chat statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Chat statistics response
   */
  async getChatStatistics(params = {}) {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.chat.single_chat.get_conversations}/statistics`,
        params
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب إحصائيات الدردشة بنجاح' : 'فشل في جلب إحصائيات الدردشة'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Get unread message count
   * @returns {Promise<Object>} Unread count response
   */
  async getUnreadMessageCount() {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${API.chat.single_chat.get_conversations}/unread-count`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم جلب عدد الرسائل غير المقروءة بنجاح' : 'فشل في جلب عدد الرسائل غير المقروءة'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Delete single chat message
   * @param {number} messageId - Message ID
   * @returns {Promise<Object>} Delete message response
   */
  async deleteSingleChatMessage(messageId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.chat.single_chat.get_messages}/${messageId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف الرسالة بنجاح' : 'فشل في حذف الرسالة',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Delete group chat message
   * @param {number} messageId - Message ID
   * @returns {Promise<Object>} Delete message response
   */
  async deleteGroupChatMessage(messageId) {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${API.chat.group_chat.get_messages}/${messageId}`
      });

      return {
        success: response.success,
        message: response.success ? 'تم حذف الرسالة الجماعية بنجاح' : 'فشل في حذف الرسالة الجماعية',
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }

  /**
   * Leave group
   * @param {number} groupId - Group ID
   * @returns {Promise<Object>} Leave group response
   */
  async leaveGroup(groupId) {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: `${API.chat.group_chat.get_conversations}/${groupId}/leave`
      });

      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'تم مغادرة المجموعة بنجاح' : 'فشل في مغادرة المجموعة'
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        error: error.message
      };
    }
  }
}

// Create and export service instance
const chatService = new ChatService();
export default chatService;

// Export individual methods for convenience
export const {
  // Single Chat
  getSingleChatConversations,
  getSingleChatMessages,
  sendSingleChatMessage,
  markSingleChatAsSeen,
  deleteSingleChatMessage,
  
  // Group Chat
  getGroupChatConversations,
  getGroupChatMessages,
  sendGroupChatMessage,
  markGroupChatAsSeen,
  createGroup,
  leaveGroup,
  deleteGroupChatMessage,
  
  // Search & Utility
  getSearchResults,
  getChatStatistics,
  getUnreadMessageCount
} = chatService;
