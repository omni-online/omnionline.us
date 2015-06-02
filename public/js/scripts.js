(function ($, doc, global) {
    "use strict";
    
    /**
     * Just some utilities.
     */
    var utils = {
        showContactForm: function () {
            $('html, body').animate({ scrollTop: 0 });
        },
        emailContactForm: function (data) {
            $.ajax({
                type: "POST",
                url: "/email",
                dataType:"json",
                data: data,
                success: function (res) {
                    alert('Message successfully sent!');
                },
                error: function (err) {
                    alert('Uh oh! An error occurred. Please try again later.');
                    console.error(err);
                }
            })
        }
    };
    
    /**
     * Parallax handler. Registers a new parallax item.
     * @param {Element} el - The javascript element.
     * @param {Number} depth - The depth for the item.
     */
    var Parallax = function (el) {
        
        this.el = el;
        this.near = parseInt(this.el.getAttribute('data-near') || "1", 10);
        doc.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.handleMouseMove({
            clientX: 0,
            clientY: 0
        });
    };
    
    Parallax.prototype = {
        handleMouseMove: function (e) {
            var x = (e.clientX / global.innerWidth) * 2 - 1,
                y = (e.clientY / global.innerHeight) * -2 + 1,
                style = "z-index: " + this.near + "; margin-left: " + (x * -this.near) + "px; margin-bottom: " + (y * -this.near) + "px;";
            
            this.el.setAttribute('style', style);
        }
    };
    
    // Setting up parallax views
    var ps = [],
        i,
        pels = doc.querySelectorAll('.parallax');
    
    for (i = 0; i < pels.length; i += 1) {
        ps.push(new Parallax(pels[i]));
    }
    
    // add click handlers
    doc.querySelector('body').addEventListener('click', function (e) {
        var el = e.target;
        do {
            if (!el || !el.classList || !el.classList.contains('formLink')) {
                continue;
            }
            e.preventDefault();
            utils.showContactForm();
        } while (el = el.parentNode);
        
        return;
    });
    
    // add listener to email
    var contacts = doc.querySelectorAll('form.contact-us');
    for (i = 0; i < contacts.length; i += 1) {
        contacts[i].addEventListener('submit', function (e) {
            e.preventDefault();
            var data = {}, i;
            for (i = 0; i < e.target.length; i += 1) {
                if (e.target[i].id && e.target[i].value) {
                    data[e.target[i].id] = e.target[i].value;
                }
            }
            
            utils.emailContactForm(data);
        });
    }
    
    // show that form and keep scroll location.
    doc.querySelector('.contact-form').setAttribute('style', 'display: block');
    $('html, body').scrollTop($('.intro').first().offset().top);

}(jQuery, document, window));