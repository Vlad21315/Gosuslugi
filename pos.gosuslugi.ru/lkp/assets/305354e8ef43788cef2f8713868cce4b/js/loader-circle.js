(function ($) {
    'use strict';
    /**
     * DOM-ready.
     */
    $(document).ready(function () {
        LoaderCircle.init();
    });

})(jQuery);

/**
 * Проект.
 */
let LoaderCircle = function () {
    'use strict';

    return {
        /**
         * Обработка событий.
         */
        init: function () {
            this.bindEvents();
        },

        /**
         * @return {undefined}
         */
        bindEvents: function () {
            $(document).on('ready pjax:send', '.play_loader', function (event) {
                if (this == event.target) {
                    LoaderCircle.showLoader(this);
                }
            });

            $(document).on('ready pjax:complete', '.play_loader', function (event) {
                if (this == event.target) {
                    LoaderCircle.hideLoader(this);
                }
            });

            $("form.play_loader").submit(function () {
                LoaderCircle.showLoader(this);
                return true;
            });
        },

        /**
         * Показ лоадера
         */
        showLoader: function (element) {
            NProgress.start();
        },

        /**
         * Скрытие лоадера
         */
        hideLoader: function (element) {
            NProgress.done();
        },

    }

}();