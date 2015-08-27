/* global console, window, module, define, jQuery, require */
/*
 * Navinator v0.1.0
 * https://github.com/gsmke/navinator
 */

;(function(factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';

    var Navinator = window.Navinator || {};

    Navinator = (function () {
        function Navinator(element, settings) {

            var _ = this;
            _.defaults = {
                buttonElement: '#navinator-button',
                debug: false,
                direction: 'left',
                minWidth: 0,
                pageElement: '#page-container',
                subNavElement: false
            };

            _.options = $.extend({}, _.defaults, settings);

            // Navinator Globals
            _.el = element;
            _.$navElement = $(element);
            _.$pageElement = $(_.options.pageElement);
            _.$buttonElement = $(_.options.buttonElement);
            _.navCreated = false;
            if (_.options.subNavElement) {
                var subNavClassOrID = _.options.subNavElement.charAt(0);
                var subNavEl = _.options.subNavElement.substring(1);
                _.subNav = subNavClassOrID + 'navinator-' + subNavEl;
            } else {
                _.subNav = _.options.subNavElement;
            }

            // Check if the page wrapper and button elements are present
            if (_.$pageElement.length === 0 && _.options.debug) {
                console.error('%cNavinator Error: pageElement doesn\'t exist', 'font-weight: bold');
            } else if (_.$buttonElement.length === 0 && _.options.debug) {
                console.error('%cNavinator Error: buttonElement doesn\'t exist', 'font-weight: bold');
            } else if (_.$pageElement.length !== 0 && _.$buttonElement.length !== 0) {
                _.init();
            }
        }

        return Navinator;

    }());

    // Changes the classnames and IDs on the HTML to be cloned. Prevents CSS conflicts.
    Navinator.prototype.addPrefix = function($el) {

        $el.find('*').each(function (index, el) {
            var $el = $(el);

            var elementId = $el.attr('id'),
                elementClass = $el.attr('class');

            if (typeof elementId === 'string' && '' !== elementId) {
                $el.attr('id', elementId.replace(/([A-Za-z0-9_.\-]+)/g, 'navinator-$1'));
            }
            if (typeof elementClass === 'string' && '' !== elementClass) {
                $el.attr('class', elementClass.replace(/([A-Za-z0-9_.\-]+)/g, 'navinator-$1'));
            }
        });

    };

    // Create the new Nav
    Navinator.prototype.create = function () {

        var _ = this;

        if (!_.navCreated) {
            $('body').append('<div id="navinator-menu"></div>');
            _.$navElement.clone().appendTo($('#navinator-menu'));
            _.addPrefix($('#navinator-menu'));

            // Check options
            if (_.options.direction === 'right') {
                _.$pageElement.css('right', 0);
            } else {
                _.$pageElement.css('left', 0);
            }

            _.$buttonElement.click(function (ev) {
                ev.preventDefault();
                _.menuToggle();
            });

            _.$navElement.hide();
            _.$buttonElement.show();

            if (!_.$pageElement.hasClass('navinator-initialized')) {
                _.$pageElement.addClass('navinator-initialized');
                if (_.options.debug) {
                    console.log('%cNavinator Initialized!', 'font-size: 1.1em; font-weight: bold; color: green');
                }
            }

            // Check for sub navigation
            if (_.subNav) {
                $(_.subNav).hide();
                $(_.subNav).each(function (index, element) {
                    var $parentLink = $(element).prev();
                    var $parentEl = $(this).parent();
                    $parentEl.addClass('navinator-has-subnav');
                    $parentLink.on('click.subNavToggle', function (ev) {
                        ev.preventDefault();
                        var $parentEl = $(this).parent();
                        $parentEl.toggleClass('navinator-sub-open');
                        $(_.subNav, $parentEl).slideToggle(500);
                    });
                });
            }

            _.navCreated = true;
        }

    };

    // Destory the new Nav
    Navinator.prototype.destroy = function () {

        var _ = this;

        if (_.navCreated) {
            $('html').removeClass('navinator-open');
            $('#navinator-menu').remove();

            _.$navElement.show();
            _.$buttonElement.hide();

            _.$pageElement.removeClass('navinator-initialized').removeAttr('style');
            if (_.options.debug) {
                console.log('%cNavinator Destroyed!', 'font-weight: bold; color: orange');
            }

            _.navCreated = false;
        }

    };

    // Update widths based on the window size
    Navinator.prototype.updateMeasurements = function () {

        var _ = this;
        var $win = $(window);

        _.winWidths[0].winWidth = $win.width();
        _.winWidths[0].openWidth = $win.width() - 50;
        _.winWidths[0].viewWidth = window.outerWidth;
        _.winWidths[0].winHeight = $win.height();

        _.$pageElement
            .width(_.winWidths[0].winWidth)
            .css('min-height', _.winWidths[0].winHeight);

        if ($('html').hasClass('navinator-open')) {
            if (_.options.direction === 'right') {
                _.$pageElement.css('right', -_.winWidths[0].openWidth);
            } else {
                _.$pageElement.css('left', -_.winWidths[0].openWidth);
            }
        }

    };

    // Open/Close the Nav
    Navinator.prototype.menuToggle = function () {

        var _ = this;

        if ($('html').hasClass('navinator-open')) {
            // Close Menu
            if (_.options.direction === 'right') {
                _.$pageElement.css('right', 0);
            } else {
                _.$pageElement.css('left', 0);
            }
            $('html').removeClass('navinator-open');
        } else {
            // Open Menu
            if (_.options.direction === 'right') {
                _.$pageElement.css('right', -_.winWidths[0].openWidth);
            } else {
                _.$pageElement.css('left', -_.winWidths[0].openWidth);
            }
            $('html').addClass('navinator-open');
        }

    };

    // Initial the nav
    Navinator.prototype.init = function () {

        var _ = this;

        _.winWidths = [];
        _.winWidths.push({
            'winWidth': 0,
            'winHeight': 0,
            'openWidth': 0,
            'viewWidth': 0
        });

        _.$buttonElement.hide();

        _.resizeWindow = function () {
            _.updateMeasurements();

            // If set, minWidth shows/hides the nav based on the size of the browser
            // If minWidth not set, nav will always show
            if (_.options.minWidth >= _.winWidths[0].viewWidth || _.options.minWidth === 0) {
                _.create();
            } else {
                _.destroy();
            }
        };

        // Run function on window resize
        $(window).resize(_.resizeWindow);

        // Update measurements after window loads
        $(window).load(function () {
            _.resizeWindow();
        });

        // Run function the first time
        _.resizeWindow();

    };

    // jQuery Plugin
    $.fn.navinator = function (options) {

        var _ = this;

        return _.each(function (index, element) {
            element.navinator = new Navinator(element, options);
        });

    };
}));
