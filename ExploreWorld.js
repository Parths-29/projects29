window.onload = function () {
    // Main app object
    var ExploreWorldApp = {
        init: function () {
            this.cacheDOM();
            this.bindEvents();
            this.setupThemeToggle();
        },

        cacheDOM: function () {
            this.accordionItems = document.getElementsByClassName('accordion-item');
            this.newsletterForm = document.getElementsByClassName('newsletter-form')[0];
            this.emailInput = this.newsletterForm.getElementsByTagName('input')[0];
            this.searchInput = document.getElementsByTagName('input')[0]; // assumes it's the first input (search bar)
            this.searchButton = document.getElementsByTagName('button')[0]; // assumes it's the first button (search)
            this.destinationCards = document.getElementsByClassName('destination-card');
            this.headerTitle = document.getElementsByTagName('h1')[0];
        },

        bindEvents: function () {
            // Accordion toggle
            for (var i = 0; i < this.accordionItems.length; i++) {
                var header = this.accordionItems[i].getElementsByClassName('accordion-header')[0];
                if (header) {
                    var self = this;
                    header.addEventListener('click', (function (item) {
                        return function () {
                            self.toggleAccordion(item);
                        };
                    })(this.accordionItems[i]));
                }
            }

            // Newsletter events
            if (this.newsletterForm) {
                var self = this;
                this.emailInput.addEventListener('blur', function () {
                    self.validateEmail(this);
                });
                this.newsletterForm.addEventListener('reset', this.resetForm);
                this.newsletterForm.addEventListener('submit', this.handleSubscription);
            }

            // Search events
            if (this.searchInput && this.searchButton) {
                var self = this;
                this.searchInput.addEventListener('input', function () {
                    clearTimeout(self.searchTimeout);
                    var value = this.value.toLowerCase().trim();
                    self.searchTimeout = setTimeout(function () {
                        if (value.length > 2) self.performSearch(value);
                    }, 300);
                });

                this.searchButton.addEventListener('click', function () {
                    var value = self.searchInput.value.toLowerCase().trim();
                    self.performSearch(value);
                });
            }

            // Destination cards hover and click
            for (var i = 0; i < this.destinationCards.length; i++) {
                this.destinationCards[i].addEventListener('mouseover', this.animateCard);
                this.destinationCards[i].addEventListener('mouseout', this.resetCard);
            }

            window.addEventListener('scroll', this.scrollHandler);
        },

        toggleAccordion: function (item) {
            item.classList.toggle('active');
            for (var i = 0; i < this.accordionItems.length; i++) {
                if (this.accordionItems[i] !== item) {
                    this.accordionItems[i].classList.remove('active');
                }
            }
        },

        validateEmail: function (input) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.style.borderColor = 'red';
                input.setAttribute('title', 'Please enter a valid email address');
            } else {
                input.style.borderColor = 'green';
                input.removeAttribute('title');
            }
        },

        resetForm: function () {
            var emailInput = this.getElementsByTagName('input')[0];
            emailInput.style.borderColor = '';
            emailInput.removeAttribute('title');
        },

        handleSubscription: function (e) {
            e.preventDefault();
            var emailInput = this.getElementsByTagName('input')[0];
            if (emailInput.value) {
                alert('Thank you for subscribing with ' + emailInput.value);
                emailInput.value = '';
                emailInput.style.borderColor = '';
            }
        },

        performSearch: function (term) {
            for (var i = 0; i < this.destinationCards.length; i++) {
                var text = this.destinationCards[i].textContent.toLowerCase();
                this.destinationCards[i].style.display = text.indexOf(term) > -1 ? 'block' : 'none';
            }
        },

        animateCard: function () {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        },

        resetCard: function () {
            this.style.transform = 'scale(1)';
        },

        scrollHandler: function () {
            var nav = document.getElementsByTagName('nav')[0];
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        },

        setupThemeToggle: function () {
            var btn = document.createElement('button');
            btn.innerText = '🌓 Theme';
            btn.className = 'theme-toggle';
            btn.onclick = this.toggleTheme;

            var nav = document.getElementsByTagName('nav')[0];
            if (nav) nav.appendChild(btn);
        },

        toggleTheme: function () {
            var isDark = document.body.classList.toggle('dark-theme');
            alert('Theme changed to ' + (isDark ? 'Dark' : 'Light'));
        }
    };

    ExploreWorldApp.init();
};
