import { useEffect, useState } from "react";
import { ExchangeRateService } from "../services/currenciesService";

export const useExchangeRate = (fromCurrency: string, toCurrency: string) => {
    const [exchangeRate, setExchangeRate] = useState<number>(1.1);
  
    useEffect(() => {
      const updateRate = async () => {
        try {
          const response = await ExchangeRateService.fetchExchangeRate(fromCurrency, toCurrency);
          setExchangeRate(response.rate);
        } catch (error) {
          console.error("Error fetching exchange rate:", error);
        }
      };
  
      updateRate();
      const interval = setInterval(updateRate, 3000);
      return () => clearInterval(interval);
    }, [fromCurrency, toCurrency]);
  
    return exchangeRate;
  };