import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

type GooglePayButtonProps = {
  onPaymentSuccess: (token: string, email: string) => void;
};

export default function GooglePayButton({ onPaymentSuccess }: GooglePayButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.google || !buttonRef.current) return;

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST',
    });

    const paymentRequest: any = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              gatewayMerchantId: 'acct_1RYHSLGh3sTxp5WK',
            },
          },
        },
      ],
      merchantInfo: {
        merchantName: 'HeistLine',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '10.00',
        currencyCode: 'USD',
      },
    };

    const button = paymentsClient.createButton({
      onClick: () => {
        paymentsClient
          .loadPaymentData(paymentRequest)
          .then((paymentData: any) => {
            const token = paymentData.paymentMethodData.tokenizationData.token;
            const email =
              paymentData.email || prompt('Enter your email to receive your access code:') || '';
            if (token && email) {
              onPaymentSuccess(token, email);
            }
          })
          .catch(console.error);
      },
    });

    buttonRef.current.appendChild(button);
  }, [onPaymentSuccess]);

  return <div ref={buttonRef}></div>;
}
