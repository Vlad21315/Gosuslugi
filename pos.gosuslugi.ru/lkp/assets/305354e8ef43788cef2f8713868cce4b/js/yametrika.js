/**
 * YAMETRIKA
 */
let YAMETRIKA = function () {
    return {
        /**
         * Обработка событий после ready.
         */
        onReady: function () {
            ym(yaMetrikaId, 'userParams', yaMetrikaUser);

            $(document).on('click', '[data-ya-event]', function (e) {
                YAMETRIKA.fire($(this).data('ya-event'), $(this).data('ya-event-params') ? $(this).data('ya-event-params') : {});
            })

            $(document).on('click', 'a[data-ya-event-g]', function (e) {
                YAMETRIKA.fire(yaMetrikaUser.guest ? $(this).data('ya-event-g') + '_guest' : $(this).data('ya-event-g'))
            })

            if ($('form#auth-finish-redirect-form').length > 0) {
                YAMETRIKA.fire('lkp_login_success');
                $('form#auth-finish-redirect-form').submit();
            }
        },

        /**
         * Обработка событий после load.
         */
        onLoad: function () {
        },


        fire: function (event, params = {}) {
            if (typeof yaMetrikaId === 'number') {
                console.info('fire: ' + event, params);
                ym(yaMetrikaId, 'reachGoal', event, params);
            }
        },


        fireOnClose: function (event, params = {}) {

            $(window).on('mouseover', removeFireEvent);
            $(window).on('mouseout', addFireEvent);

            function fireEvent() {
                YAMETRIKA.fire(event, params);
            }

            function removeFireEvent() {
                // console.info('remove beforeunload fireEvent');
                window.removeEventListener('beforeunload', fireEvent)
            }

            function addFireEvent() {
                // console.info('add beforeunload fireEvent');
                window.addEventListener('beforeunload', fireEvent)
            }

            var prevKey = "";
            $(document).keydown(function (e) {
                // console.info(e.key);
                if (e.key == "F5") {
                    removeFireEvent()
                } else if (e.key.toUpperCase() == "W" && prevKey == "CONTROL") {
                    removeFireEvent()
                } else if (e.key.toUpperCase() == "R" && prevKey == "CONTROL") {
                    removeFireEvent()
                } else if (e.key.toUpperCase() == "F4" && (prevKey == "ALT" || prevKey == "CONTROL")) {
                    removeFireEvent()
                }
                prevKey = e.key.toUpperCase();
            });
        },

    }

}();

(function ($) {
    /**
     * DOM-ready.
     */
    $(document).ready(function () {
        YAMETRIKA.onReady();
    });

    /**
     * DOM-load.
     */
    $(window).on("load", function () {
        YAMETRIKA.onLoad();
    });

})(jQuery);