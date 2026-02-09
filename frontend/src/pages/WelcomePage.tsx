/**
 * Welcome Page
 * Customer registration or redirect to queue if already registered
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../context';
import { generateCustomerId } from '../utils/localStorage';
import { Layout, Card, Input, Button, LoadingSpinner, toast } from '../components';

export const WelcomePage = () => {
    const navigate = useNavigate();
    const { customer, setCustomer, isLoading } = useCustomer();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({ name: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if customer already exists
    useEffect(() => {
        if (!isLoading && customer) {
            navigate('/queue');
        }
    }, [customer, isLoading, navigate]);

    const validateInputs = (): boolean => {
        const newErrors = { name: '', phone: '' };
        let isValid = true;

        // Name validation - trim whitespace
        const trimmedName = name.trim();
        if (!trimmedName) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (trimmedName.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
        } else if (trimmedName.length > 50) {
            newErrors.name = 'Name must be less than 50 characters';
            isValid = false;
        }

        // Phone validation - basic numeric check
        const trimmedPhone = phone.trim();
        if (!trimmedPhone) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(trimmedPhone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate customer ID and save
            const customerId = generateCustomerId();
            setCustomer(customerId, name.trim(), phone.trim());

            toast.success('Welcome! Redirecting to queue...');
            navigate('/queue');
        } catch (error) {
            toast.error('Failed to save your information. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Layout title="Welcome">
                <div className="flex justify-center items-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Welcome">
            <div className="max-w-md mx-auto">
                <Card>
                    <h2 className="text-2xl font-bold mb-2">Welcome to Barbershop Queue</h2>
                    <p className="text-gray-600 mb-6">
                        Please enter your details to join the queue
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Name"
                            type="text"
                            value={name}
                            onChange={setName}
                            placeholder="Enter your name"
                            required
                            error={errors.name}
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            value={phone}
                            onChange={setPhone}
                            placeholder="Enter your phone number"
                            required
                            error={errors.phone}
                        />

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Continue'}
                        </Button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};
