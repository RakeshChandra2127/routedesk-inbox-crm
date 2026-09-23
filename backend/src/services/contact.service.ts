import { Contact } from '../models/contact.model';
import { AppError } from '../utils/app-error';

export const contactService = {
  async findOrCreate(tenantId: string, channel: string, identifier: string, contactData: any) {
    const query: any = { tenantId };
    if (channel === 'whatsapp') query.phone = identifier;
    else if (channel === 'email') query.email = identifier;
    else if (channel === 'web_chat') query.webChatId = identifier;

    let contact = await Contact.findOne(query);

    if (!contact) {
      contact = await Contact.create({
        tenantId,
        ...contactData,
        channelIdentifiers: [{ channel, identifier, verified: false }],
        [channel === 'whatsapp' ? 'phone' : channel === 'email' ? 'email' : 'webChatId']: identifier,
      });
    } else {
      // update last contacted at
      contact.lastContactedAt = new Date();
      await contact.save();
    }

    return contact;
  },

  async findAll(tenantId: string, filters: any, pagination: any) {
    const query = { tenantId, ...filters };
    const contacts = await Contact.find(query)
      .sort({ updatedAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);
    
    const total = await Contact.countDocuments(query);
    return { data: contacts, total, ...pagination };
  },

  async findById(tenantId: string, id: string) {
    const contact = await Contact.findOne({ _id: id, tenantId });
    if (!contact) throw new AppError(404, 'Contact not found', 'NOT_FOUND');
    return contact;
  },

  async update(tenantId: string, id: string, data: any) {
    const contact = await Contact.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
    if (!contact) throw new AppError(404, 'Contact not found', 'NOT_FOUND');
    return contact;
  },

  async convertToLead(tenantId: string, contactId: string, leadStatus: string) {
    return this.update(tenantId, contactId, { leadStatus });
  },

  async search(tenantId: string, query: string) {
    return Contact.find({
      tenantId,
      $text: { $search: query }
    }).limit(20);
  }
};
