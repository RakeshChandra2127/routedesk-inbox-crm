import { Message } from '../models/message.model';

export const webhookService = {
  normalizeWhatsAppMessage(payload: any) {
    try {
      const entry = payload.entry?.[0];
      const change = entry?.changes?.[0]?.value;
      if (!change || !change.messages || change.messages.length === 0) return null;

      const msg = change.messages[0];
      const contact = change.contacts?.[0];
      const contactPhone = msg.from;
      const contactName = contact?.profile?.name || contactPhone;
      
      const normalized: any = {
        channel: 'whatsapp',
        contactPhone,
        contactName,
        externalId: msg.id,
        timestamp: new Date(parseInt(msg.timestamp) * 1000),
        message: {
          type: msg.type
        }
      };

      if (msg.type === 'text') {
        normalized.message.content = { text: msg.text.body };
      } else if (['image', 'document', 'audio', 'video'].includes(msg.type)) {
        normalized.message.content = { 
          mediaUrl: msg[msg.type].id,
          caption: msg[msg.type].caption
        };
      } else if (msg.type === 'location') {
        normalized.message.content = {
          latitude: msg.location.latitude,
          longitude: msg.location.longitude,
        };
      }

      return normalized;
    } catch (error) {
      return null;
    }
  },

  normalizeEmailMessage(payload: any) {
    // SendGrid inbound parse payload
    return {
      channel: 'email',
      contactEmail: payload.from,
      contactName: payload.from, // simplified
      subject: payload.subject,
      externalId: payload.headers?.['message-id'] || Date.now().toString(),
      timestamp: new Date(),
      message: {
        type: 'text',
        content: {
          text: payload.text,
          html: payload.html,
          subject: payload.subject
        }
      }
    };
  },

  async isDuplicate(tenantId: string, externalId: string) {
    const existing = await Message.exists({ tenantId, externalId });
    return !!existing;
  }
};
