import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (email: string, otp: string) => void;
  entityType: string;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onVerify,
  entityType
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    setIsSendingOtp(true);
    setError('');

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
    } catch (err) {
      setError('ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('กรุณากรอก OTP ให้ครบ 6 หลัก');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Simulate API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      onVerify(email, otp);
    } catch (err) {
      setError('OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    setError('');

    try {
      // Simulate API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('ส่ง OTP ใหม่แล้ว');
    } catch (err) {
      setError('ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' 
              ? `สร้าง${entityType}ใหม่` 
              : `ยืนยันตัวตนสำหรับ${entityType}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  อีเมลของคุณ
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  เราจะส่งรหัส OTP ไปยังอีเมลนี้เพื่อยืนยันตัวตนของคุณ
                </p>
              </div>

              <Button 
                onClick={handleSendOtp} 
                disabled={isSendingOtp}
                className="w-full"
              >
                {isSendingOtp ? 'กำลังส่ง OTP...' : 'ส่ง OTP'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  รหัส OTP
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="กรอกรหัส OTP 6 หลัก"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="pl-10"
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  รหัส OTP ถูกส่งไปยัง {email}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleVerifyOtp} 
                  disabled={isVerifying}
                  className="flex-1"
                >
                  {isVerifying ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleResendOtp}
                  disabled={isSendingOtp}
                >
                  ส่งใหม่
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};