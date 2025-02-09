        // Инициализация данных (для примера)
        const initialCards = [
            {
                id: 1,
                title: "Пример карточки",
                image: "card1.jpg",
                link: "#",
                promoCodes: ["PROMO1", "PROMO2"],
                instruction: [
                    {text: "Шаг 1: Активируйте промокод", image: "step1.jpg"},
                    {text: "Шаг 2: Получите бонусы", image: "step2.jpg"}
                ]
            }
        ];

        // Сохраняем начальные данные в LocalStorage
        if (!localStorage.getItem('cards')) {
            localStorage.setItem('cards', JSON.stringify(initialCards));
        }

        // Загрузка карточек
        document.addEventListener('DOMContentLoaded', () => {
            const cards = JSON.parse(localStorage.getItem('cards')) || [];
            const grid = document.querySelector('.grid');
            
            grid.innerHTML = cards.map(card => `
                <div class="card">
                    <div class="card-image">
                        <img src="${card.image}" alt="${card.title}">
                    </div>
                    <div class="card-content">
                        <h3>${card.title}</h3>
                        <div class="promo-section">
                            ${card.promoCodes.map(code => `
                                <div class="promo-code">
                                    <span>${code.trim()}</span>
                                    <button class="copy-btn" onclick="copyCode('${code.trim()}')">
                                        Копировать
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="card-buttons">
                            <a href="${card.link}" class="site-link" target="_blank">
                                Перейти на сайт
                            </a>
                            <button class="site-link instruction-btn" 
                                    onclick="openModal(${card.id})">
                                Инструкция
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        });

        // Функции для работы с модальным окном
        function openModal(cardId) {
            const cards = JSON.parse(localStorage.getItem('cards'));
            const card = cards.find(c => c.id === cardId);
            const modalContent = document.getElementById('modalContent');
            
            let html = `<h2>📘 ${card.title}</h2>`;
            card.instruction.forEach((step, index) => {
                html += `
                    <p>${index + 1}. ${step.text}</p>
                    ${step.image ? `<img src="${step.image}" alt="Шаг ${index + 1}" loading="lazy">` : ''}
                `;
            });
            
            modalContent.innerHTML = html;
            document.getElementById('instructionModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('instructionModal').style.display = 'none';
        }

        // Функции для работы с промокодами
function copyCode(code) {
    // Запрашиваем разрешение на взаимодействие
    navigator.clipboard.writeText(code)
        .then(() => {
            if(!SoundManager.isAllowed) {
                alert('Нажмите на любую кнопку для активации звуков!');
                return;
            }
            
            SoundManager.playCopySound();
            showNotification(`✅ Промокод "${code}" скопирован!`);
        })
        .catch(err => console.error('Ошибка:', err));
}
        function showNotification(text) {
            const notification = document.getElementById('notification');
            notification.textContent = text;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 2000);
        }
   // Функции для управления контактами
    function showContacts() {
        document.getElementById('contactsModal').style.display = 'block';
    }
    
   // Обновлённая функция закрытия
function hideContacts() {
    document.getElementById('contactsModal').style.display = 'none';
}

    // Универсальный обработчик кликов
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
            hideContacts();
        }
    }

    // Обработчик клавиши Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            hideContacts();
        }
    });


        // Обработчики событий
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                closeModal();
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Исправленный скрипт для скрытия панели
        let lastScroll = 0;
        const topBar = document.getElementById('topBar');
        const scrollThreshold = 100; // Порог скролла в пикселях

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
                // Скролл вниз
                topBar.classList.add('hidden');
            } else {
                // Скролл вверх
                topBar.classList.remove('hidden');
            }
            lastScroll = currentScroll;
        });

// Sound Manager
const SoundManager = {
    hoverSound: null,
    copySound: null,
    isAllowed: false,
    
    init: function() {
        // Инициализация после первого клика пользователя
        const initSounds = () => {
            if(!this.hoverSound) {
                this.hoverSound = new Audio('sounds/navodka.mp3');
                this.hoverSound.volume = 0.3;
                this.copySound = new Audio('sounds/ckilk.mp3');
                this.copySound.volume = 0.7;
                this.isAllowed = true;
            }
        };


        // Активация по любому клику
        document.addEventListener('click', initSounds, { once: true });
        document.addEventListener('touchstart', initSounds, { once: true });
    },
    
    playHoverSound: function() {
        if(!this.isAllowed || !this.hoverSound) return;
        try {
            this.hoverSound.currentTime = 0;
            this.hoverSound.play().catch(e => console.log('Hover sound error:', e));
        } catch(e) {
            console.error('Ошибка звука:', e);
        }
    },
    
    playCopySound: function() {
        if(!this.isAllowed || !this.copySound) return;
        try {
            this.copySound.currentTime = 0;
            this.copySound.play().catch(e => console.log('Copy sound error:', e));
        } catch(e) {
            console.error('Ошибка звука:', e);
        }
    }
}

SoundManager.init();

// Добавляем обработчики для всех кнопок после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll(
        '.nav-btn, .copy-btn, .instruction-btn, .site-link, .social-link'
    );
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            SoundManager.playHoverSound();
        });
    });
});

// Функция копирования
function copyCode(code) {
    navigator.clipboard.writeText(code)
        .then(() => {
            SoundManager.playCopySound();
            showNotification(`✅ Промокод "${code}" скопирован!`);
        })
        .catch(err => console.error('Ошибка:', err));
}

// Функция для переключения окна контактов
function toggleContacts() {
    const contactsModal = document.getElementById('contactsModal');
    if (contactsModal.style.display === 'block') {
        contactsModal.style.display = 'none';
    } else {
        contactsModal.style.display = 'block';
    }
}
