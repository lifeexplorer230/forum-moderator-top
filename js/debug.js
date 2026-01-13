/**
 * Debug Mode
 * Режим отладки с нумерацией блоков
 * Включить/Выключить: Shift + D
 */

class DebugMode {
    constructor() {
        this.isActive = false;
        this.init();
        this.loadState();
    }

    init() {
        // Слушаем нажатие Shift+D
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Добавляем номера блоков к секциям
        this.addBlockNumbers();
    }

    addBlockNumbers() {
        const sections = document.querySelectorAll('section');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');

        // Блок 1: Header
        if (header) {
            header.setAttribute('data-block', '1');
        }

        // Блоки 2-27: Секции
        sections.forEach((section, index) => {
            section.setAttribute('data-block', index + 2);
        });

        // Блок 28: Footer
        if (footer) {
            footer.setAttribute('data-block', '28');
        }
    }

    toggle() {
        this.isActive = !this.isActive;

        if (this.isActive) {
            document.body.classList.add('debug-mode');
            this.showNotification('🔧 Debug Mode: ON (Shift+D to toggle)');
        } else {
            document.body.classList.remove('debug-mode');
            this.showNotification('✅ Debug Mode: OFF');
        }

        // Сохраняем состояние
        this.saveState();
    }

    showNotification(message) {
        // Удаляем предыдущее уведомление, если есть
        const existing = document.querySelector('.debug-notification');
        if (existing) {
            existing.remove();
        }

        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'debug-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Показываем
        setTimeout(() => notification.classList.add('show'), 10);

        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveState() {
        localStorage.setItem('debugMode', this.isActive);
    }

    loadState() {
        const saved = localStorage.getItem('debugMode');
        if (saved === 'true') {
            this.isActive = true;
            document.body.classList.add('debug-mode');
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.debugMode = new DebugMode();

    // Показываем подсказку при первом посещении
    if (!localStorage.getItem('debugModeHintShown')) {
        setTimeout(() => {
            console.log('%c🔧 Debug Mode доступен!', 'font-size: 16px; font-weight: bold; color: #7c3aed;');
            console.log('%cНажмите Shift+D для включения/выключения номеров блоков', 'font-size: 14px; color: #666;');
        }, 1000);
        localStorage.setItem('debugModeHintShown', 'true');
    }
});
