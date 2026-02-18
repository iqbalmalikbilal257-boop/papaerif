<script>
async function createPaymentOrder(plan, books) {
    try {
        const response = await fetch('/api/payment/create-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, books })
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            showNotification(data.error || 'Unable to create payment link', 'error');
            document.getElementById('orderIdText').innerText = 'Failed';
            return;
        }
        document.getElementById('orderIdText').innerText = data.linkId;
        document.getElementById('orderExpiryText').innerText = '30 minutes';
        setTimeout(() => {
            window.open(data.paymentUrl, '_blank');
            showNotification('Payment link opened in new tab', 'success');
            closePaymentModal();
        }, 1000);
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
        document.getElementById('orderIdText').innerText = 'Failed';
    }
}

function showPaymentForm(plan, amount, books) {
    const planName = plan === 'weekly_unlimited' ? 'Weekly Unlimited (14 Days)' : 
                     plan === 'monthly_specific' ? 'Monthly Specific (30 Papers)' : 
                     'Monthly Unlimited (30 Days)';
    const bookInfo = books && books.length > 0 ? 
        `<p class="text-xs text-gray-600 mt-3"><strong>Books:</strong> ${books.join(', ')}</p>` : '';

    const paymentHTML = `
<div class="text-center mb-8">
    <h3 class="text-xl font-bold text-[#3f3a64] tracking-tight">Secure Payment Link</h3>
    <p class="text-xs text-gray-400 mt-1">Opening secure payment page...</p>
</div>

<div class="max-w-md mx-auto space-y-6">
    <div class="flex justify-between items-center px-2">
        <div>
            <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Plan</span>
            <p class="text-lg font-bold text-[#3f3a64]">${planName}</p>
        </div>
        <div class="text-right">
            <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Amount</span>
            <p class="text-2xl font-black text-[#19c880]">PKR ${amount}</p>
        </div>
    </div>

    ${bookInfo}

    <div class="bg-gradient-to-br from-[#3f3a64] to-[#19c880] rounded-2xl p-6 text-white text-center shadow-xl">
        <i class="fas fa-shield-alt text-4xl mb-3 opacity-75"></i>
        <p class="text-sm font-bold">Secure Payment Processing</p>
        <p class="text-xs opacity-75 mt-2">Cryptographically signed link</p>
    </div>

    <div id="orderInfo" class="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
        <p>Link ID: <span id="orderIdText" class="font-bold">Creating...</span></p>
        <p class="mt-1">Valid for: <span id="orderExpiryText" class="font-bold">--</span></p>
    </div>

    <div class="pt-4">
        <button onclick="closePaymentModal()"
            class="w-full mt-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest py-2 hover:text-red-400 transition-colors">
            Close
        </button>
    </div>

    <p class="text-[10px] text-center text-gray-400 italic">Payment link will open in new tab. Complete payment there for instant activation.</p>
</div>
`;

    document.getElementById('paymentContent').innerHTML = paymentHTML;
    document.getElementById('paymentModal').classList.add('active');
    createPaymentOrder(plan, books);
}
</script>
