import React, { useState, useRef } from 'react';
import { api } from '../api';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Download, ArrowRight } from 'lucide-react';

function BulkUpload({ onUploadSuccess }) {
    const [bulkData, setBulkData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setStatus({ type: 'error', message: 'Please upload a valid CSV file.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setBulkData(event.target.result);
            setStatus({ type: 'success', message: 'File imported successfully. Review the data below.' });
        };
        reader.readAsText(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!bulkData.trim() || isLoading) return;

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const lines = bulkData.trim().split('\n');
            const employees = [];

            for (const line of lines) {
                const parts = line.split(',').map(s => s.trim());
                if (parts.length < 3) continue; // Skip lines with too few columns

                const [firstName, lastName, email, role] = parts;

                // Skip header rows if present
                const isHeader = firstName.toLowerCase() === 'first_name' ||
                    email.toLowerCase() === 'email' ||
                    firstName.toLowerCase() === 'first name';

                if (isHeader) continue;
                if (!email.includes('@')) continue; // Very basic validation to skip malformed data

                employees.push({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    role: role || 'Employee'
                });
            }

            if (employees.length === 0) {
                throw new Error('No valid employee data found in the input.');
            }

            await api.bulkCreateEmployees(employees);
            setStatus({
                type: 'success',
                message: `Successfully uploaded ${employees.length} employees! You can view them in the Employee Directory.`
            });
            setBulkData('');
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error('Bulk upload error:', error);
            setStatus({
                type: 'error',
                message: error.message || 'An unexpected error occurred during upload.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = "first_name, last_name, email, role\nJohn, Doe, john@example.com, Developer\nJane, Smith, jane@example.com, Manager";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Bulk Employee Upload</h1>
                <p className="text-muted">Import multiple employees at once using a CSV file or manual entry.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Upload card */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Upload size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Upload CSV File</h2>
                    </div>

                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--accent-color)] hover:bg-[var(--input-bg)] transition-all group"
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept=".csv" 
                            className="hidden" 
                        />
                        <div className="mx-auto w-12 h-12 bg-[var(--input-bg)] rounded-full flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors mb-4">
                            <FileText size={24} />
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">Click to upload or drag and drop</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">CSV files only (max 10MB)</p>
                    </div>

                    <button 
                        onClick={downloadTemplate}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[var(--accent-color)] bg-transparent border-2 border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white rounded-xl transition-all"
                    >
                        <Download size={18} />
                        Download CSV Template
                    </button>
                </div>

                {/* Right side: Information/Instructions card */}
                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                            <Sparkles size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Import Tips</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            "Your CSV should have columns: first_name, last_name, email, role.",
                            "The email must be unique for each employee.",
                            "Avoid empty rows and make sure the data is properly formatted.",
                            "You can always edit employee details after the import."
                        ].map((tip, i) => (
                            <div key={i} className="flex gap-3">
                                <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]"></div>
                                <p className="text-sm text-[var(--text-secondary)]">{tip}</p>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl flex gap-3 text-yellow-800 dark:text-yellow-400">
                            <AlertCircle className="flex-shrink-0" size={18} />
                            <p className="text-xs leading-relaxed">
                                <strong>Warning:</strong> Bulk upload will create new employee records. Existing records with the same email will be skipped to prevent duplicates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Entry / Data Review area */}
            <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <FileText size={20} className="text-[var(--accent-color)]" />
                        CSV Data Preview
                    </h2>
                    {status.message && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {status.message}
                        </div>
                    )}
                </div>

                <textarea
                    className="w-full h-48 p-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] text-sm font-mono"
                    placeholder="first_name, last_name, email, role&#10;John, Doe, john@example.com, Developer"
                    value={bulkData}
                    onChange={(e) => setBulkData(e.target.value)}
                ></textarea>

                <div className="flex justify-end">
                    <button 
                        onClick={handleUpload}
                        disabled={!bulkData.trim() || isLoading}
                        className={`px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                            !bulkData.trim() || isLoading 
                            ? 'bg-[var(--input-bg)] text-[var(--text-secondary)] cursor-not-allowed'
                            : 'bg-[var(--accent-color)] text-white hover:bg-opacity-90 shadow-lg'
                        }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Upload size={18} />
                        )}
                        Process Import
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BulkUpload;
