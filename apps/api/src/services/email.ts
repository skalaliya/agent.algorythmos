import nodemailer from 'nodemailer';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'mailhog',
      port: parseInt(process.env.MAIL_PORT || '1025'),
      secure: false,
      auth: {
        user: process.env.MAIL_USER || '',
        pass: process.env.MAIL_PASS || ''
      }
    });
  }

  async sendEmail(data: EmailData): Promise<{ success: boolean; messageId: string }> {
    try {
      const mailOptions = {
        from: process.env.MAIL_FROM || 'Relay Clone <noreply@local.dev>',
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text || this.htmlToText(data.html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      // Verify connection configuration
      await this.transporter.verify();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      };
    }
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }
}
