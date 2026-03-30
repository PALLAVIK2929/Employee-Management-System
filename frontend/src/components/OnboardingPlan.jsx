import React, { useState } from 'react';
import { api } from '../api';

function OnboardingPlan({ employee, onClose }) {
    const [skills, setSkills] = useState('');
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!skills.trim()) return;

        setIsLoading(true);
        try {
            const skillsList = skills.split(',').map(s => s.trim());
            const data = await api.generateOnboardingPlan(employee.role || 'New Hire', skillsList);
            setPlan(data);
        } catch (error) {
            alert('Error generating plan: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content card" style={{ maxWidth: '700px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>30-60-90 Plan for {employee.first_name} {employee.last_name}</h3>
                    <button className="btn btn-ghost" onClick={onClose} style={{ padding: '0.2rem 0.5rem' }}>&times;</button>
                </div>

                {!plan ? (
                    <form onSubmit={handleGenerate}>
                        <div className="form-group">
                            <label>Role</label>
                            <input value={employee.role || 'New Hire'} disabled />
                        </div>
                        <div className="form-group">
                            <label>Key Skills (comma separated)</label>
                            <textarea
                                required
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                placeholder="e.g. React, Python, Project Management"
                                style={{ minHeight: '100px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', justifyContent: 'center' }}>
                            {isLoading ? 'Generating Plan...' : 'Generate AI Onboarding Plan'}
                        </button>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem' }}>{plan.plan_30}</pre>
                        </div>
                        <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem' }}>{plan.plan_60}</pre>
                        </div>
                        <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem' }}>{plan.plan_90}</pre>
                        </div>
                        <button className="btn btn-ghost" onClick={() => setPlan(null)} style={{ width: '100%', justifyContent: 'center' }}>
                            Back to Edit Skills
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OnboardingPlan;
