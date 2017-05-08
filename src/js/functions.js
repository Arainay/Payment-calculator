export function calculate() {
    // form
    const creditSumElement = document.getElementById('credit-sum');
    const creditPercentElement = document.getElementById('credit-percent');
    const creditPeriodElement = document.getElementById('credit-period');
    const creditForm = document.querySelector('.credit-data');

    // result
    const monthlyPaymentElement = document.getElementById('monthly-payment');
    const sumElement = document.getElementById('payment-sum');
    const overpaymentsElement = document.getElementById('overpayments');

    // values
    let amount;
    let percent;
    let period;
    let monthlyPayment;
    let creditSum;
    let overpayments;

    creditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        isNumeric(+creditSumElement.value) && (amount = parseFloat(creditSumElement.value));
        isNumeric(+creditPercentElement.value) && (percent = parseFloat(creditPercentElement.value) / 100 / 12);
        isNumeric(+creditPeriodElement.value) && (period = parseFloat(creditPeriodElement.value));

        monthlyPayment = (amount * percent / (1 - 1 / Math.pow(1 + percent, period))).toFixed(2);
        creditSum = (monthlyPayment * period).toFixed(2);
        overpayments = (creditSum - amount).toFixed(2);

        monthlyPaymentElement.textContent = monthlyPayment;
        sumElement.textContent = creditSum;
        overpaymentsElement.textContent = overpayments;

        chart(amount, percent, monthlyPayment, period);
    });
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && typeof n === 'number';
}

function chart(amount, percent, monthlyPayment, period) {
    let graph = document.getElementById('graph');
    if (arguments.length === 0 || !graph.getContext) {
        console.log(arguments.length, graph.getContext);
        return;
    }
    let ctx = graph.getContext('2d');
    let width = graph.width;
    let height = graph.height;

    let paymentToX = n => n * width / period;
    let amountToY = a => height - (a * height / (monthlyPayment * period * 1.05));

    ctx.moveTo(paymentToX(0), amountToY(0));
    ctx.lineTo(paymentToX(period), amountToY(monthlyPayment * period));
    ctx.lineTo(paymentToX(period), amountToY(0));
    ctx.closePath();
    ctx.fillStyle = '#f88';
    ctx.fill();
    ctx.font= 'bold 16px sans-serif';
    ctx.fillText("Сумма процентных платежей", 20, 20);

    let equality = 0;
    ctx.beginPath();
    ctx.moveTo(paymentToX(0), amountToY(0));
    for (let i = 1; i <= period; i++) {
        let monthlyInterests = (amount - equality) * percent;
        equality += monthlyPayment - monthlyInterests;
        ctx.lineTo(paymentToX(i), amountToY(equality));
    }
    ctx.lineTo(paymentToX(period), amountToY(0));
    ctx.closePath();
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.fillText("Общая сумма", 20, 35);
}