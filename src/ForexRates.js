import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const API_KEY = '9sOx2d1gWYZrKY0uD4hCbOMIQzLcL4KQ';
const API_URL = 'https://api.apilayer.com/fixer/latest';

const fetchForexRates = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                apikey: API_KEY
            }
        });
        
        if (response.data.success) {
            return {
                data: response.data,
                error: null
            };
        }
        
        return {
            data: null,
            error: 'Failed to fetch forex rates'
        };
    } catch (error) {
        console.error('Error fetching forex rates:', error);
        return {
            data: null,
            error: 'Error fetching forex rates. Please try again later.'
        };
    }
};

const isEven = (number) => {
    return number % 2 === 0;
};

const addValueToRates = (rates, valueToAdd) => {
    const newRates = {};
    for (const currency in rates) {
        newRates[currency] = rates[currency] + valueToAdd;
    }
    return newRates;
};

const ForexRates = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [originalRates, setOriginalRates] = useState({});
    const [modifiedRates, setModifiedRates] = useState({});

    useEffect(() => {
        const loadRates = async () => {
            const { data, error } = await fetchForexRates();
            setLoading(false);
            if (error) {
                setError(error);
            } else {
                setOriginalRates(data.rates);
                setModifiedRates(addValueToRates(data.rates, 10.0002));
            }
        };
        loadRates();
    }, []);

    if (loading) return <div id="loading">Loading...</div>;
    if (error) return <div id="error" style={{ color: 'red' }}>Error loading forex rates. Please try again later.</div>;

    return (
        <table id="ratesTable" border="1">
            <thead>
                <tr>
                    <th>Currency</th>
                    <th>Original Value</th>
                    <th>Modified Value</th>
                </tr>
            </thead>
            <tbody id="forex-table-body">
                {Object.entries(originalRates).map(([currency, rate]) => (
                    <tr key={currency}>
                        <td className="border p-2 font-medium">{currency}</td>
                        <td className={`border p-2 ${currency === 'HKD' || isEven(rate) ? 'border-red-500' : ''}`}>
                            {rate.toFixed(4)}
                        </td>
                        <td className={`border p-2 ${currency === 'HKD' || isEven(modifiedRates[currency]) ? 'border-red-500' : ''}`}>
                            {modifiedRates[currency].toFixed(4)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ForexRates;
