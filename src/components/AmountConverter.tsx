import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

interface Currency {
    name: string,
    symbol: string
}

interface AmountConverterProps {
    fromCurrency: Currency,
    toCurrency: Currency,
    fromToExchangeRate: number,
    onConvertedValueChanged: (amount: number, fromCurrency: string, convertedAmount: number, toCurrency: string, exchangeRate: number) => void
}

const AmountConverter: React.FC<AmountConverterProps> = ({fromCurrency, toCurrency, fromToExchangeRate, onConvertedValueChanged}) => {
    const [amount, setAmount] = useState<number>(1);
    const [localFromCurrency, setLocalFromCurrency] = useState(fromCurrency);
    const [localToCurrency, setLocalToCurrency] = useState(toCurrency);
    const [localExchangeRate, setLocalExchangeRate] = useState(fromToExchangeRate);

    const [convertedAmount, setConvertedAmount] = useState<number>(1);
    const [swapped, setSwapped] = useState(false);

    useEffect(() => {
        setLocalExchangeRate(swapped ? 1/fromToExchangeRate : fromToExchangeRate);
    }, [swapped, fromToExchangeRate]);

    useEffect(() => {
        setLocalFromCurrency(swapped ? toCurrency : fromCurrency);
        setLocalToCurrency(swapped ? fromCurrency : toCurrency);
    }, [swapped, fromCurrency, toCurrency]);

    useEffect(() => {
        setConvertedAmount(amount * localExchangeRate);
    }, [amount, localExchangeRate]);

    useEffect(() => {
        setAmount(convertedAmount);
    }, [swapped]);

    useEffect(() => {
        onConvertedValueChanged(
            amount, 
            localFromCurrency.name,
            convertedAmount, 
            localToCurrency.name,
            localExchangeRate);
    }, [convertedAmount]);

    const switchCurrencies = () => {
        setSwapped(prev => !prev);
    }

    return <Form>
            <Row>
            <Col>
                <Form.Group className="mb-3">
                <Form.Label>{localFromCurrency.name}</Form.Label>
                <InputGroup>
                    <InputGroup.Text>{localFromCurrency.symbol}</InputGroup.Text>
                    <Form.Control 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(parseFloat(e.target.value))} 
                    />
                </InputGroup>
                </Form.Group>
            </Col>

            <Col className="d-flex align-items-center justify-content-center">
                <Button variant="secondary" onClick={switchCurrencies}>
                ⇄
                </Button>
            </Col>

            <Col>
                <Form.Group className="mb-3">
                <Form.Label>{localToCurrency.name}</Form.Label>
                    <InputGroup>
                        <InputGroup.Text>{localToCurrency.symbol}</InputGroup.Text>
                        <Form.Control type="string" value={convertedAmount.toFixed(4)} readOnly />
                    </InputGroup>                    
                </Form.Group>
            </Col>
            </Row>
        </Form>
}

export default AmountConverter;