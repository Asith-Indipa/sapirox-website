import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;

// Export resend client instance if API key is provided, otherwise return null
export const resend = resendApiKey ? new Resend(resendApiKey) : null;
