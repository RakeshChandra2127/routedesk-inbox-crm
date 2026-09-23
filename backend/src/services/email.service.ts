export const emailService = {
  async sendReply(tenantId: string, to: string, subject: string, htmlBody: string, inReplyTo?: string) {
    // Mock SendGrid Implementation
    console.log(`Sending email to ${to} with subject ${subject}`);
    return { messageId: Date.now().toString() };
  }
};
