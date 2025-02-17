
export class ExchangeRateService {
    static async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<{ rate: number }> {
      return new Promise<{ rate: number }>((resolve) => {
        setTimeout(() => {
          const variation = (Math.random() * 0.1 - 0.05);
          resolve({ rate: parseFloat((1.1 + variation).toFixed(4)) });
        }, 500);
      });
    }
  }