import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Form, Button, InputGroup } from "react-bootstrap";
import AmountConverter from "../components/AmountConverter";
import { useExchangeRate } from "../hooks/useCurrencies";

const CurrencyConverter: React.FC = () => {
  const fromCurrency = {
    name: "EUR",
    symbol: "€"
  };

  const toCurrency = {
    name: "USD",
    symbol: "$"
  };

  const realExchangeRate = useExchangeRate(fromCurrency.name, toCurrency.name);
  const [fixedExchangeRate, setFixedExchangeRate] = useState<number | null>(null);
  const [tempFixedRate, setTempFixedRate] = useState<string>("");
  const [isFixedRateActive, setIsFixedRateActive] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number>(realExchangeRate);
  const [exchangeRequests, setExchangeRequests] = useState<Array<{
    amount: number;
    fromCurrency: string;
    convertedAmount: number;
    toCurrency: string;
    exchangeRate: number;
    timestamp: string;
    realExchangeRate: number;
    fixedExchangeRate: number | null;
  }>>([]);

  useEffect(() => {
    if (isFixedRateActive && fixedExchangeRate !== null) {
      const variation = Math.abs((realExchangeRate - fixedExchangeRate) / realExchangeRate) * 100;
      if (variation > 2) {
        setIsFixedRateActive(false);
        setFixedExchangeRate(null);
      }
    }
    setExchangeRate(isFixedRateActive && fixedExchangeRate !== null ? fixedExchangeRate : realExchangeRate);
  }, [realExchangeRate, fixedExchangeRate, isFixedRateActive]);

  const applyFixedRate = () => {
    if (tempFixedRate) {
      setFixedExchangeRate(parseFloat(tempFixedRate));
    }
  };

  const handleExchangeRequest = (
    amount: number,
    fromCurrency: string,
    convertedAmount: number,
    toCurrency: string,
    exchangeRate: number
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setExchangeRequests((prevRequests) => [
      { amount, fromCurrency, convertedAmount, toCurrency, exchangeRate, timestamp, fixedExchangeRate, realExchangeRate},
      ...prevRequests.slice(0, 4)
    ]);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center">Convertisseur {fromCurrency.name} / {toCurrency.name}</h3>
              <p className="text-center">Taux Réel: <span className="text-info">{exchangeRate.toFixed(4)}</span></p>
              <Form.Group className="mb-3">
                <Form.Check 
                    type="switch" 
                    label="Activer le taux" 
                    checked={isFixedRateActive} 
                    onChange={() => {
                      setIsFixedRateActive(!isFixedRateActive);
                      if (!isFixedRateActive) {
                        setFixedExchangeRate(null);
                        setTempFixedRate("");
                      }
                    }} 
                  />
                <InputGroup className="mt-1">
                  <Form.Control 
                    type="number"
                    value={tempFixedRate}
                    onChange={(e) => setTempFixedRate(e.target.value)}
                    placeholder="Entrer un taux d'échange"
                    disabled={!isFixedRateActive}
                  />
                  <Button variant="primary" onClick={applyFixedRate} disabled={!isFixedRateActive}>Appliquer</Button>
                </InputGroup>

              </Form.Group>
              <AmountConverter 
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
                fromToExchangeRate={exchangeRate}
                onConvertedValueChanged={handleExchangeRequest}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h4 className="text-center">5 dernières demandes</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Valeur</th>
                    <th>Devise</th>
                    <th>Valeur Calculée</th>
                    <th>Device</th>
                    <th>Taux Appliqué</th>
                    <th>Taux Réel</th>
                    <th>Taux Fixe</th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeRequests.map((request, index) => (
                    <tr key={index}>
                      <td>{request.timestamp}</td>
                      <td>{request.amount}</td>
                      <td>{request.fromCurrency}</td>
                      <td>{request.convertedAmount.toFixed(4)}</td>
                      <td>{request.toCurrency}</td>
                      <td>{request.exchangeRate.toFixed(4)}</td>
                      <td>{request.realExchangeRate.toFixed(4)}</td>
                      <td>{request.fixedExchangeRate ? request.fixedExchangeRate.toFixed(4) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CurrencyConverter;
