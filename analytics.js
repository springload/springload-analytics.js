/**
 * Analytics.js
 * http://springload.co.nz/
 *
 * Copyright 2015, Springload
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.GA = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = (root.GA = factory());
    } else {
        // Browser globals
        root.GA = factory();
    }
}(typeof global !== 'undefined' ? global : this.window || this.global, function () {
    "use strict";

    var GA = {
        // Modifiable options
        options: {
            // The default category - the document uri
            default_category: "/" + document.location.pathname.substr(1),
            // The default action
            default_action: "Click",
            // The default attribute, event and element that will be used for the trackable events
            default_trackable_attribute: "analytics",
            default_trackable_event: "click",
            default_trackable_element: "a",
            // The default label attribute
            default_label_attribute: "href",
            // The default separator to use within the analytics attribute
            default_separator: "|",
            // Available default categories
            categories: {
                footer: "Footer",
                nav: "Navigation",
                ui_element: "UI element"
            },
            // Available default actions
            actions: {
                interaction: "Interaction"
            }
        },
        /**
         * Track an event with Google Analytics
         * @param category - The category for GA
         * @param action - The action for GA
         * @param label - The label for GA
         * @param value - The value for GA
         */
        event: function (category, action, label, value) {
            var self = this;
            category = category || self.options.default_category;
            action = action || self.options.default_action;
            if (typeof window._gaq === "object") {
                window._gaq.push(["_trackEvent", category, action, label, value]);
            } else if (typeof window.ga === "function") {
                window.ga('send', 'event', category, action, label, value);
            }
        },
        /**
         * Initialise the analytics module.
         * @param options
         */
        init: function (options) {
            var self = this;
            self.options = self.extend(self.options, options);
            self.setupTrackables(self.options.default_trackable_attribute, self.options.default_trackable_event, self.options.default_trackable_element, self.options.default_label_attribute);
        },
        /**
         * Deep extend object
         * @param out
         * @returns {*}
         */
        extend: function(out) {
            out = out || {};
            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];
                if (!obj) {
                    continue;
                }
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            this.extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
            return out;
        },
        /**
         * on event handler
         * @param element
         * @param name
         * @param callback
         */
        on:  function (element, name, callback) {
            if ("addEventListener" in window) {
                element.addEventListener(name, callback, false);
            } else if ("attachEvent" in window){
                element.attachEvent("on" + name, function anon() {
                    callback.call(element);
                });
            } else {
                element["on" + name] = function anon() {
                    callback.call(element);
                };
            }
        },
        /**
         * Select any elements that match the selectors
         * @param trackable_attribute
         * @param trackable_element
         * @returns {NodeList}
         */
        selectElements: function(trackable_attribute, trackable_element) {
            return document.querySelectorAll("[data-" + trackable_attribute + "] " + trackable_element + ", " + trackable_element + "[data-" + trackable_attribute + "]");
        },
        /**
         * Find the closest parent element with an trackable attribute set on it and return the value of that attribute
         * @param element
         * @param trackable_attribute
         * @returns {string}
         */
        getParentElementTrackingData: function(element, trackable_attribute) {
            var parent = element.parentNode,
                tracking_data = "",
                parent_tracking_data;
            while (parent !== null) {
                var current_parent = parent;
                if (current_parent.hasAttribute("data-" + trackable_attribute)) {
                    parent_tracking_data = current_parent.getAttribute("data-" + trackable_attribute);
                    if (parent_tracking_data !== null) {
                        tracking_data = parent_tracking_data;
                    }
                    parent = null;
                } else {
                    parent = current_parent.parentNode;
                }
            }
            return tracking_data;
        },
        /**
         * Define the trackable elements and set the event handlers on them
         * @param trackable_attribute
         * @param trackable_event
         * @param trackable_element
         * @param label_attribute
         */
        setupTrackables: function (trackable_attribute, trackable_event, trackable_element, label_attribute) {
            // Only supporting modern browsers for selection
            if (document.querySelectorAll) {
                var self = this,
                    elements = self.selectElements(trackable_attribute, trackable_element),
                    i = 0;
                for (i; i < elements.length; i++) {
                    (function(el) {
                        var params = el.getAttribute("data-" + trackable_attribute),
                            category = null,
                            action = null,
                            label = el.getAttribute(label_attribute),
                            value = null;
                        // Check for a category on a parent element
                        if (params === null) {
                            params = self.getParentElementTrackingData(el, trackable_attribute);
                        }
                        // Grab the values from the data attribute
                        params = params.split(self.options.default_separator);
                        // Set the event tracking variables
                        category = params[0] !== undefined && params[0] !== '' ? params[0] : undefined;
                        action = params[1] !== undefined && params[1] !== '' ? params[1] : undefined;
                        label = params[2] !== undefined && params[2] !== '' ? params[2] : label;
                        value = params[3] !== undefined && params[3] !== '' ? params[3] : undefined;
                        self.on(el, trackable_event, function() {
                            // Fire off the event
                            self.event(category, action, label, value);
                        });
                    })(elements[i]);
                }
            }
        }
    };

    return {
        /**
         * Track an event.
         * @param label
         * @param category
         * @param action
         * @param value
         */
        track: function (label, category, action, value) {
            GA.event(category, action, label, value);
        },
        /**
         * Initialise the module
         * @param options
         */
        init: function (options) {
            GA.init(options);
        },
        /**
         * Setup additional trackable elements on the fly after initialisation
         * @param trackable_attribute data attribute
         * @param trackable_event event type. e.g. mouseenter
         * @param trackable_element - e.g. span
         * @param label_attribute - where the default label is ready from. e.g. data-label
         */
        setupTrackables: function (trackable_attribute, trackable_event, trackable_element, label_attribute) {
            GA.setupTrackables(trackable_attribute, trackable_event, trackable_element, label_attribute);
        },
        // Categories
        cat: GA.options.categories,
        // Actions
        act: GA.options.actions
    };
}));
