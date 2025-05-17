// Функция для перехвата кликов на кнопках
window.addEventListener('DOMContentLoaded', function() {
    // Собираем все кнопки и ссылки
    const buttons = document.querySelectorAll('a, button');
    
    buttons.forEach(button => {
        // Пропускаем официальные ссылки из футера
        if (button.closest('.page-footer__list')) {
            return;
        }
        
        // Пропускаем ссылки внизу сайта
        if (button.closest('.footer')) {
            return;
        }
        
        // Пропускаем кнопки входа и авторизации
        if (button.textContent === 'Войти' || 
            button.textContent === 'Авторизоваться' || 
            button.textContent === 'АВТОРИЗОВАТЬСЯ' ||
            (button.closest('.page-header') && button.textContent.trim() === 'Войти')) {
            return;
        }
        
        // Обрабатываем клик на ссылку "Правила прохождения опроса"
        if (button.textContent === 'Правила прохождения опроса') {
            // Предотвращаем переход по ссылке
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Открываем модальное окно
                const modal = new bootstrap.Modal(document.getElementById('pollRulesModal'));
                
                // Добавляем обработчик события показа модального окна
                modal._element.addEventListener('show.bs.modal', function () {
                    // Отключаем прокрутку для всех контейнеров
                    const containers = document.querySelectorAll('html, body, .container, .page-container, .main-content');
                    containers.forEach(container => {
                        container.style.overflow = 'hidden';
                    });
                });
                
                // Добавляем обработчик события скрытия модального окна
                modal._element.addEventListener('hidden.bs.modal', function () {
                    // Включаем прокрутку для всех контейнеров
                    const containers = document.querySelectorAll('html, body, .container, .page-container, .main-content');
                    containers.forEach(container => {
                        container.style.overflow = '';
                    });
                });
                
                modal.show();
            });
            return;
        }
        
        // Добавляем обработчик клика
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем стандартное действие
            // Здесь мы просто перехватываем клик, но не делаем ничего
            console.log('Кнопка была нажата, но действие не выполнено');
        });
    });
});
