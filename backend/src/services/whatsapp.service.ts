import axios from 'axios';
import { config } from '../config';

export const whatsappService = {
  async sendMessage(tenantId: string, to: string, content: any, phoneNumberId: string, token: string) {
    const url = `${config.whatsapp.apiUrl}/${phoneNumberId}/messages`;
    
    let messageData: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
    };

    if (content.text) {
      messageData.type = 'text';
      messageData.text = { body: content.text };
    }

    try {
      const response = await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async sendTemplate(tenantId: string, to: string, templateName: string, params: any, phoneNumberId: string, token: string) {
    // Implement template sending
    return {};
  },

  async markAsRead(tenantId: string, messageId: string, phoneNumberId: string, token: string) {
    const url = `${config.whatsapp.apiUrl}/${phoneNumberId}/messages`;
    await axios.post(url, {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
