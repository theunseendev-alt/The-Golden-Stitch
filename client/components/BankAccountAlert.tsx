import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";

interface BankAccountAlertProps {
  userId: string;
}

export default function BankAccountAlert({ userId }: BankAccountAlertProps) {
  const [chargesEnabled, setChargesEnabled] = useState<boolean | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    const checkAccountStatus = async () => {
      try {
        const response = await apiService.checkStripeAccountStatus();
        setChargesEnabled(response.chargesEnabled);
        setAccountId(response.accountId || null);
      } catch (error) {
        console.error('Error checking account status:', error);
        // Default to not connected if error
        setChargesEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccountStatus();
  }, [userId]);

  const handleSetUpBankAccount = async () => {
    if (!accountId) {
      alert('Account ID not found. Please contact support.');
      return;
    }

    setSettingUp(true);
    try {
      const response = await apiService.createAccountLink(accountId);
      window.location.href = response.url;
    } catch (error) {
      console.error('Error creating account link:', error);
      alert('Failed to set up bank account. Please try again.');
    } finally {
      setSettingUp(false);
    }
  };

  if (loading || chargesEnabled === true) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 mb-6">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">Bank Account Required</AlertTitle>
      <AlertDescription className="text-orange-700 mt-2">
        <p className="mb-3">
          You must connect your bank account to receive payments. Please complete your profile setup.
        </p>
        <Button
          onClick={handleSetUpBankAccount}
          disabled={settingUp}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {settingUp ? 'Setting Up...' : 'Set Up Bank Account'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}