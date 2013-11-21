/**
 * Analytics
 * ------------------------------------------------------------------------
 * Usage in markup examples:
 * - Wrap a group of links with a data-analytics tag
 *  <div data-analytics> - will use the default category, action and the default label (href)
 *  to track any a tag that falls within that block
 *
 *  - Wrap a group of links and give them custom category,action, or label
 *  <div data-analytics='[Custom category]'> Will track as [Custom category], [Default action], [Default label]
 *  or define an action and label as well
 *  <div data-analytics='[Custom category]|[Custom action]|[Custom label]'>
 *  or specify just a custom label
 *  <div data-analytics='||[Custom label]'>
 *  or specify just a custom action
 *  <data data-analytics='|[Custom action]'>
 *
 * - Use in the same way on individual a tags if you want more detailed tracking e.g.
 * <a data-analytics='||Custom Label'> - Will track as [Default category], [Default action], [Custom label]
 *
 */
var GA = (function () {

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

            $.extend(true, self.options, options);

            self.setupTrackables();

        },

        setupTrackables: function (trackable_attribute, trackable_event, trackable_element, label_attribute) {

            var self = this;

            //setup default if needed
            trackable_attribute = trackable_attribute || self.options.default_trackable_attribute;
            trackable_event = trackable_event || self.options.default_trackable_event;
            trackable_element = trackable_element || self.options.default_trackable_element;
            label_attribute = label_attribute || self.options.default_label_attribute;

            // Get all the trackable elements
            var $elems = $("[data-" + trackable_attribute + "] " + trackable_element + ", " + trackable_element + "[data-" + trackable_attribute + "]");

            $elems.each(function () {

                var $elem = $(this),
                    params = $elem.data(trackable_attribute),
                    category = undefined,
                    action = undefined,
                    label = $elem.attr(label_attribute),
                    value = undefined;

                // Check for a category on a parent element
                if (params === undefined) {
                    params = $elem.parents("[data-" + trackable_attribute + "]").data(trackable_attribute);
                }

                // Grab the values from the data attribute
                params = params.split(self.options.default_separator);

                // Set the event tracking variables
                category = params[0] !== undefined && params[0] !== '' ? params[0] : undefined;
                action = params[1] !== undefined && params[1] !== '' ? params[1] : undefined;
                label = params[2] !== undefined && params[2] !== '' ? params[2] : label;
                value = params[3] !== undefined && params[3] !== '' ? params[3] : undefined;

                // Register the event handler
                $elem.on(trackable_event, function () {

                    // Fire off the event
                    self.event(category, action, label, value);

                });

            });

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

})();