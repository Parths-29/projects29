document.addEventListener('DOMContentLoaded', function () {
    // Constants
    var BASE_PRICE = 140499;
    var DISCOUNT_RATE = 0.15;
    var ROOM_SURCHARGES = {
        'standard': 0,
        'superior': 15000,
        'deluxe': 30000,
        'suite': 50000
    };
    var ADDON_COSTS = {
        'travel-insurance': 4500,
        'private-transfers': 3000,
        'photography-session': 8000
    };

    // Toggle itinerary day content
    var dayHeaders = document.getElementsByClassName('day-header');
    for (var i = 0; i < dayHeaders.length; i++) {
        dayHeaders[i].addEventListener('click', function () {
            var content = this.nextElementSibling;
            var toggleIcon = this.getElementsByClassName('toggle-btn')[0].getElementsByTagName('i')[0];
            var expanded = this.getAttribute('aria-expanded') === 'true';

            if (expanded) {
                content.style.display = 'none';
                toggleIcon.className = 'fas fa-plus';
                this.setAttribute('aria-expanded', 'false');
            } else {
                content.style.display = 'block';
                toggleIcon.className = 'fas fa-minus';
                this.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Traveler counters
    var incrementBtns = document.getElementsByClassName('increment');
    var decrementBtns = document.getElementsByClassName('decrement');

    for (var i = 0; i < incrementBtns.length; i++) {
        incrementBtns[i].addEventListener('click', function () {
            var input = this.parentElement.getElementsByTagName('input')[0];
            var currentValue = parseInt(input.value);
            var maxValue = parseInt(input.getAttribute('max'));

            if (currentValue < maxValue) {
                input.value = currentValue + 1;
                updatePriceSummary();
            }
        });
    }

    for (var i = 0; i < decrementBtns.length; i++) {
        decrementBtns[i].addEventListener('click', function () {
            var input = this.parentElement.getElementsByTagName('input')[0];
            var currentValue = parseInt(input.value);
            var minValue = parseInt(input.getAttribute('min'));

            if (currentValue > minValue) {
                input.value = currentValue - 1;
                updatePriceSummary();
            }
        });
    }

    // Add-ons checkbox changes
    var addOnsSection = document.getElementsByClassName('add-ons');
    if (addOnsSection.length > 0) {
        var addonInputs = addOnsSection[0].getElementsByTagName('input');
        for (var i = 0; i < addonInputs.length; i++) {
            addonInputs[i].addEventListener('change', updatePriceSummary);
        }
    }

    // Room type change
    var roomType = document.getElementById('room-type');
    if (roomType) {
        roomType.addEventListener('change', updatePriceSummary);
    }

    // Price calculation
    function updatePriceSummary() {
        var adults = parseInt(document.getElementById('adults').value);
        var children = parseInt(document.getElementById('children').value);
        var infants = parseInt(document.getElementById('infants').value);

        var selectedRoom = document.getElementById('room-type').value;
        var roomSurcharge = ROOM_SURCHARGES[selectedRoom] || 0;

        var baseTotal = BASE_PRICE * adults + (BASE_PRICE * 0.75 * children);
        baseTotal += roomSurcharge;

        var discount = baseTotal * DISCOUNT_RATE;

        var addOnsCost = 0;
        if (document.getElementById('travel-insurance').checked) {
            addOnsCost += ADDON_COSTS['travel-insurance'] * (adults + children);
        }
        if (document.getElementById('private-transfers').checked) {
            addOnsCost += ADDON_COSTS['private-transfers'];
        }
        if (document.getElementById('photography-session').checked) {
            addOnsCost += ADDON_COSTS['photography-session'];
        }

        var totalAmount = baseTotal - discount + addOnsCost;

        var priceRows = document.getElementsByClassName('price-row');
        var summaryText = 'Base Price (' + adults + ' Adult' + (adults > 1 ? 's' : '') +
            (children > 0 ? ' + ' + children + ' Child' + (children > 1 ? 'ren' : '') : '') + ')';

        priceRows[0].innerHTML = '<span>' + summaryText + '</span><span>₹' + baseTotal.toLocaleString('en-IN') + '</span>';
        priceRows[1].innerHTML = '<span>Early Bird Discount (15%)</span><span>-₹' + Math.round(discount).toLocaleString('en-IN') + '</span>';
        priceRows[2].innerHTML = '<span>Add-ons</span><span>₹' + addOnsCost.toLocaleString('en-IN') + '</span>';
        priceRows[3].innerHTML = '<span>Total Amount</span><span>₹' + totalAmount.toLocaleString('en-IN') + '</span>';

        var fullLabel = document.getElementById('full-payment-label');
        var partialLabel = document.getElementById('partial-payment-label');
        if (fullLabel && partialLabel) {
            fullLabel.innerHTML = 'Pay in Full (₹' + totalAmount.toLocaleString('en-IN') + ')';
            partialLabel.innerHTML = 'Pay Deposit (₹' + Math.round(totalAmount * 0.3).toLocaleString('en-IN') + ' now, remaining 30 days before departure)';
        }
    }

    // Booking form submission
    document.getElementById('santorini-booking').addEventListener('submit', function (e) {
        e.preventDefault();

        var fullName = document.getElementById('full-name').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var departureDate = document.getElementById('departure-date').value;
        var departureCity = document.getElementById('departure-city').value;

        if (!fullName || !email || !phone || !departureDate || !departureCity) {
            alert('Please fill in all required fields');
            return;
        }

        if (!document.getElementById('terms-conditions').checked) {
            alert('Please agree to the Terms & Conditions to proceed');
            return;
        }

        alert('Booking submitted successfully! You will be redirected to the payment page.');
        // window.location.href = 'payment.html';
    });

    // Initialize prices on load
    updatePriceSummary();

    // Auto-open Day 1
    if (dayHeaders.length > 0) {
        dayHeaders[0].click();
    }

    // Smooth scroll for internal links
    var allAnchors = document.getElementsByTagName('a');
    for (var i = 0; i < allAnchors.length; i++) {
        var anchor = allAnchors[i];
        var href = anchor.getAttribute('href');
        if (href && href.charAt(0) === '#') {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                var targetId = this.getAttribute('href').substring(1);
                var targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    // Highlight current nav link
    var currentPage = window.location.pathname.split('/').pop();
    var navLinks = document.getElementsByTagName('a');
    for (var i = 0; i < navLinks.length; i++) {
        var linkHref = navLinks[i].getAttribute('href');
        if (linkHref === currentPage) {
            navLinks[i].style.color = '#0073e6';
            navLinks[i].style.fontWeight = 'bold';
        }
    }
});
