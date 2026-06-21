'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ComparisonItem {
    program: string;
    ageGroup: string;
    batchSize: string;
    duration: string;
    subjects: number;
    weeklyClasses: number;
    testSeries: boolean;
    doubtClearing: boolean;
    studyMaterial: boolean;
    parentMeeting: boolean;
}

interface ComparisonMatrixProps {
    programs: ComparisonItem[];
}

export default function ComparisonMatrix({ programs }: ComparisonMatrixProps) {
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>([programs[0].program, programs[1].program]);

    const toggleProgram = (program: string) => {
        if (selectedPrograms.includes(program)) {
            if (selectedPrograms.length > 1) {
                setSelectedPrograms(selectedPrograms.filter(p => p !== program));
            }
        } else {
            if (selectedPrograms.length < 3) {
                setSelectedPrograms([...selectedPrograms, program]);
            }
        }
    };

    const filteredPrograms = programs.filter(p => selectedPrograms.includes(p.program));

    return (
        <div className="bg-card rounded-xl shadow-subtle border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Program Comparison Matrix</h3>
                <p className="text-white/90 text-sm">Compare features across different programs (Select up to 3)</p>
            </div>

            {/* Program Selector */}
            <div className="p-6 border-b border-border">
                <div className="flex flex-wrap gap-3">
                    {programs.map((program) => (
                        <button
                            key={program.program}
                            onClick={() => toggleProgram(program.program)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-smooth ${selectedPrograms.includes(program.program)
                                    ? 'bg-brand-primary text-white' : 'bg-surface text-text-secondary hover:bg-brand-primary/10'
                                }`}
                        >
                            {program.program}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-surface">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Feature</th>
                            {filteredPrograms.map((program) => (
                                <th key={program.program} className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                                    {program.program}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr>
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Age Group</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center text-sm text-text-primary">
                                    {program.ageGroup}
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-surface/50">
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Batch Size</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center text-sm text-text-primary">
                                    {program.batchSize}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Duration</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center text-sm text-text-primary">
                                    {program.duration}
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-surface/50">
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Subjects Covered</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center text-sm text-text-primary">
                                    {program.subjects}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Weekly Classes</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center text-sm text-text-primary">
                                    {program.weeklyClasses}
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-surface/50">
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Test Series</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center">
                                    {program.testSeries ? (
                                        <Icon name="CheckCircleIcon" size={20} className="text-success mx-auto" />
                                    ) : (
                                        <Icon name="XCircleIcon" size={20} className="text-error mx-auto" />
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Doubt Clearing Sessions</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center">
                                    {program.doubtClearing ? (
                                        <Icon name="CheckCircleIcon" size={20} className="text-success mx-auto" />
                                    ) : (
                                        <Icon name="XCircleIcon" size={20} className="text-error mx-auto" />
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-surface/50">
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Study Material</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center">
                                    {program.studyMaterial ? (
                                        <Icon name="CheckCircleIcon" size={20} className="text-success mx-auto" />
                                    ) : (
                                        <Icon name="XCircleIcon" size={20} className="text-error mx-auto" />
                                    )}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="px-6 py-4 text-sm font-medium text-text-secondary">Parent-Teacher Meetings</td>
                            {filteredPrograms.map((program) => (
                                <td key={program.program} className="px-6 py-4 text-center">
                                    {program.parentMeeting ? (
                                        <Icon name="CheckCircleIcon" size={20} className="text-success mx-auto" />
                                    ) : (
                                        <Icon name="XCircleIcon" size={20} className="text-error mx-auto" />
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}