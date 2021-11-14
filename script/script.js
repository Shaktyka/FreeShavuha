'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const customerBtn = document.getElementById('customer');
    const freelancerBtn = document.getElementById('freelancer');
    const blockCustomer = document.getElementById('block-customer');
    const blockFreelancer = document.getElementById('block-freelancer');
    const blockChoice = document.getElementById('block-choice');
    const btnExit = document.getElementById('btn-exit');
    const formCustomer = document.getElementById('form-customer');
    const ordersTable = document.getElementById('orders');
    const orderReadModal = document.getElementById('order_read');
    const orderActiveModal = document.getElementById('order_active');
    const headTable = document.getElementById('head-table');

    // Получает заказы из localStorage:
    const getOrders = () => {
        return JSON.parse(localStorage.getItem('freeOrders')) || [];
    };

    // Помещает заказы в localStorage:
    const toStorage = () => {
        localStorage.setItem('freeOrders', JSON.stringify(orders));
    };

    const orders = getOrders();

    // Добавляет склонение существительных:
    const declOfNum = (number, titles) => {
        const cases = [2, 0, 1, 1, 1, 2];
        const noun = titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
        return `${number} ${noun}`;
    };

    // Считает кол-во дней до дедлайна:
    const calcDeadline = (dateStr) => {
        const deadline = new Date(dateStr);
        const today = Date.now();

        const remaining = (deadline - today) / 1000 / 60 / 60;

        if (remaining / 24 > 2) {
            return declOfNum(Math.floor(remaining / 24), ['день', 'дня', 'дней']);
        }

        return declOfNum(Math.floor(remaining), ['час', 'часа', 'часов']);
    };

    // Рендерит заказы:
    const renderOrders = () => {

        ordersTable.textContent = '';

        if (orders.length === 0) {
            return;
        }

        orders.forEach((order, i) => {
            const orderClass = order.active ? 'taken' : '';

            ordersTable.innerHTML += `
              <tr class = "order ${orderClass}" data-order-number="${i}">
                <td>${i + 1}</td>
                <td>${order.title}</td>
                <td class="${order.currency}"></td>
                <td>${calcDeadline(order.deadline)}</td>
              </tr>`;
        });

    };

    // Обрабатывает клики в модальном окне заявки:
    const modalClickHandler = (evt) => {
        const target = evt.target;
        const modal = target.closest('.order-modal');
        const order = orders[modal.id];

        const processCloseModal = () => {
            modal.style.display = 'none';
            toStorage();
            renderOrders();
        };

        if (target.closest('.close') || target === modal) {
            modal.style.display = 'none';
        }

        // Взять заказ:
        if (target.classList.contains('get-order')) {
            order.active = true;
            processCloseModal();
        }

        // Отказаться:
        if (target.id === 'capitulation') {
            order.active = false;
            processCloseModal();
        }

        // Выполнил:
        if (target.id === 'ready') {
            const doneOrderIndex = orders.indexOf(order);
            orders.splice(doneOrderIndex, 1);
            processCloseModal();
        }
    };

    // Открывает модальное окно
    const openModal = (orderNumber) => {
        const order = orders[orderNumber];
        const {
            title,
            firstName,
            email,
            description,
            deadline,
            amount,
            currency,
            phone,
            active = false
        } = order;

        const modal = active ? orderActiveModal : orderReadModal;

        const modalTitleEl = modal.querySelector('.modal-title');
        const firstNameEl = modal.querySelector('.firstName');
        const emailEl = modal.querySelector('.email');
        const descriptionEl = modal.querySelector('.description');
        const deadlineEl = modal.querySelector('.deadline');
        const currencyEl = modal.querySelector('.currency_img');
        const countEl = modal.querySelector('.count');
        const phoneEl = modal.querySelector('.phone');

        modal.id = orderNumber;

        // Прописывает данные заказа в поля модалки
        modalTitleEl.textContent = title;
        firstNameEl.textContent = firstName;
        emailEl.textContent = email;
        emailEl.href = 'mailto:' + email;
        descriptionEl.textContent = description;
        deadlineEl.textContent = deadline; // Преобразовать в привычный вид
        currencyEl.className = `currency_img ${currency}`;
        countEl.textContent = amount;
        phoneEl ? phoneEl.href = 'tel:' + phone : '';

        // Открывает модалку
        modal.style.display = 'flex';

        modal.addEventListener('click', modalClickHandler);
    };

    // Сортировка объектов в массиве:
    const sortOrder = (arr, property) => {
        arr.sort((a, b) => a[property] > b[property] ? 1 : -1);
    };

    // Обработчик при клике на заголовки столбцов таблицы заказов:
    headTable.addEventListener('click', (evt) => {
        const target = evt.target;

        if (target.classList.contains('head-sort')) {
            if (target.id === 'task-sort') {
                sortOrder(orders, 'title');
            } else if (target.id === 'currency-sort') {
                sortOrder(orders, 'currency');
            } else if (target.id === 'deadline-sort') {
                sortOrder(orders, 'deadline');
            }
        }

        toStorage();
        renderOrders();
    });

    // Обработчик на таблицу при клике по строке
    ordersTable.addEventListener('click', (evt) => {
        const target = evt.target;
        const targetOrder = target.closest('.order');
        const orderNumber = targetOrder.dataset.orderNumber;

        if (targetOrder) {
            openModal(orderNumber);
        }
    });

    // Обработчик клика по кнопке "Заказчик":
    customerBtn.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        const today = new Date().toISOString().substring(0, 10);
        document.getElementById('deadline').min = today;
        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    // Обработчик клика по кнопке "Фрилансер":
    freelancerBtn.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        renderOrders();
        blockFreelancer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    // Обработчик клика по кнопке "Выход":
    btnExit.addEventListener('click', () => {
        blockCustomer.style.display = 'none';
        blockFreelancer.style.display = 'none';
        blockChoice.style.display = 'block';
        btnExit.style.display = 'none';
    });

    // Обработчик отправки формы создания заказа:
    formCustomer.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const elemObj = {};

        const formElems = [...formCustomer.elements];

        // Переписать на filter
        // const formElems = [...formCustomer.elements]
        //     .filter((elem) => (
        //         (elem.tagName === 'INPUT' && elem.type !== 'radio') ||
        //         (elem.type === 'radio' && elem.checked) ||
        //         (elem.tagName === 'TEXTAREA')
        //     ));

        // Перебор с помощью forEach:
        formElems.forEach((elem) => {
            if ((elem.tagName === 'INPUT' && elem.type !== 'radio') ||
                (elem.type === 'radio' && elem.checked) ||
                (elem.tagName === 'TEXTAREA')) {
                elemObj[elem.name] = elem.value;
            }
        });

        /* // Перебор с помощью for
        for (const elem of formCustomer.elements) {
            if ((elem.tagName === 'INPUT' && elem.type !== 'radio') ||
                (elem.type === 'radio' && elem.checked) ||
                (elem.tagName === 'TEXTAREA')) {
                elemObj[elem.name] = elem.value;
            }
        }
        */

        formCustomer.reset();

        orders.push(elemObj);
        toStorage();
    });

});