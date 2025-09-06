import { WorkflowStep } from './workflow';
import nodemailer from 'nodemailer';

export class EmailRunner {
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

  async execute(step: WorkflowStep, context: Record<string, any>) {
    const { to, subject, html, text } = step.input || {};
    
    if (!to || !subject || !html) {
      throw new Error('Email step requires to, subject, and html');
    }

    // Resolve template variables
    const resolvedTo = this.resolveTemplate(to, context);
    const resolvedSubject = this.resolveTemplate(subject, context);
    const resolvedHtml = this.resolveTemplate(html, context);
    const resolvedText = text ? this.resolveTemplate(text, context) : undefined;

    try {
      const mailOptions = {
        from: process.env.MAIL_FROM || 'Algorythmos AI Agents <noreply@local.dev>',
        to: resolvedTo,
        subject: resolvedSubject,
        html: resolvedHtml,
        text: resolvedText || this.htmlToText(resolvedHtml)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        output: {
          messageId: info.messageId,
          to: resolvedTo,
          subject: resolvedSubject,
          sent: true
        },
        credits: 0
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
  }

  private resolveTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      const value = this.getNestedValue(context, variable.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
