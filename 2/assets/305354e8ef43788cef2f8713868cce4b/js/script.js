/**
 * Project
 */
let PROJECT = function () {
    return {
        /**
         * Обработка событий после ready.
         */
        onReady: function () {
            this.bindEvent();
            this.cookieHide();
            this.mobilePopupHide();
            this.initJsCustomDatepicker();
        },

        /**
         * Обработка событий после load.
         */
        onLoad: function () {
        },


        cookieHide: function () {
            let hideClass = 'js_hide';
            let cookieBlock = document.querySelector('.js_cookie_block');
            let button = document.querySelector('.js_cookie_block .js_btn');

            if (cookieBlock && button) {
                if (localStorage.getItem('i_agree_cookie') !== 'yes') {
                    cookieBlock.classList.remove(hideClass);
                }

                document.body.classList.add('page-body--cookie');

                button.addEventListener('click', function () {
                    cookieBlock.classList.add(hideClass);
                    document.body.classList.remove('page-body--cookie');
                    let expires = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                    localStorage.setItem('i_agree_cookie', 'yes');
                });
            }
        },

        mobilePopupHide: function () {
            let hideClass = 'js_hide';
            let popupBlock = document.querySelector('.js-download-block');
            let button = document.querySelector('.js-download-block .js-popup__close-btn');

            if (popupBlock && button) {
                if (localStorage.getItem('mobile_popup') !== 'yes') {
                    popupBlock.classList.remove(hideClass);
                }

                button.addEventListener('click', function () {
                    popupBlock.classList.add(hideClass);
                    localStorage.setItem('mobile_popup', 'yes');
                });
            }
        },


        bindEvent: function () {

            $(document).one('click', '.js-click-me-once', function (e) {
                e.preventDefault();
                console.info($(this).data('href'));
                window.location.href = $(this).data('href');
            })

            $(document).on('click', '#news-subscribe-block .social__link', function (e) {
                e.preventDefault();
                let form = $(this).parents('form');
                let wrap = $('#news-subscribe-block');
                let loaderContainer = wrap;

                LoaderCircle.showLoader(loaderContainer);

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    dataType: 'json',
                    cache: false,
                    data: form.serializeArray(),
                    success: function (data) {
                        if (data.result == 1) {
                            new Noty({
                                type: 'success',
                                text: data.message,
                            }).show();

                            let link = wrap.find('.social__link');

                            if (link.hasClass('social__link--subscribe')) {
                                link.removeClass('social__link--subscribe').addClass('social__link--unsubscribe');
                                wrap.find('.social__link-text').text('Отписаться');
                                wrap.find('input[name=type]').val(0);
                            } else {
                                link.removeClass('social__link--unsubscribe').addClass('social__link--subscribe');
                                wrap.find('.social__link-text').text('Подписаться');
                                wrap.find('input[name=type]').val(1);
                            }
                        } else {
                            new Noty({
                                type: 'error',
                                text: data.message,
                            }).show();
                        }

                    },
                    error: function () {
                        new Noty({
                            type: 'error',
                            text: 'Возникла серверная ошибка'
                        }).show();
                    },
                    complete: function () {
                        LoaderCircle.hideLoader(loaderContainer);
                    }
                });
            });

            this.initProjectEvent();

            $(document).on('click', '.js-send-unvote-form', function (e) {
                e.preventDefault();
                let form = $('#project-unvote-form');
                form.submit();
            });

            $(document).on('change', '.js-send-parent-form', function (e) {
                let form = $(this).parents('form');
                form.submit();
                e.preventDefault();
            });

            $(document).on('change', '#projects_pjax #category-select', function (e) {
                let url = $(this).find(':selected').data('url');
                let form = $(this).parents('form');
                form.attr('action', url);
                form.submit();
                e.preventDefault();
            });

            $(document).on('submit', '.poll-form', function (e) {
                e.preventDefault();
                let form = $(this);
                let wrap = form.parents('.poll-widget');
                let button = form.find(':input[type=submit]');
                button.prop('disabled', true);

                LoaderCircle.showLoader(wrap);

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    dataType: 'json',
                    cache: false,
                    data: form.serializeArray(),
                    success: function (data) {
                        PROJECT.showToast(data.message);
                        if (data.result == 1) {
                            let widget = $(data.widget);
                            wrap.replaceWith(widget);
                            wrap = widget;
                            let wrapId = wrap.attr('id');

                            document.querySelectorAll('#' + wrapId + ' .js-poll-range').forEach(function (item) {
                                initRangeSlider(item);
                            });

                            initChoices();
                            initOtherChecboxes();
                            initOtherRadios();
                            initOtherDropdown();
                            initJsDatepicker();
                            PROJECT.initJsCustomDatepicker();
                            if (typeof pollMarketplacePo !== 'undefined') {
                                pollMarketplacePo.init()
                            }
                            window.customSelect.init();
                            form.trigger("reset");

                        }
                        LoaderCircle.hideLoader(wrap);
                        button.prop('disabled', false);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        let message = 'Возникла серверная ошибка';
                        if (jqXHR.status === 400) {
                            message = 'Ошибка в отправке. Обновите страницу и попробуйте повторно';
                        } else if (jqXHR.status === 403) {
                            message = 'Сессия устарела. Обновите страницу и попробуйте повторно';
                        }

                        PROJECT.showToast({error: message});

                        LoaderCircle.hideLoader(wrap);
                        button.prop('disabled', false);
                    }
                });
            });

            $(document).on('click', '.js-open-table-popup', function (e) {
                e.preventDefault();
                let popup = $('#js-table-popup');
                let content = $(this).parents('.discussion-item__content--table').find('.table-hide');
                popup.find('.table-fixed').html(content.html());
                window.openPopup(document.getElementById(popup.attr('id')));
            });




            $(document).on('click', '.js-click-submit', function (e) {
                let that = $(this);
                let value = that.data('value');
                let name = that.data('name');
                let form = that.parents('form');

                $('<input>').attr({type: 'hidden', name: name, value: value}).appendTo(form);
                form.submit();
                e.preventDefault();
            });

            $(document).on('click', '.js-visually-impaired-version, .js-visually-impaired-reset', function (e) {
                //получаем актуальное состояние настроек для слабовидяших
                let state = PROJECT.getVisuallyImpairedState();

                let isDefaultState = true; // состояние настроек эквивалентно состоянию по умолчанию
                for (let key in state) {
                    let value = state[key];
                    if (isDefaultState && value !== 'default') {
                        isDefaultState = false;
                    }
                }

                //блокируем кнопку сброса настрек если они не были изменены
                $('.js-special-popup__reset').attr('disabled', isDefaultState);

                // сохраняем настройки в куки
                let expires = new Date(Date.now() + (365 * 24 * 60 * 60 * 1000));
                document.cookie = "visually-impaired-data=" + JSON.stringify(state) + "; expires=" + expires.toUTCString() + "; path=/";
            });

            $(document).on('click', '.js-change-favorite', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let that = $(this);
                let data = that.data('params') || {};
                let loaderContainer = null;
                let favoriteActiveClass = 'button-star--active';
                let closestWrapper = that.data('closest-wrapper');
                if (that.parents(closestWrapper).length > 0) {
                    loaderContainer = that.parents(closestWrapper);
                }
                if (loaderContainer) {
                    LoaderCircle.showLoader(loaderContainer);
                }
                let params = jQuery.extend({}, data);
                data._csrf = $('[name="csrf-token"]:first').prop('content');

                $.ajax({
                    url: that.data('action'),
                    method: 'POST',
                    dataType: 'json',
                    cache: false,
                    data: data,
                    success: function (response) {
                        if (response.result == 1) {
                            if (response.ya_event) {
                                YAMETRIKA.fire(response.ya_event.event, response.ya_event.params);
                            }

                            let state = response.state;

                            if (state) {
                                PROJECT.showToast({success: 'Элемент успешно удален из избранного'});
                                that.removeClass(favoriteActiveClass);
                                params.isFavorite = 1;
                                that.data('params', params);
                            } else {
                                PROJECT.showToast({success: 'Элемент успешно добавлен в избранное'});
                                that.addClass(favoriteActiveClass);
                                params.isFavorite = 0;
                                that.data('params', params);
                            }
                            if (that.parents('[data-favorite-reload]').length == 1) {
                                var reloadContainer = that.parents('[data-favorite-reload]').data('favorite-reload');
                                if ($(reloadContainer).length === 1) {
                                    $.pjax.reload(reloadContainer);
                                }
                            }
                        } else {
                            PROJECT.showToast({error: 'Возникла серверная ошибка'});
                        }
                        if (loaderContainer) {
                            LoaderCircle.hideLoader(loaderContainer);
                        }
                    },
                    error: function () {
                        PROJECT.showToast({error: 'Возникла серверная ошибка'});

                        if (loaderContainer) {
                            LoaderCircle.hideLoader(loaderContainer);
                        }
                    }
                });

                return false;
            });

            $(document).on("ready pjax:success", "#discussion_comments_pjax", function (event) {
                var discTextContainers = document.querySelectorAll('.answers__discussion-col.js-text-hidden');
                if (discTextContainers.length) {
                    window.openText(discTextContainers);
                }
            });

            $(document).on("ready pjax:success", ".init_tooltip", function (event) {
                tooltipsInit();
            });

            $(document).on("ready pjax:success", ".init_ws_count", function (event) {
                if (typeof window.initWsCount !== "undefined") {
                    window.initWsCount();
                }
            });

            $(document).on("ready pjax:success", ".init_choices", function (event) {
                initChoices();
            });

            $(document).on("ready pjax:success", "#projects_pjax", function (event) {
                var selects = document.querySelectorAll('.js-form-select select');
                selects.forEach(function (select) {
                    window.addSelect(select);
                });
                var filter = document.querySelector('.js-filter');
                window.initJsFilter(filter);
            });

            $(document).on("ready pjax:success", "#partnership_poll_pjax", function (event) {
                var selects = document.querySelectorAll('.js-form-select select');
                selects.forEach(function (select) {
                    window.addSelect(select);
                });
                var filter = document.querySelector('.js-filter');
                window.initJsFilter(filter);
            });

            $(document).on("ready pjax:success", "#polls_pjax", function (event) {
                var selects = document.querySelectorAll('.js-form-select select.single-select');
                selects.forEach(function (select) {
                    window.addSelect(select);
                });

                var selectsMultiple = document.querySelectorAll('.js-form-select select.js-multiple-select');
                selectsMultiple.forEach(function (select) {
                    addMultipleSelect(select);
                });
            });

            $(document).on("ready pjax:success", "#direct_line_form_pjax", function (event) {
                initSelects();
                initFileUploader();
                initImgUpload();
                suggestViewInit();
            });

            $(document).on("ready pjax:success", "#discussion_pjax", function (event) {
                var selectsMultiple = document.querySelectorAll('.js-form-select select.js-multiple-select');
                selectsMultiple.forEach(function (select) {
                    addMultipleSelect(select);
                });
            });

            $(document).on("ready pjax:success", "#improvement_pjax", function (event) {
                var selects = document.querySelectorAll('.js-form-select select:not([multiple])');
                selects.forEach(function (select) {
                    window.addSelect(select);
                });
            });

            $(document).on("ready pjax:success", "#favorite_pjax", function (event) {
                var selects = document.querySelectorAll('.js-form-select select');
                selects.forEach(function (select) {
                    window.addSelect(select);
                });
                var filter = document.querySelector('.js-filter');
                window.initJsFilter(filter);
            });

            $(document).on("ready pjax:success", ".reload-select", function (event) {
                var selects = document.querySelectorAll('.js-form-select select.single-select');
                selects.forEach(function (select) {
                    window.addSelect(select);
                });

                var selectsMultiple = document.querySelectorAll('.js-form-select select.js-multiple-select');
                selectsMultiple.forEach(function (select) {
                    addMultipleSelect(select);
                });
            });

            $(document).on('submit', 'form#region-form-modal, form#region-form-mobile', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let form = $(this);

                let loaderContainer = '.page-header';

                LoaderCircle.showLoader(loaderContainer);

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    dataType: 'json',
                    cache: false,
                    data: form.serializeArray(),
                    success: function (data) {
                        if (data.result == 1) {
                            location.reload();
                        } else {
                            new Noty({
                                type: 'error',
                                text: data.message,
                            }).show();
                        }

                    },
                    error: function () {
                        new Noty({
                            type: 'error',
                            text: 'Возникла серверная ошибка'
                        }).show();
                    },
                    complete: function () {
                        LoaderCircle.hideLoader(loaderContainer);
                    }
                });

                return false;
            })

            addEventListener("popstate", function (e) {
                document.querySelectorAll('.js-form-select select').forEach(function (select) {
                    addSelect(select);
                });
            }, false);

            let improvementLikeAjaxXhr = {},
                ratingLikeAjaxXhr = {};
            $(document).on('click', '.js-improvement-like', function (e) {
                e.preventDefault();
                let that = $(this);
                let id = that.data('id');

                if (that.hasClass('waiting')) {
                    return;
                }

                if (improvementLikeAjaxXhr[id]) {
                    improvementLikeAjaxXhr[id].abort();
                }

                let counter = that.find('span');
                let type = that.hasClass('liked') ? 0 : 1;
                let action = type === 1 ? that.data('vote') : that.data('unvote');
                const wrap = $('body')

                that.addClass('waiting');
                LoaderCircle.showLoader(wrap);
                improvementLikeAjaxXhr[id] = $.ajax({
                    url: action,
                    method: 'POST',
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        if (data.result === 1) {
                            if (data.ya_event) {
                                YAMETRIKA.fire(data.ya_event.event, data.ya_event.params);
                            }

                            if (typeof data.count != 'undefined') {
                                counter.text(data.count);
                            } else {
                                var value = parseInt(counter.text(), 10);
                                counter.text(type === 1 ? (value + 1) : (value - 1));
                            }

                            if (type === 1) {
                                that.addClass('liked');
                            } else {
                                that.removeClass('liked');
                            }
                        } else {
                            new Noty({
                                type: 'error',
                                text: data.message,
                            }).show();
                        }
                        that.removeClass('waiting');
                        LoaderCircle.hideLoader(wrap);
                    },
                    error: function (e) {
                        if (e.statusText && e.statusText !== 'abort') {
                            new Noty({
                                type: 'error',
                                text: 'Возникла серверная ошибка'
                            }).show();
                        }
                        that.removeClass('waiting');
                        LoaderCircle.hideLoader(wrap);
                    },

                });
            });

            $(document).on('click', '.js-improvement-like-minstroy', function (e) {
                e.preventDefault();
                let that = $(this);
                let id = that.data('id');

                if (that.hasClass('waiting')) {
                    return;
                }

                if (improvementLikeAjaxXhr[id]) {
                    improvementLikeAjaxXhr[id].abort();
                }

                let available = $('#improvements_form_filter .filter-2__counter-avaliable');
                let counter = that.find('span');
                let type = that.hasClass('liked') ? 0 : 1;
                let action = type === 1 ? that.data('vote') : that.data('unvote');

                that.addClass('waiting');
                improvementLikeAjaxXhr[id] = $.ajax({
                    url: action,
                    method: 'POST',
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        if (data.result === 1) {
                            if (typeof data.count != 'undefined') {
                                counter.text(data.count);
                            } else {
                                var value = parseInt(counter.text(), 10);
                                counter.text(type === 1 ? (value + 1) : (value - 1));
                            }

                            if (type === 1) {
                                that.addClass('liked');

                                if (available.length > 0) {
                                    available.text(available.text() * 1 - 1);
                                }

                                $('.js-improvement-like-minstroy').addClass('proposal-list__like-counter--disabled');
                            }
                        } else {
                            new Noty({
                                type: 'error',
                                text: data.message,
                            }).show();
                        }
                        that.removeClass('waiting');
                    },
                    error: function (e) {
                        if (e.statusText && e.statusText !== 'abort') {
                            new Noty({
                                type: 'error',
                                text: 'Возникла серверная ошибка'
                            }).show();
                        }
                        that.removeClass('waiting');
                    }
                });
            });

            $(document).on('click', '.js-like-counter', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let that = $(this),
                    id = that.data('model_id'),
                    counterContainer = that.closest('.js_likes_container'),
                    projectSector = counterContainer.data('sector'),
                    sectorCategory = $(`.js_sector_category[data-sector=${projectSector}]`),
                    sectorCategoryCounter = $('.js-sector_voting_count', sectorCategory),
                    counterFor = $('.js_counter_for', counterContainer),
                    counterAgainst = $('.js_counter_against', counterContainer),
                    isActive = that.hasClass('js_liked'),
                    action = isActive ? null : that.data('action');


                if (
                    !action
                    || counterContainer.hasClass('waiting')
                    || that.hasClass('proposal-list__like-counter--disabled')
                ) {
                    return;
                }

                if (ratingLikeAjaxXhr[id]) {
                    ratingLikeAjaxXhr[id].abort();
                }

                let loaderContainer = $('.js_likes_container');
                loaderContainer.addClass('waiting');
                LoaderCircle.showLoader(loaderContainer);
                ratingLikeAjaxXhr[id] = $.post(action, {}, data => {
                    if (data.result === 1) {

                        if (data.ya_event) {
                            YAMETRIKA.fire(data.ya_event.event, data.ya_event.params);
                        }

                        // обновляем общее количество лайков
                        if (typeof data.count !== 'undefined') {
                            let dataFor = data.count[1],
                                dataAgainst = data.count[0];

                            let votesFor = dataFor ? dataFor.count : null,
                                votesAgainst = dataAgainst ? dataAgainst.count : null;

                            if (votesFor !== null) {
                                counterFor.text(votesFor);
                            }
                            if (votesAgainst !== null) {
                                counterAgainst.text(votesAgainst);
                            }
                        }

                        // обновляем максимальное количество голосов в секторе
                        if (typeof data.user_free_votes !== "undefined") {
                            sectorCategoryCounter.text(data.user_free_votes);
                        }

                        that.addClass('liked');
                        $('.js-like-counter', counterContainer).addClass('proposal-list__like-counter--disabled');

                        if (data.message) {
                            new Noty({
                                type: 'success',
                                text: data.message,
                            }).show();
                        }
                        LoaderCircle.hideLoader(loaderContainer);
                    } else {
                        new Noty({
                            type: 'error',
                            text: data.message,
                        }).show();
                        that.removeClass('liked');
                    }
                    $('.js_likes_container').removeClass('waiting');


                    if (parseInt(sectorCategoryCounter.text()) <= 0) {
                        $('.js-like-counter', that.closest('.rating-list')).addClass('proposal-list__like-counter--disabled');
                    }

                }, 'json').catch(e => {
                    if (e.statusText && e.statusText !== 'abort') {
                        new Noty({
                            type: 'error',
                            text: 'Возникла серверная ошибка'
                        }).show();
                    }
                    $('.js_likes_container').removeClass('waiting');
                    that.removeClass('liked');
                    LoaderCircle.hideLoader(loaderContainer);
                });

            });

            $(document).on("click", ".js-send-action-form button[type=submit]", function (e) {
                e.preventDefault();
                var form = $(this).parents(".js-send-action-form");
                if ($(this).attr("name")) {
                    var hiddenInput = form.find(".hidden-submit-value");
                    if (hiddenInput.length) {
                        hiddenInput.attr("name", $(this).attr("name"));
                        hiddenInput.attr("value", $(this).attr("value"));
                    } else {
                        $(form).append(
                            $("<input class='hidden-submit-value' type='hidden'>").attr({
                                name: $(this).attr("name"),
                                value: $(this).attr("value")
                            })
                        );
                    }
                }
                form.submit();
            });
        },

        setTimeZone: function (url) {
            let tz = moment.tz.guess();
            if (tz) {
                $.post(url, {
                    tz: moment.tz.guess(),
                })
            }
        },

        /**
         * Инициализация блока голосования в проекте
         */
        initProjectVoteWidget: function (wrap) {
            let id = 'project-vote-' + new Date().getTime();
            wrap.attr('id', id);
            let approveValue = +wrap.find('.vote-results__value--approve').text().replace(/\s+/g, '');
            let rejectValue = +wrap.find('.vote-results__value--reject').text().replace(/\s+/g, '');
            let scaleIndicator = wrap.find('.vote-results__indicator');
            scaleIndicator.width(Math.trunc(approveValue / (approveValue + rejectValue) * 100) + '%');

            wrap.addClass('project-vote--js');

            wrap.addClass('project-page__panel--js');

            (function () {
                return new window.Sticky('#' + id);
            })();
        },

        initProjectEvent: function () {
            const formId = '#project-vote-option-form';
            let formOptionValidated = false // Произошла ли полная валидация формы

            function validateFormOptionForm() {
                formOptionValidated = true
                $(formId).yiiActiveForm('validate', true)
            }

            function toggleBtnVote(errorAttrLength) {
                const errorLength = $(formId).find('.has-error').length // Доп проверка
                const $btnApprove = $('#project-vote-form .project-vote__vote-btn--approve')
                if (errorAttrLength === 0 && errorLength === 0) {
                    $btnApprove
                        .removeClass('project-vote__vote-btn--disabled')
                        .find('input[name=vote]').prop("disabled", false);
                } else {
                    $btnApprove
                        .addClass('project-vote__vote-btn--disabled')
                        .find('input[name=vote]').prop("disabled", true);
                }
            }

            function getNotValidatedAttrLength() {
                const formAttributes = $(formId).yiiActiveForm('data').attributes
                let elements = [];

                formAttributes.forEach(element => {
                    if (element.status === 0) {
                        if (element.name.indexOf('own_answer') === -1) {
                            elements.push(element.name)
                        }
                    }
                })

                return elements.length;
            }

            // Валидируем форму опций в проектах, от этого зависит возможность голоса "За"
            $(document).on('change', formId, function () {
                if (formOptionValidated || getNotValidatedAttrLength() <= 1) {
                    validateFormOptionForm()
                }
            });

            // Отключить отправку при валидации
            $(document).on('beforeSubmit', formId, function () {
                return false
            });

            $(document).on('afterValidate', formId, function (event, messages, errorAttributes) {
                // Если все элементы были выбраны выполнить полную валидацию формы
                if (getNotValidatedAttrLength() <= 1 && !formOptionValidated) {
                    validateFormOptionForm()
                    return
                }
                // Активировать/Деактивировать кнопку после полной валидации
                if (formOptionValidated) {
                    setTimeout(() => toggleBtnVote(errorAttributes.length))
                }
            });

            $(document).on('change', '#project-vote-form input[name=vote]', function (e) {
                e.preventDefault();
                let form = $(this).parents('form');
                const that = this;

                let data = form.serializeArray();

                const formOption = $(formId);

                if (formOption.length) {
                    data = data.concat(formOption.serializeArray());
                }

                let popup = $('.vote-popup');

                LoaderCircle.showLoader();

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    dataType: 'json',
                    cache: false,
                    data: data,
                    success: function (data) {
                        if (data.result === 1) {
                            new Noty({
                                type: 'success',
                                text: data.message,
                            }).show();

                            if ($('#project-vote-pjax').length) {
                                $.pjax.reload({container: '#project-vote-pjax', async: false, timeout: 5000});
                                initInputsPreviewPopup();
                                initProjectTabs();
                            }

                            YAMETRIKA.fire('lkp_vote_project_contests_page');
                            // popup.addClass('vote-popup--shown');
                        } else {
                            if (formOption.length) {
                                validateFormOptionForm()
                            }

                            new Noty({
                                type: 'error',
                                text: data.message,
                            }).show();
                        }

                    },
                    error: function () {
                        new Noty({
                            type: 'error',
                            text: 'Возникла серверная ошибка'
                        }).show();

                        if (formOption.length) {
                            validateFormOptionForm()
                        }

                    },
                    complete: function () {
                        $(that).prop('checked', false)
                        LoaderCircle.hideLoader();
                    }
                });
            });
            $(document).on('submit', '#project-unvote-form', function (e) {
                e.preventDefault();
                let form = $(this);

                LoaderCircle.showLoader();

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    dataType: 'json',
                    cache: false,
                    data: form.serializeArray(),
                    success: function (data) {
                        if (data.result == 1) {
                            new Noty({
                                type: 'success',
                                text: data.message,
                            }).show();

                            $('.vote-popup').removeClass('vote-popup--shown');

                        } else {
                            new Noty({
                                type: 'error',
                                text: data.message,
                            }).show();
                        }
                    },
                    error: function () {
                        new Noty({
                            type: 'error',
                            text: 'Возникла серверная ошибка'
                        }).show();
                    },
                    complete: function () {
                        LoaderCircle.hideLoader();

                        if ($('#project-vote-pjax').length) {
                            $.pjax.reload({container: '#project-vote-pjax', async: false, timeout: 5000});
                            formOptionValidated = false

                            initOtherChecboxes();
                            initOtherRadios();
                            initInputsPreviewPopup();
                            initProjectTabs();
                        }

                    }
                });
            });
        },

        showToast: function (data) {
            if (typeof data == 'undefined') {
                return;
            }

            let type, text;
            if (data.success) {
                type = 'success';
                text = data.success;
            } else if (data.error) {
                type = 'error';
                text = data.error;
            } else if (data.info) {
                type = 'info';
                text = data.info;
            } else {
                return;
            }

            new Noty({
                type: type,
                text: text,
            }).show();
        },

        getVisuallyImpairedState: function () {
            let state = {};
            $('.js-visually-impaired-version').each(function (index, element) {
                let obj = $(element);
                let name = obj.data('property');
                let value = obj.data('value');

                if (obj.hasClass('active') && name && value) {
                    state[name] = value;
                }
            });

            return state;
        },

        initJsCustomDatepicker: function () {
            var inputs = document.querySelectorAll('.js-custom-datepicker');

            if (!inputs.length) {
                return;
            }

            inputs.forEach(function (input) {
                let minDate = input.dataset.datemin;
                let maxDate = input.dataset.datemax;

                let options = {
                    language: 'ru',
                    autohide: true,
                };

                if (minDate) {
                    options.minDate = minDate;
                }

                if (maxDate) {
                    options.maxDate = maxDate;
                }

                var datepicker = new window.Datepicker(input, options);
            });
        }
    }

}();

(function ($) {

    /**
     * DOM-ready.
     */
    $(document).ready(function () {
        PROJECT.onReady();
    });

    /**
     * DOM-load.
     */
    $(window).on("load", function () {
        PROJECT.onLoad();
    });

})(jQuery);