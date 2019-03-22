new Vue({
    el: "#app",
    data: {
        currencies: {},
        from: "USD",
        to: "NGN",
        amount: 0,
        result: 0,
        loading: false
    },
    methods: {
        getCurrencies() {
            const currencies = localStorage.getItem("currencies");

            if (currencies) {
                this.currencies = JSON.parse(currencies);
                return;
            }
            axios.get("https://free.currencyconverterapi.com/api/v6/currencies?apiKey=sample-api-key").then(response => {
                this.currencies = response.data.results;
                localStorage.setItem("currencies", JSON.stringify(this.currencies));
            })
        },
        calculateResult() {
            var code = `${this.from}_${this.to}`;
            if (this.from == this.to) {
                alert("You can't convert between similar currency.");
                return;
            }
            this.loading = true;
            axios.get("https://free.currencyconverterapi.com/api/v6/convert?q=" + code + "&compact=ultra&apiKey=sample-api-key").then(response => {
                this.result = response.data[code];
                this.loading = false;
            });
        }
    },
    computed: {
        formattedCurrencies() {
            return Object.values(this.currencies);
        },
        convertedAmount() {
            var toCurrency = this.formattedCurrencies.find(c => c.id == this.to);
            if (toCurrency)
                return toCurrency.currencySymbol + (Number(this.amount) * this.result).toFixed();
            return (Number(this.amount) * this.result).toFixed();
        },
        disabled() {
            return !this.amount || this.loading;
        }
    },
    mounted() {
        this.getCurrencies();
    },
    watch: {
        from() {
            this.result = 0;
        },
        to() {
            this.result = 0;
        }
    },
})