import { Edit2, Trash2, Mail, Briefcase, Hash, User, Building2 } from 'lucide-react';

function EmployeeList({ employees, departments, onEdit, onDelete }) {
    const getDepartmentName = (id) => {
        const dept = departments.find(d => d.id === id);
        return dept ? dept.name : 'Unassigned';
    };

    return (
        <div className="card">
            <table>
                <thead>
                    <tr>
                        <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Hash size={14} className="text-muted" /> ID</div></th>
                        <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={14} className="text-muted" /> Name</div></th>
                        <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} className="text-muted" /> Email</div></th>
                        <th><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={14} className="text-muted" /> Role</div></th>
                        <th><div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}><Building2 size={14} className="text-muted" /> Department</div></th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td><span className="badge badge-outline">{emp.id}</span></td>
                            <td style={{ fontWeight: 500 }}>{emp.first_name} {emp.last_name}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{emp.email}</td>
                            <td>{emp.role || '-'}</td>
                            <td>
                                <span className={`badge ${emp.department_id ? 'icon-box-primary' : 'icon-box-danger'}`} style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem' }}>
                                    {getDepartmentName(emp.department_id)}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-sm btn-ghost icon-box-primary"
                                        onClick={() => onEdit(emp)}
                                        title="Edit Employee"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger icon-box-danger"
                                        onClick={() => onDelete(emp.id)}
                                        title="Delete Employee"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {employees.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No employees found. Add some to get started!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeList;
