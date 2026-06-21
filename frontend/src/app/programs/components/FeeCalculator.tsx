'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FeeStructure {
    program: string;
    monthlyFee: number;
    registrationFee: number;
    studyMaterialFee: number;
}

interface FeeCalculatorProps {
    feeStructures: FeeStructure[];
}

export default function FeeCalculator({ feeStructures }: FeeCalculatorProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<string>('');
    const [duration, setDuration] = useState<number>(12);
    const [paymentPlan, setPaymentPlan] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

    useEffect(() => {
        setIsHydrated(true);
        if (feeStructures.length > 0) {
            setSelectedProgram(feeStructures[0].program);
        }
    }, [feeStructures]);

    if (!isHydrated) {
        return (
            <div className="bg-card rounded-xl shadow-subtle border border-border p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-surface rounded w-1/3"></div>
                    <div className="h-4 bg-surface rounded w-2/3"></div>
                    <div className="h-32 bg-surface rounded"></div>
                </div>
            </div>
        );
    }

    const selectedFee = feeStructures.find(f => f.program === selectedProgram);

    if (!selectedFee) return null;

    const calculateTotal = () => {
        const monthlyTotal = selectedFee.monthlyFee * duration;
        const oneTimeFees = selectedFee.registrationFee + selectedFee.studyMaterialFee;
        const subtotal = monthlyTotal + oneTimeFees;

        let discount = 0;
        if (paymentPlan === 'quarterly') discount = subtotal * 0.05;
        if (paymentPlan === 'annual') discount = subtotal * 0.10;

        return {
            monthlyTotal,
            oneTimeFees,
            subtotal,
            discount,
            total: subtotal - discount
        };
    };

    const totals = calculateTotal();

    return (
        <div className="bg-card rounded-lg sm:rounded-xl shadow-subtle border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent to-warning p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Fee Calculator</h3>
                <p className="text-white/90 text-xs sm:text-sm">Calculate your investment in excellence</p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Program Selection */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3">Select Program</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {feeStructures.map((fee) => (
                            <button
                                key={fee.program}
                                onClick={() => setSelectedProgram(fee.program)}
                                className={`p-3 sm:p-4 rounded-lg border-2 transition-smooth text-left text-xs sm:text-base ${selectedProgram === fee.program
                                        ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-brand-primary/50'
                                    }`}
                            >
                                <div className="font-semibold text-text-primary">{fee.program}</div>
                                <div className="text-xs sm:text-sm text-text-secondary mt-1">₹{fee.monthlyFee.toLocaleString('en-IN')}/month</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration Slider */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3">
                        Duration: {duration} months
                    </label>
                    <input
                        type="range"
                        min="3"
                        max="24"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-2">
                        <span>3 months</span>
                        <span>24 months</span>
                    </div>
                </div>

                {/* Payment Plan */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3">Payment Plan</label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { value: 'monthly', label: 'Monthly', discount: '0%' },
                            { value: 'quarterly', label: 'Quarterly', discount: '5%' },
                            { value: 'annual', label: 'Annual', discount: '10%' }
                        ].map((plan) => (
                            <button
                                key={plan.value}
                                onClick={() => setPaymentPlan(plan.value as any)}
                                className={`p-2 sm:p-3 rounded-lg border-2 transition-smooth text-xs sm:text-sm ${paymentPlan === plan.value
                                        ? 'border-success bg-success/5' : 'border-border hover:border-success/50'
                                    }`}
                            >
                                <div className="font-semibold text-text-primary">{plan.label}</div>
                                <div className="text-xs text-success mt-0.5">{plan.discount} off</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fee Breakdown */}
                <div className="bg-surface rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-text-secondary">Monthly Fee × {duration} months</span>
                        <span className="font-semibold text-text-primary">₹{totals.monthlyTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-text-secondary">Registration Fee</span>
                        <span className="font-semibold text-text-primary">₹{selectedFee.registrationFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-text-secondary">Study Material</span>
                        <span className="font-semibold text-text-primary">₹{selectedFee.studyMaterialFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-border pt-2 sm:pt-3 flex justify-between text-xs sm:text-sm">
                        <span className="text-text-secondary">Subtotal</span>
                        <span className="font-semibold text-text-primary">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {totals.discount > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-success">Discount ({paymentPlan === 'quarterly' ? '5%' : '10%'})</span>
                            <span className="font-semibold text-success">-₹{totals.discount.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className="border-t-2 border-brand-primary pt-2 sm:pt-3 flex justify-between">
                        <span className="font-bold text-text-primary text-xs sm:text-sm">Total Amount</span>
                        <span className="font-bold text-lg sm:text-2xl text-brand-primary">₹{totals.total.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-cta text-white text-sm sm:text-base font-semibold rounded-lg btn-hover flex items-center justify-center gap-1 sm:gap-2">
                    <Icon name="PhoneIcon" size={16} className="sm:block w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Contact for Enrollment</span>
                    <span className="sm:hidden">Enroll Now</span>
                </button>

                {/* Info Note */}
                <div className="flex items-start gap-2 p-3 sm:p-4 bg-brand-primary/5 rounded-lg">
                    <Icon name="InformationCircleIcon" size={16} className="sm:block w-4 h-4 sm:w-5 sm:h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary">
                        Fees are subject to change. Additional discounts available for siblings and early bird registrations. Contact us for personalized payment plans.
                    </p>
                </div>
            </div>
        </div>
    );
}