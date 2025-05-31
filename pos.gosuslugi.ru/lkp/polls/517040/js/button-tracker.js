// Функция для перехвата кликов на кнопках
document.addEventListener('DOMContentLoaded', function() {
    // Находим только кнопку "Правила прохождения опроса"
    const rulesButton = Array.from(document.querySelectorAll('a, button')).find(
        button => button.textContent.trim() === 'Правила прохождения опроса'
    );
    
    if (rulesButton) {
        // Обрабатываем клик на ссылку "Правила прохождения опроса"
        rulesButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Открываем модальное окно
            const modal = new bootstrap.Modal(document.getElementById('pollRulesModal'));
            
            // Добавляем обработчик события показа модального окна
            modal._element.addEventListener('show.bs.modal', function () {
                // Отключаем прокрутку для body
                document.body.style.overflow = 'hidden';
            });
            
            // Добавляем обработчик события скрытия модального окна
            modal._element.addEventListener('hidden.bs.modal', function () {
                // Включаем прокрутку для body
                document.body.style.overflow = '';
            });
            
            modal.show();
        });
    }
});
