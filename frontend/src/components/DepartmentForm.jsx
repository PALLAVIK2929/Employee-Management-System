import React, { useState, useEffect } from 'react';
import { api } from '../api';

function DepartmentForm({ department, onClose, onSave }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (department) {
            setName(department.name);
        }
    }, [department]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            if (department) {
                await api.updateDepartment(department.id, { name });
            } else {
                await api.createDepartment({ name });
            }
            onSave();
        } catch (error) {
            alert('Error saving department: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content card">
                <h3>{department ? 'Edit Department' : 'Add Department'}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="dept_name">Department Name</label>
                        <input
                            id="dept_name"
                            required
                            placeholder="e.g. Engineering, Marketing..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DepartmentForm;
