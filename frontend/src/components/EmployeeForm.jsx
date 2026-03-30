import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { Upload } from 'lucide-react';

function EmployeeForm({ employee, departments, onClose, onSave }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        department_id: '',
    });

    useEffect(() => {
        if (employee) {
            setFormData({
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                role: employee.role || '',
                department_id: employee.department_id || '',
            });
        }
    }, [employee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                department_id: formData.department_id ? parseInt(formData.department_id) : null,
            };
            if (employee) {
                await api.updateEmployee(employee.id, payload);
            } else {
                await api.createEmployee(payload);
            }
            onSave();
        } catch (error) {
            alert('Error saving employee: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content card">
                <h3>{employee ? 'Edit Employee' : 'Add Employee'}</h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                id="first_name"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                id="last_name"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <input
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select
                            id="department"
                            value={formData.department_id}
                            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
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

export default EmployeeForm;
