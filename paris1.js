document.addEventListener('DOMContentLoaded', function () {
    // Toggle itinerary day details
    var dayHeaders = document.getElementsByClassName('day-header');
    for (var i = 0; i < dayHeaders.length; i++) {
        dayHeaders[i].addEventListener('click', function () {
            var dayPlan = this.parentElement;
            var icon = this.getElementsByTagName('i')[0];

            if (dayPlan.classList.contains('active')) {
                dayPlan.classList.remove('active');
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                dayPlan.classList.add('active');
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    }

    // Traveler counters
    var incrementButtons = document.getElementsByClassName('increment');
    var decrementButtons = document.getElementsByClassName('decrement');

    for (var i = 0; i < incrementButtons.length; i++) {
        incrementButtons[i].addEventListener('click', function () {
            var input = this.parentElement.getElementsByTagName('input')[0];
            var currentValue = parseInt(input.value);
            var max = parseInt(input.getAttribute('max'));
            if (currentValue < max) {
                input.value = currentValue + 1;
                updatePriceSummary();
            }
        });
    }

    for (var i = 0; i < decrementButtons.length; i++) {
        decrementButtons[i].addEventListener('click', function () {
            var input = this.parentElement.getElementsByTagName('input')[0];
            var currentValue = parseInt(input.value);
            var min = parseInt(input.getAttribute('min'));
            if (currentValue > min) {
                input.value = currentValue - 1;
                updatePriceSummary();
            }
        });
    }

    // Add-ons
    var addOnInputs = document.querySelectorAll('.add-ons input[type="checkbox"]');
    for (var i = 0; i < addOnInputs.length; i++) {
        addOnInputs[i].addEventListener('change', updatePriceSummary);
    }

    // Room type and departure date change
    document.getElementById('room-type').addEventListener('change', updatePriceSummary);
    document.getElementById('departure-date').addEventListener('change', updatePriceSummary);

    function updatePriceSummary() {
        var adults = parseInt(document.getElementById('adults').value);
        var children = parseInt(document.getElementById('children').value);
        var infants = parseInt(document.getElementById('infants').value);

        var basePrice = adults * 150299 + children * 120000;

        var roomType = document.getElementById('room-type').value;
        var travelers = adults + children;
        var roomUpcharge = 0;

        if (roomType === 'superior') {
            roomUpcharge = 15000 * travelers;
        } else if (roomType === 'deluxe') {
            roomUpcharge = 30000 * travelers;
        } else if (roomType === 'suite') {
            roomUpcharge = 50000 * travelers;
        }

        basePrice += roomUpcharge;

        var addOnsTotal = 0;
        if (document.getElementById('moulin-rouge').checked) {
            addOnsTotal += 12000 * adults;
        }
        if (document.getElementById('food-tour').checked) {
            addOnsTotal += 5500 * (adults + children);
        }
        if (document.getElementById('photography-session').checked) {
            addOnsTotal += 9500;
        }

        var discountPercentage = checkDiscountEligibility();
        var discountAmount = Math.round(basePrice * (discountPercentage / 100));
        var totalAmount = basePrice - discountAmount + addOnsTotal;

        // Update price summary
        var rows = document.getElementsByClassName('price-row');
        rows[0].getElementsByTagName('span')[1].textContent = '₹' + basePrice.toLocaleString('en-IN');
        rows[1].getElementsByTagName('span')[0].textContent = 'Advance Booking Discount (' + discountPercentage + '%)';
        rows[1].getElementsByTagName('span')[1].textContent = '-₹' + discountAmount.toLocaleString('en-IN');
        rows[2].getElementsByTagName('span')[1].textContent = '₹' + addOnsTotal.toLocaleString('en-IN');
        var totalRow = document.getElementsByClassName('price-row total')[0];
        totalRow.getElementsByTagName('span')[1].textContent = '₹' + totalAmount.toLocaleString('en-IN');

        // Update payment option labels
        document.querySelector('#full-payment + label').textContent = 'Pay in Full (₹' + totalAmount.toLocaleString('en-IN') + ')';
        document.querySelector('#partial-payment + label').textContent = 'Pay Deposit (₹' + Math.round(totalAmount * 0.3).toLocaleString('en-IN') + ' now, remaining 30 days before departure)';
    }

    function checkDiscountEligibility() {
        var selectedDate = document.getElementById('departure-date').value;
        if (!selectedDate) return 0;

        var departureDate = new Date(selectedDate);
        var today = new Date();
        var monthsDiff = (departureDate.getFullYear() - today.getFullYear()) * 12 +
            (departureDate.getMonth() - today.getMonth());

        if (monthsDiff >= 3) {
            return 10;
        } else if (monthsDiff >= 2) {
            return 5;
        }

        return 0;
    }

    // Form submission
    document.getElementById('paris-booking').addEventListener('submit', function (e) {
        e.preventDefault();

        var requiredFields = document.querySelectorAll('[required]');
        var isValid = true;

        for (var i = 0; i < requiredFields.length; i++) {
            var field = requiredFields[i];
            if (!field.value) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '#ddd';
            }
        }

        if (!isValid) {
            alert('Please fill all required fields');
            return;
        }

        alert('Thank you for your booking! Redirecting to payment gateway...');
    });

    // Initial load
    updatePriceSummary();
    if (dayHeaders.length > 0) {
        dayHeaders[0].click();
    }
});
