// services/ChatService.js
import globalConstants from '../config/globalConstants';

class ChatService {
  constructor(token) {
    this.token = token;
    this.baseURL = globalConstants.baseURL;
  }

  // ========== Single Chat ==========
  
  async getSingleChats(page = 1) {
    const response = await fetch(
      `${this.baseURL}${globalConstants.single_chat.get_conv}?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  }

  async getSingleChatMessages(chatId, page = 1) {
    const response = await fetch(
      `${this.baseURL}${globalConstants.single_chat.get_messages}?chat_id=${chatId}&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  }

  async sendSingleMessage(receiverId, text, latitude = "0", longitude = "0", imageUri = null) {
    if (imageUri) {
      return this.sendSingleMessageWithImage(receiverId, text, imageUri, latitude, longitude);
    }

    const response = await fetch(
      `${this.baseURL}${globalConstants.single_chat.send_message}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          text: text,
          latitude: latitude || "0",
          longitude: longitude || "0"
        })
      }
    );
    return await response.json();
  }

  async sendSingleMessageWithImage(receiverId, text, imageUri, latitude = "0", longitude = "0") {
    const formData = new FormData();
    formData.append('receiver_id', receiverId);
    formData.append('text', text);
    formData.append('latitude', latitude || "0");
    formData.append('longitude', longitude || "0");
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'chat_image.jpg'
    });

    const response = await fetch(
      `${this.baseURL}${globalConstants.single_chat.send_message}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      }
    );
    return await response.json();
  }

  async markChatAsSeen(chatId) {
    const response = await fetch(
      `${this.baseURL}${globalConstants.single_chat.mark_seen}?chat_id=${chatId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  }

  // ========== Group Chat ==========

  async getGroupChats(page = 1) {
    const response = await fetch(
      `${this.baseURL}${globalConstants.group_chat.get_conv}?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  }

  async getGroupMessages(groupId, page = 1) {
    const response = await fetch(
      `${this.baseURL}${globalConstants.group_chat.get_messages}?group_id=${groupId}&page=${page}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  }

  async sendGroupMessage(groupId, text, latitude = "0", longitude = "0", imageUri = null) {
    if (imageUri) {
      return this.sendGroupMessageWithImage(groupId, text, imageUri, latitude, longitude);
    }

    const response = await fetch(
      `${this.baseURL}${globalConstants.group_chat.send_message}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_id: groupId,
          text: text,
          latitude: latitude || "0",
          longitude: longitude || "0"
        })
      }
    );
    return await response.json();
  }

  async sendGroupMessageWithImage(groupId, text, imageUri, latitude = "0", longitude = "0") {
    const formData = new FormData();
    formData.append('receiver_id', groupId);
    formData.append('text', text);
    formData.append('latitude', latitude || "0");
    formData.append('longitude', longitude || "0");
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'group_image.jpg'
    });

    const response = await fetch(
      `${this.baseURL}${globalConstants.group_chat.send_message}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      }
    );
    return await response.json();
  }

  async markGroupAsSeen(groupId) {
    const response = await fetch(
      `${this.baseURL}${globalConstants.group_chat.mark_seen}?group_id=${groupId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  }

  async createGroup(groupName, memberIds, avatarUri = null, description = "") {
    const formData = new FormData();
    formData.append('name', groupName);
    formData.append('description', description);
    
    memberIds.forEach((memberId, index) => {
      formData.append(`members[${index}]`, memberId);
    });
    
    if (avatarUri) {
      formData.append('avatar', {
        uri: avatarUri,
        type: 'image/jpeg',
        name: 'group_avatar.jpg'
      });
    }

    const response = await fetch(
      `${this.baseURL}${globalConstants.group_chat.create_group}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      }
    );
    return await response.json();
  }

  // ========== Search ==========

  async searchUsers(username = "") {
    const params = username ? `?username=${username}` : '';
    const response = await fetch(
      `${this.baseURL}${globalConstants.get_user_to_chat}${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  }
}

export default ChatService;
