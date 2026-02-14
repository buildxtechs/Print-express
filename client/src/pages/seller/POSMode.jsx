import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const POSMode = () => {
    const { axios, services, products, currency } = useAppContext();
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [viewMode, setViewMode] = useState('services'); // 'services' or 'products'
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const filteredItems = useMemo(() => {
        const source = viewMode === 'services' ? services : products;
        if (!searchQuery) return source;
        return source.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [viewMode, services, products, searchQuery]);

    const addToCart = (item) => {
        const itemId = item._id;
        const price = viewMode === 'services' ? (item.price || 0) : (item.offerPrice || 0);

        const existingItemIndex = cart.findIndex(c => c._id === itemId);
        if (existingItemIndex > -1) {
            const newCart = [...cart];
            newCart[existingItemIndex].quantity += 1;
            setCart(newCart);
        } else {
            setCart([...cart, {
                _id: itemId,
                name: item.name,
                price,
                icon: item.icon || (viewMode === 'products' ? '📦' : '📄'),
                type: viewMode === 'services' ? 'Service' : 'Product',
                quantity: 1
            }]);
        }
        toast.success(`Added ${item.name}`, { icon: '🛒', duration: 1000 });
    };

    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        const item = newCart[index];
        if (item.quantity + delta > 0) {
            item.quantity += delta;
            setCart(newCart);
        } else {
            removeFromCart(index);
        }
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!customer.phone) return toast.error("Enter customer phone for receipt");
        if (cart.length === 0) return toast.error("Cart is empty");

        setLoading(true);
        try {
            const { data } = await axios.post('/api/order/pos', {
                customer,
                items: cart,
                totalAmount,
                paymentMethod: 'Cash'
            });

            if (data.success) {
                toast.success("Order Placed! ⚡");
                handlePrint({
                    customer,
                    items: cart,
                    totalAmount,
                    date: new Date(),
                    orderNo: data.orderId.slice(-8).toUpperCase()
                });
                setCart([]);
                setCustomer({ name: '', phone: '' });
                setSearchQuery('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Checkout Failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (bill) => {
        const printWindow = window.open('', '_blank');
        const itemsHtml = bill.items.map(item => `
            <tr>
                <td style="padding: 5px 0;">${item.name}<br/><small style="color: #666;">${item.quantity} x ₹${item.price}</small></td>
                <td style="text-align: right; vertical-align: bottom;">₹${item.price * item.quantity}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Bill #${bill.orderNo}</title>
                    <style>
                        @page { margin: 0; }
                        body { width: 80mm; font-family: 'Courier New', monospace; font-size: 13px; margin: 0; padding: 10mm 5mm; color: #000; }
                        .center { text-align: center; }
                        .bold { font-weight: bold; }
                        .header { border-bottom: 1.5px dashed #000; padding-bottom: 8px; margin-bottom: 10px; }
                        .footer { border-top: 1.5px dashed #000; padding-top: 8px; margin-top: 15px; font-size: 11px; }
                        table { width: 100%; border-collapse: collapse; }
                        .total-row { border-top: 1px solid #000; margin-top: 5px; padding-top: 5px; }
                    </style>
                </head>
                <body onload="setTimeout(() => { window.print(); window.close(); }, 300)">
                    <div class="header center">
                        <div class="bold" style="font-size: 18px;">PRINT EXPRESS</div>
                        <div style="font-size: 10px; margin-top: 4px;">Smart Printing & Stationery Hub</div>
                        <div style="font-size: 10px;">Coimbatore, TN | 9876543210</div>
                    </div>
                    
                    <div style="margin-bottom: 10px; font-size: 11px;">
                        <div>No: <b>${bill.orderNo}</b> | Date: ${new Date(bill.date).toLocaleDateString()}</div>
                        <div>Cust: ${bill.customer.name || 'Walk-in'} (${bill.customer.phone})</div>
                    </div>

                    <table>
                        <thead style="border-bottom: 1px solid #eee;">
                            <tr>
                                <th style="text-align: left; padding-bottom: 5px;">Description</th>
                                <th style="text-align: right; padding-bottom: 5px;">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div class="total-row">
                        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 900;">
                            <span>NET AMOUNT</span>
                            <span>₹${bill.totalAmount}</span>
                        </div>
                        <div class="center" style="margin-top: 4px; font-size: 10px;">Paid by Cash | GST Incl.</div>
                    </div>

                    <div class="footer center">
                        <div class="bold">THANK YOU FOR YOUR VISIT!</div>
                        <div style="margin-top: 2px;">Keep this receipt for support.</div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] overflow-hidden">
            {/* Catalog Section */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">POS Terminal</h2>
                        <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Quick Billing & Inventory</p>
                    </div>

                    <div className="flex items-center bg-white p-1 rounded-2xl border border-border shadow-sm">
                        <button
                            onClick={() => setViewMode('services')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'services' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Print Services
                        </button>
                        <button
                            onClick={() => setViewMode('products')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'products' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Stationery Items
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${viewMode}...`}
                        className="w-full py-4 px-12 bg-white rounded-2xl border-2 border-border focus:border-primary outline-none transition-all shadow-sm font-medium"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                    {filteredItems.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => addToCart(item)}
                            className="card-premium p-5 flex flex-col items-center gap-2 group hover:border-primary transition-all active:scale-95 text-center bg-white"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                {viewMode === 'products' && item.image?.[0] ? (
                                    <img src={item.image[0]} className="w-10 h-10 object-contain" alt="" />
                                ) : (
                                    item.icon || (viewMode === 'services' ? '📄' : '📦')
                                )}
                            </div>
                            <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-primary font-black">{currency}{viewMode === 'services' ? item.price : item.offerPrice}</p>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-primary text-white text-[8px] px-2 py-0.5 rounded-full font-bold">+ ADD</span>
                            </div>
                        </button>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl opacity-50">
                            <p className="text-3xl mb-2">🔎</p>
                            <p className="text-sm font-bold">No {viewMode} matched your search</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-full lg:w-96 flex flex-col gap-6">
                <div className="card-premium p-6 flex flex-col gap-4 bg-white border-2 border-primary/10 shadow-xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-muted flex items-center justify-between">
                        Customer Info
                        <span className="text-[9px] bg-slate-100 px-2 py-1 rounded text-text-main">Optional</span>
                    </h3>
                    <div className="space-y-2">
                        <input
                            value={customer.phone}
                            onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                            placeholder="Customer Phone"
                            className="input-field py-2.5 text-xs text-center font-mono tracking-widest"
                        />
                        <input
                            value={customer.name}
                            onChange={e => setCustomer({ ...customer, name: e.target.value })}
                            placeholder="Customer Name (Walk-in)"
                            className="input-field py-2.5 text-xs text-center font-bold"
                        />
                    </div>
                </div>

                <div className="flex-1 card-premium p-0 flex flex-col bg-white overflow-hidden shadow-2xl border-none">
                    <div className="p-6 border-b border-border bg-slate-50/50 flex items-center justify-between">
                        <h3 className="font-black text-xs uppercase tracking-widest">Current Cart</h3>
                        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{cart.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                        {cart.map((item, i) => (
                            <div key={i} className="flex justify-between items-center group animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg">{item.icon}</div>
                                    <div className="max-w-[120px]">
                                        <p className="text-[11px] font-bold truncate">{item.name}</p>
                                        <p className="text-[9px] text-primary font-black">₹{item.price} <span className="text-text-muted font-medium">/ unit</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center bg-slate-50 rounded-lg border border-border p-1">
                                        <button onClick={() => updateQuantity(i, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors text-xs">－</button>
                                        <span className="min-w-[20px] text-center text-xs font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(i, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded transition-colors text-xs">＋</button>
                                    </div>
                                    <button onClick={() => removeFromCart(i)} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                                <span className="text-5xl mb-4">🛒</span>
                                <p className="text-xs font-black uppercase tracking-widest">Empty Cart</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-slate-900 text-white space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Total Payable</span>
                            <span className="text-green-400">Cash Payment</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <h4 className="text-4xl font-black font-outfit">₹{totalAmount}</h4>
                            <span className="text-[10px] font-bold opacity-60">incl. tax</span>
                        </div>
                        <button
                            disabled={loading || cart.length === 0}
                            onClick={handleCheckout}
                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${cart.length > 0 ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                        >
                            {loading ? 'Processing...' : 'GENERATE BILL ⚡'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POSMode;
