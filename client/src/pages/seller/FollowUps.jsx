import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const FollowUps = () => {
    const { axios } = useAppContext();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const { data } = await axios.get('/api/billing/message-logs');
            if (data.success) setLogs(data.logs);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-outfit">Messaging Logs</h1>
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-border text-[10px] uppercase font-bold text-text-muted">
                        <tr>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Sent By</th>
                            <th className="p-4">Content</th>
                            <th className="p-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? <tr><td colSpan="5" className="p-8 text-center text-text-muted">Loading...</td></tr> :
                            logs.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-text-muted">No logs found</td></tr> :
                                logs.map((log, i) => (
                                    <tr key={i} className="text-sm">
                                        <td className="p-4 font-bold">{log.userId?.name || 'Guest'}</td>
                                        <td className="p-4 font-mono">{log.phoneNumber}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-[10px] uppercase ${log.sentBy === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{log.sentBy}</span></td>
                                        <td className="p-4 text-xs text-text-muted truncate max-w-xs">{log.content}</td>
                                        <td className="p-4 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FollowUps;
