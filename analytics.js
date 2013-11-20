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

        // The default category - the document uri
        default_category: "/" + document.location.pathname.substr(1),

        // The default action
        default_action: "Click",
        
        // The default attribute, event and element that will be used for the trackable events
        default_trackable_attribute: 'analytics',
        default_trackable_event: 'click',
        default_trackable_element: 'a',

        // The default separator to use within the analytics attribute
        separator: "|",

        // Available default categories
        categories: {
            footer:         "Footer",
            nav:            "Navigation",
            ui_element:     "UI element"
        },

        // Available default actions
        actions: {
            interaction:    "Interaction"
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

            category = category ||self.default_category;
            action = action || self.default_action;

            if (typeof window._gaq === "object") {
                window._gaq.push(["_trackEvent", category, action, label, value]);
            } else if (typeof window.ga === "function") {
                window.ga('send', 'event', category, action, label, value);
            }
        },

        /**
         * Shorthand to track an event, taking the label as the first parameter.
         * This can be used when using the default category and action
         * @param label
         * @param category
         * @param action
         * @param value
         */
        link: function (label, category, action, value) {
            this.event(category, action, label, value);
        },

        /**
         * Initialise the analytics module.
         * @param options
         */
        init: function(options) {
            var self = this;
            $.extend(true, this, options);
            
            setupTrackables();
        },

        setupTrackables: function(trackable_attribute, trackable_event, trackable_element){
            var self = this;
            
            //setup default if needed
            trackable_attribute = trackable_attribute || self.default_trackable_attribute;
            trackable_event = trackable_event || self.default_trackable_event;
            trackable_element = trackable_element || self.default_trackable_element;
            
            // Get all the trackable elements
            var $elems = $("[data-"+trackable_attribute+"] "+trackable_element+", "+trackable_element+"[data-"+trackable_attribute+"]");

            $elems.each(function() {

                var $elem = $(this),
                    params  = $elem.data(trackable_attribute),
                    category = undefined,
                    action = undefined,
                    label = $elem.attr("href");

                // Check for a category on a parent element
                if (params === undefined) {
                    params = $elem.parents("[data-"+trackable_attribute+"]").data(trackable_attribute);
                }

                // Grab the values from the data attribute
                params = params.split(self.separator);
                category = params[0] !== undefined && params[0] !== '' ? params[0] : undefined;
                action = params[1] !== undefined && params[1] !== '' ? params[1] : undefined;
                label = params[2] !== undefined && params[2] !== '' ? params[2] : label;

                // Register the event handler
                $elem.on(trackable_event, function() {

                    // Fire off the event
                    self.event(category, action, label);

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
        init: function(options) {
            GA.init(options);
        },
        
        //setup flexible trackables
        setupTrackables: function(trackable_attribute, trackable_event, trackable_element){
        	GA.setupTrackables(trackable_attribute, trackable_event, trackable_element);
        },

        // Categories
        cat: GA.categories,

        // Actions
        act: GA.actions

    };

})();
