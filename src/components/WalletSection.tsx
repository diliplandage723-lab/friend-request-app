import React, { useState } from 'react';
import { Transaction, UserProfile } from '../types';
import { Wallet, Send, ArrowUpRight, ArrowDownLeft, QrCode, CreditCard, Banknote, ShieldCheck, Check, Info, RefreshCw } from 'lucide-react';

interface WalletSectionProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<number | React.SetStateAction<number>>;
  friends: UserProfile[];
}

export default function WalletSection({
  transactions,
  setTransactions,
  currentUser,
  setCurrentUser,
  walletBalance,
  setWalletBalance,
  friends
}: WalletSectionProps) {
  const [activeModal, setActiveModal] = useState<'send' | 'deposit' | 'qrView' | 'qrScan' | null>(null);

  // Send Form State
  const [sendPeerId, setSendPeerId] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMethod, setSendMethod] = useState<'Wallet' | 'UPI' | 'Card' | 'Bank'>('Wallet');
  const [upiId, setUpiId] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Form step

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState<'Card' | 'Bank'>('Card');

  const handleSendMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(sendAmount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid positive transfer amount.');
      return;
    }

    if (sendMethod === 'Wallet' && parsedAmount > walletBalance) {
      alert(`Insufficient Wallet Balance. Your balance is $${walletBalance.toFixed(2)}.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // Deduct if Wallet source
      if (sendMethod === 'Wallet') {
        const newBal = walletBalance - parsedAmount;
        setWalletBalance(newBal);
        localStorage.setItem('friend_req_bal', JSON.stringify(newBal));
      }

      const peer = friends.find(f => f.id === sendPeerId);
      const peerName = peer ? peer.fullName : 'External UPI Account';
      const peerAvatar = peer ? peer.avatar : undefined;

      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'send',
        amount: parsedAmount,
        peerName,
        peerAvatar,
        status: 'completed',
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: '2-digit' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: sendMethod
      };

      setTransactions([newTx, ...transactions]);
      
      // Cleanup
      setIsProcessing(false);
      setSendAmount('');
      setSendPeerId('');
      setPinCode('');
      setStep(1);
      setActiveModal(null);

      alert(`Successfully sent $${parsedAmount.toFixed(2)} to ${peerName}! transaction code logged.`);
    }, 1500);
  };

  const handleDepositMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(depositAmount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid positive deposit amount.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newBal = walletBalance + parsedAmount;
      setWalletBalance(newBal);
      localStorage.setItem('friend_req_bal', JSON.stringify(newBal));

      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'deposit',
        amount: parsedAmount,
        status: 'completed',
        timestamp: new Date().toLocaleDateString([], { month: 'short', day: '2-digit' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: depositMethod
      };

      setTransactions([newTx, ...transactions]);
      setIsProcessing(false);
      setDepositAmount('');
      setActiveModal(null);

      alert(`Successfully loaded $${parsedAmount.toFixed(2)} into your Wallet!`);
    }, 1200);
  };

  const startQrScannerSim = () => {
    setActiveModal('qrScan');
    // Auto scan simulation after 3 seconds
    setTimeout(() => {
      // Auto select first friend Alice
      setSendPeerId(friends[0].id);
      setSendAmount('15.00');
      setStep(1);
      setActiveModal('send');
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] dark:bg-[#0A0B10] overflow-y-auto pb-24 scrollbar-none" id="wallet-section">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-[#11131A] border-b border-slate-200/60 dark:border-white/5 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white font-display uppercase tracking-wider">UPI Wallet</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-display uppercase tracking-widest block mt-0.5">Secure digital bank link</p>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/30 p-1.5 px-3 rounded-full font-display">
          <ShieldCheck size={12} /> UPI Verified
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="p-4 shrink-0">
        <div className="bg-gradient-to-br from-[#1C1F28] via-[#11131A] to-[#0A0B10] rounded-[32px] border border-blue-500/10 p-6 text-white shadow-xl relative overflow-hidden">
          {/* Decorative balance background grids */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-600/15 to-purple-600/0 rounded-full translate-x-5 -translate-y-5"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-x-6 translate-y-6"></div>

          <span className="text-[8px] bg-white/10 text-white/90 px-3 py-1 rounded-full font-bold uppercase tracking-widest font-display pb-1.5">
            FRIEND WALLET BALANCE
          </span>

          <h2 className="text-3xl font-mono font-extrabold mt-4 text-white drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] select-all">
            ${walletBalance.toFixed(2)}
          </h2>

          <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/5 text-xs">
            <div>
              <p className="text-[8px] uppercase tracking-wider text-slate-400 font-display font-medium">Payable UPI Address ID</p>
              <p className="font-mono font-semibold text-[10px] tracking-wide mt-1 text-slate-200">{currentUser.username}@frepay</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveModal('qrView')}
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all active-press border border-white/5"
                title="Get QR code"
                id="btn-get-qr"
              >
                <QrCode size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Hub */}
      <div className="px-4 pb-2 shrink-0 grid grid-cols-3 gap-3">
        <button
          onClick={() => { setStep(1); setActiveModal('send'); }}
          className="bg-white dark:bg-[#11131A] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xs text-center active-press transition-transform"
          id="btn-pay-money"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
            <Send size={15} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-[9px] text-slate-700 dark:text-slate-350 font-bold uppercase tracking-wider font-display">Pay Friend</span>
        </button>

        <button
          onClick={startQrScannerSim}
          className="bg-white dark:bg-[#11131A] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xs text-center active-press transition-transform"
          id="btn-scan-qr"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/20 flex items-center justify-center">
            <QrCode size={15} className="text-pink-600 dark:text-pink-400" />
          </div>
          <span className="text-[9px] text-slate-700 dark:text-slate-350 font-bold uppercase tracking-wider font-display">Scan Pay</span>
        </button>

        <button
          onClick={() => setActiveModal('deposit')}
          className="bg-white dark:bg-[#11131A] border border-slate-200 dark:border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xs text-center active-press transition-transform"
          id="btn-add-funds"
        >
          <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center">
            <Banknote size={15} className="text-green-600 dark:text-green-400" />
          </div>
          <span className="text-[9px] text-slate-700 dark:text-slate-350 font-bold uppercase tracking-wider font-display">Add Money</span>
        </button>
      </div>

      {/* Transaction History log */}
      <div className="p-4 flex-1">
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest font-display">Transaction Records</span>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-display flex items-center gap-1"><RefreshCw size={10} /> bank logs</span>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => {
            const isSend = tx.type === 'send';
            const isDeposit = tx.type === 'deposit';
            
            return (
              <div key={tx.id} className="bg-white dark:bg-[#11131A] p-4 rounded-[24px] border border-slate-150 dark:border-white/5 flex justify-between items-center shadow-xs">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    isDeposit ? 'bg-green-50 dark:bg-green-950/20 text-green-600' : isSend ? 'bg-red-50 dark:bg-red-950/20 text-red-600' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600'
                  }`}>
                    {isDeposit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-sans leading-none">
                      {isDeposit ? 'Deposit Into Wallet' : isSend ? `Sent to @${tx.peerName?.split(' ')[0]}` : `From @${tx.peerName?.split(' ')[0]}`}
                    </h4>
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 font-display mt-1.5 uppercase tracking-wider font-medium">
                      {tx.timestamp} • via {tx.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-xs font-mono font-bold ${isDeposit ? 'text-green-600' : 'text-slate-800 dark:text-slate-105'}`}>
                    {isDeposit ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <span className="bg-emerald-55/70 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md text-[8px] uppercase tracking-wider font-display mt-1.5 inline-block border border-emerald-500/10">
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: SEND MONEY PEER FORMS */}
      {activeModal === 'send' && (
        <div className="fixed inset-0 bg-[#0A0B10]/80 backdrop-blur-sm z-[1000] flex justify-center items-end animate-fade-in">
          <div className="bg-white dark:bg-[#11131A] rounded-t-[32px] p-6 w-full max-w-[325px] shadow-2xl space-y-4 border-t border-slate-200 dark:border-white/5">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest font-display text-slate-800 dark:text-white">REMITTANCE SECURE PAY</h4>
              <button onClick={() => { setActiveModal(null); setStep(1); }} className="text-[10px] font-bold uppercase tracking-wider text-red-500 font-display">Close</button>
            </div>

            {step === 1 ? (
              <div className="space-y-3.5 text-xs">
                {/* Select Peer Friend */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-display">Send to Friend:</label>
                  <select
                    value={sendPeerId}
                    onChange={(e) => setSendPeerId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1C1F28] border border-slate-200 dark:border-white/10 p-3 rounded-xl outline-none text-slate-800 dark:text-slate-100 font-sans"
                  >
                    <option value="">-- Choose Friend contacts --</option>
                    {friends.map(f => (
                      <option key={f.id} value={f.id}>@{f.username} ({f.fullName})</option>
                    ))}
                  </select>
                </div>

                {/* Select Amount */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-display">Amount ($):</label>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 dark:bg-[#1C1F28] border border-slate-200 dark:border-white/10 p-3 rounded-xl outline-none font-mono font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Payment Gateway method selection */}
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-display">Payment Method:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Wallet', 'UPI', 'Card', 'Bank'].map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSendMethod(method as any)}
                        className={`py-2 px-2 rounded-xl text-[9px] font-bold border font-display tracking-widest uppercase transition-all duration-200 ${
                          sendMethod === method 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15' 
                            : 'bg-slate-50 dark:bg-[#1C1F28] border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 text-[9px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-[#1C1F28] p-3 rounded-xl border border-slate-150 dark:border-white/5">
                  <Info size={13} className="shrink-0 text-blue-500" />
                  <span className="leading-relaxed">Wallet funds are processed instantly. Credit cards may take up to 24 hours.</span>
                </div>

                <button
                  onClick={() => {
                    if (sendPeerId && sendAmount) setStep(2);
                    else alert('Select peer and type positive amount to proceed!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl w-full text-center hover:scale-[1.02] active-press transition-all text-[10px] font-display uppercase tracking-widest"
                >
                  Verify Payment Details
                </button>
              </div>
            ) : (
              // STEP 2: SECURE AUTH PIN ENTRANCE
              <form onSubmit={handleSendMoney} className="space-y-4 text-xs">
                <div className="text-center bg-slate-50 dark:bg-[#1C1F28] p-4.5 rounded-2xl border border-slate-150 dark:border-white/5">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-display">Total payable amount</p>
                  <p className="text-xl font-mono font-extrabold text-slate-800 dark:text-slate-105 mt-2">
                    ${parseFloat(sendAmount).toFixed(2)}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-2">
                    Paying <b>@{friends.find(f => f.id === sendPeerId)?.username}</b> via {sendMethod}
                  </p>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 text-center font-display">🔐 ENTER 4-DIGIT SECURE UPI PIN:</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="• • • •"
                    className="w-full tracking-[1.5em] text-center bg-slate-50 dark:bg-[#1C1F28] border border-blue-500/50 dark:border-blue-500/30 p-2.5 rounded-xl outline-none font-sans font-extrabold text-slate-850 dark:text-slate-100"
                    required
                  />
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400">
                  <button type="button" onClick={() => setStep(1)} className="hover:text-blue-500 font-display font-bold uppercase">Edit Details</button>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"><ShieldCheck size={11} /> SECURED 128-BIT</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || pinCode.length < 4}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl w-full text-center transition-all text-[10px] uppercase font-display tracking-widest active-press"
                >
                  {isProcessing ? 'Validating credentials...' : 'Confirm Remittance'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: DEPOSIT MONEY */}
      {activeModal === 'deposit' && (
        <div className="fixed inset-0 bg-[#0A0B10]/80 backdrop-blur-sm z-[1000] flex justify-center items-end animate-fade-in">
          <form onSubmit={handleDepositMoney} className="bg-white dark:bg-[#11131A] rounded-t-[32px] p-6 w-full max-w-[325px] shadow-2xl space-y-4 border-t border-slate-200 dark:border-white/5">
            <div className="flex justify-between items-center mb-1 text-xs">
              <h4 className="font-black uppercase tracking-widest font-display text-slate-800 dark:text-white text-[10px]">Load Bank Funds</h4>
              <button type="button" onClick={() => setActiveModal(null)} className="text-red-500 font-bold uppercase text-[10px] font-display tracking-wider">Close</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1.5 font-display">Deposit Amount ($):</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 dark:bg-[#1C1F28] border border-slate-200 dark:border-white/5 p-3 rounded-xl outline-none font-mono font-bold text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1.5 font-display">Source Gateway:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositMethod('Card')}
                    className={`py-2.5 px-1 rounded-xl text-[9px] font-bold border flex items-center justify-center gap-1.5 transition-all font-display uppercase tracking-wider ${
                      depositMethod === 'Card' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-[#1C1F28] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5'
                    }`}
                  >
                    <CreditCard size={11} /> Visa / Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositMethod('Bank')}
                    className={`py-2.5 px-1 rounded-xl text-[9px] font-bold border flex items-center justify-center gap-1.5 transition-all font-display uppercase tracking-wider ${
                      depositMethod === 'Bank' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-[#1C1F28] text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5'
                    }`}
                  >
                    <Wallet size={11} /> Bank Link
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl w-full text-center transition-all text-[10px] uppercase font-display tracking-widest active-press"
              >
                {isProcessing ? 'Processing wire transfer...' : 'Confirm Deposit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: GET MY QR CODE */}
      {activeModal === 'qrView' && (
        <div className="fixed inset-0 bg-[#0A0B10]/85 backdrop-blur-sm z-[1000] flex justify-center items-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#11131A] rounded-[32px] p-6 w-full max-w-[270px] text-center shadow-2xl space-y-4 border border-slate-200 dark:border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest font-display text-slate-800 dark:text-white">Receive Instant Transfer</h4>

            {/* Custom SVG-drawn beautiful vector QR Code mock */}
            <div className="p-3 bg-white rounded-2xl inline-block border-2 border-blue-50 dark:border-white/10 shadow-sm">
              <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100" fill="none">
                {/* QR Outer framing */}
                <rect x="5" y="5" width="25" height="25" rx="3" stroke="#2563EB" strokeWidth="4" />
                <rect x="10" y="10" width="15" height="15" fill="#2563EB" />
                
                <rect x="70" y="5" width="25" height="25" rx="3" stroke="#2563EB" strokeWidth="4" />
                <rect x="75" y="10" width="15" height="15" fill="#2563EB" />

                <rect x="5" y="70" width="25" height="25" rx="3" stroke="#2563EB" strokeWidth="4" />
                <rect x="10" y="75" width="15" height="15" fill="#2563EB" />

                {/* QR Core dots */}
                <rect x="40" y="15" width="10" height="10" fill="#0A0B10" />
                <rect x="55" y="10" width="10" height="5" fill="#0A0B10" />
                <rect x="45" y="30" width="15" height="10" fill="#0A0B10" />
                <rect x="15" y="45" width="15" height="10" fill="#0A0B10" />
                <rect x="40" y="50" width="15" height="15" fill="#0A0B10" />
                <rect x="70" y="45" width="15" height="10" fill="#2563EB" />
                <rect x="65" y="65" width="10" height="15" fill="#0A0B10" />
                <rect x="40" y="75" width="15" height="10" fill="#0A0B10" />
                <rect x="5" y="40" width="5" height="5" rx="1" fill="#2563EB" />
                <rect x="85" y="35" width="5" height="10" fill="#2563EB" />

                {/* Grid center brand logo */}
                <rect x="42" y="42" width="16" height="16" rx="4" fill="#3B82F6" />
                <circle cx="50" cy="50" r="4" fill="#ffffff" />
              </svg>
            </div>

            <div className="text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-105 font-mono text-[11px]">@{currentUser.username}</p>
              <p className="text-[9px] text-slate-450 mt-2 leading-relaxed">Present this code to receive immediate cash drops inside Friend Request networks.</p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl w-full text-[10px] uppercase font-display tracking-widest active-press"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: QR SCANNER SIMULATOR */}
      {activeModal === 'qrScan' && (
        <div className="fixed inset-0 bg-[#0A0B10]/95 z-[1000] flex flex-col justify-between p-6 select-none animate-fade-in text-white text-center">
          <div className="pt-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 font-display">Secure Scan pay</h4>
            <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-display">Keep QR address within parameters</p>
          </div>

          {/* Scanner Grid Center element with Laser Sweep animation */}
          <div className="aspect-square max-w-[180px] mx-auto w-full border-2 border-dashed border-blue-500 rounded-[32px] relative flex items-center justify-center p-3 overflow-hidden">
            {/* Hologram Sweep Laser */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_#2563EB] animate-[bounce_2s_infinite]"></div>
            
            <svg className="w-12 h-12 stroke-slate-500 stroke-[2] shrink-0 opacity-40 animate-pulse" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316A2.192 2.192 0 0014.502 4h-5c-.7 0-1.343.34-1.74 1.131L6.826 6.175z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <div className="pb-8">
            <div className="inline-block bg-white/10 text-white/95 text-[9px] font-bold py-2 px-4 rounded-full border border-white/5 shadow-md flex items-center gap-2 mx-auto uppercase tracking-wider font-display">
              {/* Spinning indicator */}
              <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span>SIMULATING CAMERA SCAN...</span>
            </div>
            
            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest font-display"
            >
              Cancel Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
