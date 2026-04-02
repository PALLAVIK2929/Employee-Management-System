import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Play, Box, ChevronRight, AlertCircle, CheckCircle2, Search, Database, Table as TableIcon, Loader2, Code } from 'lucide-react';

const RenderResults = ({ data }) => {
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'json'

    if (!data) return null;

    const isArrayOfObjects = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
    const isSingleObject = !Array.isArray(data) && typeof data === 'object' && data !== null;

    const renderTable = () => {
        if (!isArrayOfObjects) return renderJson();
        
        const headers = Object.keys(data[0]);
        
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            {headers.map(header => (
                                <th key={header} className="p-3 text-[10px] font-bold text-muted uppercase tracking-widest">
                                    {header.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                {headers.map(header => (
                                    <td key={header} className="p-3 text-sm text-primary font-medium">
                                        {typeof row[header] === 'object' ? JSON.stringify(row[header]) : String(row[header])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderSingleObject = () => {
        const keys = Object.keys(data);
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keys.map(key => (
                    <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-primary font-semibold">
                            {typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key])}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    const renderJson = () => (
        <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
            <pre className="text-xs font-mono text-green-400">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <button 
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        viewMode === 'table' ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-1.5">
                        <TableIcon size={12} /> Visual
                    </div>
                </button>
                <button 
                    onClick={() => setViewMode('json')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        viewMode === 'json' ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-1.5">
                        <Code size={12} /> JSON
                    </div>
                </button>
            </div>

            <div className="animate-in fade-in duration-300">
                {viewMode === 'json' ? renderJson() : (isArrayOfObjects ? renderTable() : (isSingleObject ? renderSingleObject() : renderJson()))}
            </div>
        </div>
    );
};

const PlatformTools = () => {
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [toolArgs, setToolArgs] = useState({});
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const data = await api.listMcpTools();
            setTools(data || []);
            if (data?.length > 0 && !selectedTool) {
                handleSelectTool(data[0]);
            }
        } catch (error) {
            console.error(`Error fetching tools: ${error.message}`);
        }
    };

    const handleSelectTool = (tool) => {
        setSelectedTool(tool);
        setResults(null);
        const initialArgs = {};
        if (tool.inputSchema?.properties) {
            Object.keys(tool.inputSchema.properties).forEach(key => {
                initialArgs[key] = '';
            });
        }
        setToolArgs(initialArgs);
    };

    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
    };

    const handleArgChange = (key, value) => {
        setToolArgs(prev => ({ ...prev, [key]: value }));
    };

    const handleExecute = async (e) => {
        if (e) e.preventDefault();
        if (!selectedTool || isLoading) return;

        setIsLoading(true);
        setResults(null);

        try {
            const processedArgs = {};
            Object.keys(toolArgs).forEach(key => {
                const schema = selectedTool.inputSchema.properties[key];
                const val = toolArgs[key];

                if (val === '' && !selectedTool.inputSchema.required?.includes(key)) {
                    return;
                }

                if (schema.type === 'integer' || schema.type === 'number') {
                    processedArgs[key] = Number(val);
                } else if (schema.type === 'boolean') {
                    processedArgs[key] = val === 'true' || val === true;
                } else {
                    processedArgs[key] = val;
                }
            });

            const response = await api.callMcpTool(selectedTool.name, processedArgs);

            if (response.content && response.content.length > 0) {
                const allResults = [];
                response.content.forEach(contentStr => {
                    try {
                        const parsed = JSON.parse(contentStr);
                        if (Array.isArray(parsed)) {
                            allResults.push(...parsed);
                        } else {
                            allResults.push(parsed);
                        }
                    } catch (e) {
                        allResults.push(contentStr);
                    }
                });
                setResults(allResults);
                showToast(`Success: ${selectedTool.name} executed`);
            }
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTools = tools.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {toast.visible && (
                <div className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 duration-300 ${
                    toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Platform Tools</h1>
                <p className="text-muted">Access and execute system management tools through the MCP interface.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tools Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)]">
                        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--input-bg)]">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-3 text-[var(--text-secondary)]" />
                                <input
                                    type="text"
                                    placeholder="Search tools..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] text-sm shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {filteredTools.map(tool => (
                                <button
                                    key={tool.name}
                                    onClick={() => handleSelectTool(tool)}
                                    className={`w-full text-left p-3 rounded-xl transition-all group ${
                                        selectedTool?.name === tool.name 
                                        ? 'bg-[var(--accent-color)] text-white shadow-lg' 
                                        : 'hover:bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${
                                                selectedTool?.name === tool.name ? 'bg-white/20' : 'bg-[var(--input-bg)] group-hover:bg-[var(--bg-card)]'
                                            }`}>
                                                <Box size={14} />
                                            </div>
                                            <span className="text-xs font-bold truncate max-w-[120px]">{tool.name}</span>
                                        </div>
                                        <ChevronRight size={14} className={selectedTool?.name === tool.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {selectedTool ? (
                        <div className="grid grid-cols-1 gap-8">
                            {/* Execution Panel */}
                            <div className="space-y-8 max-w-4xl">
                                <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                            <Play size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedTool.name}</h2>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1 uppercase tracking-widest font-bold">Tool Configuration</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-[var(--input-bg)] rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-secondary)] leading-relaxed italic">
                                        {selectedTool.description}
                                    </div>

                                    <form onSubmit={handleExecute} className="space-y-6">
                                        {selectedTool.inputSchema?.properties && Object.keys(selectedTool.inputSchema.properties).map(key => {
                                            const prop = selectedTool.inputSchema.properties[key];
                                            const isRequired = selectedTool.inputSchema.required?.includes(key);
                                            return (
                                                <div key={key} className="space-y-2">
                                                    <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest flex items-center justify-between">
                                                        {key.replace(/_/g, ' ')}
                                                        {isRequired && <span className="text-[10px] text-red-500 font-bold">Required</span>}
                                                    </label>
                                                    <input
                                                        type={prop.type === 'integer' || prop.type === 'number' ? 'number' : 'text'}
                                                        value={toolArgs[key]}
                                                        onChange={(e) => handleArgChange(key, e.target.value)}
                                                        placeholder={prop.description || `Enter ${key}...`}
                                                        required={isRequired}
                                                        className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-primary)] text-sm font-medium shadow-sm transition-all"
                                                    />
                                                </div>
                                            );
                                        })}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                                isLoading 
                                                ? 'bg-[var(--input-bg)] text-[var(--text-secondary)]' 
                                                : 'bg-[var(--accent-color)] text-white hover:opacity-90 shadow-xl'
                                            }`}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                                            Run Tool
                                        </button>
                                    </form>
                                </div>

                                {/* Results View */}
                                {results && (
                                    <div className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                                <Database size={20} />
                                            </div>
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Output Results</h3>
                                        </div>
                                        <RenderResults data={results} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[500px] flex flex-col items-center justify-center bg-[var(--bg-card)] rounded-2xl border-2 border-dashed border-[var(--border-color)] p-12 text-center">
                            <div className="w-20 h-20 bg-[var(--input-bg)] rounded-full flex items-center justify-center text-[var(--text-secondary)] mb-6">
                                <Code size={40} />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Select a tool to configure and run</h3>
                            <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
                                Choose a tool from the sidebar to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlatformTools;
