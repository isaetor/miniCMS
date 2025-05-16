'use server'

import nodemailer from 'nodemailer';
import { prisma } from "./prisma";
import { generateOTP } from "./utils";

const OTP_EXPIRY_MINUTES = 15;
const OTP_EXPIRY_MS = OTP_EXPIRY_MINUTES * 60 * 1000;
const MAX_EMAIL_ATTEMPTS = 5;
const EMAIL_ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

type EmailResult = {
  success: boolean;
  messageId?: string;
  error?: unknown;
}

type OtpResult = {
  success: boolean;
  error?: unknown;
  existingCode?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const getOtpEmailTemplate = (code: string) => `
  <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">کد تایید شما</h1>
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center;">
      <p style="font-size: 24px; font-weight: bold; color: #2196F3; margin: 20px 0;">${code}</p>
    </div>
    <p style="color: #666; text-align: center;">این کد تا ${OTP_EXPIRY_MINUTES} دقیقه معتبر است.</p>
    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
      این ایمیل به صورت خودکار ارسال شده است. لطفاً به آن پاسخ ندهید.
    </p>
  </div>
`;

export async function sendOtpEmail(email: string, code: string): Promise<EmailResult> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) {
      throw new Error('تنظیمات SMTP ناقص است');
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'کد تایید',
      html: getOtpEmailTemplate(code)
    });

    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'خطا در ارسال ایمیل'
    };
  }
}

export async function initiateOtp(email: string): Promise<OtpResult> {
  try {
    const existingCode = await prisma.otpCode.findFirst({
      where: { 
        email,
        expiresAt: { gt: new Date() }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (existingCode) {
      return { 
        success: true,
        existingCode: existingCode.code
      };
    }

    // Check email sending attempts
    const recentAttempts = await prisma.loginLog.count({
      where: {
        userEmail: email,
        type: "email_send",
        timestamp: {
          gte: new Date(Date.now() - EMAIL_ATTEMPT_WINDOW)
        }
      }
    });

    if (recentAttempts >= MAX_EMAIL_ATTEMPTS) {
      return {
        success: false,
        error: `تعداد درخواست‌های ارسال ایمیل بیش از حد مجاز است. لطفاً ${EMAIL_ATTEMPT_WINDOW / (60 * 60 * 1000)} ساعت دیگر تلاش کنید.`
      };
    }

    await prisma.otpCode.deleteMany({ 
      where: { 
        email,
        expiresAt: { lte: new Date() }
      } 
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

    await prisma.otpCode.create({
      data: { code, email, expiresAt }
    });

    const result = await sendOtpEmail(email, code);

    if (!result.success) {
      await prisma.otpCode.deleteMany({ where: { email, code } });
      throw new Error(result.error as string || 'خطا در ارسال ایمیل');
    }

    // Log successful email send
    await prisma.loginLog.create({
      data: {
        userEmail: email,
        method: "email",
        type: "email_send",
        timestamp: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error initiating OTP:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'خطا در ایجاد کد تایید'
    };
  }
} 