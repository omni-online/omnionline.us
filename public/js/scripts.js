(function ($, doc, global) {
    "use strict";
    
    /**
     * Parallax handler. Registers a new parallax item.
     * @param {Element} el - The javascript element.
     * @param {Number} depth - The depth for the item.
     */
    var Parallax = function (el) {
        
        this.el = el;
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
                near = parseInt(this.el.getAttribute('data-near') || "1", 10),
                style = "z-index: " + near + "; margin-left: " + (x * -near) + "px; margin-bottom: " + (y * -near) + "px;";
            
            this.el.setAttribute('style', style);
        }
    };
    
    var ps = [],
        i,
        pels = doc.querySelectorAll('.parallax');
    
    for (i = 0; i < pels.length; i += 1) {
        ps.push(new Parallax(pels[i]));
    }
    
    global.ps = ps;

}(jQuery, document, window));