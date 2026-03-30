import React, { useState } from 'react';
import { Building2, Plus, Hash, LayoutGrid, Pencil, Trash2, Search } from 'lucide-react';
import { api } from '../api';

function DepartmentManager({ departments, onRefresh, onEditDept }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department? Employees in this department will be unassigned.')) {
            try {
                await api.deleteDepartment(id);
                onRefresh();
            } catch (error) {
                alert('Error deleting department: ' + error.message);
            }
        }
    };

    const startEdit = (dept) => {
        setEditingId(dept.id);
        setEditName(dept.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) return;
        try {
            await api.updateDepartment(id, { name: editName });
            setEditingId(null);
            onRefresh();
        } catch (error) {
            alert('Error updating department: ' + error.message);
        }
    };

    const filteredDepartments = departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Department List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-header-bg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <LayoutGrid size={18} className="text-accent" />
                        Organization Chart
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search departments..." 
                            className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-xs w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider w-20 text-center">ID</th>
                                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider">Department Name</th>
                                <th className="p-4 text-xs font-semibold text-muted uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDepartments.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-12 text-center text-muted italic">
                                        No departments found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredDepartments.map(dept => (
                                    <tr key={dept.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-xs font-bold text-muted border border-gray-100">
                                                {dept.id}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-primary group-hover:text-accent transition-colors">
                                                {dept.name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => onEditDept(dept)}
                                                    className="p-2 text-muted hover:text-accent hover:bg-accent-light rounded-lg transition-all"
                                                    title="Edit Department"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(dept.id)}
                                                    className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Department"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DepartmentManager;
