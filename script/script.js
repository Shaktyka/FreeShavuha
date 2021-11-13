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

    const orders = [];

    const renderOrders = () => {

        ordersTable.textContent = '';

        if (orders.length === 0) {
            return;
        }

        orders.forEach((order, i) => {
            ordersTable.innerHTML += `
              <tr class = "order" data-order-number="${i}">
                <td>${i + 1}</td>
                <td>${order.title}</td>
                <td class="${order.currency}"></td>
                <td>${order.deadline}</td>
              </tr>`;
        });

    };

    // Открывает модальное окно
    const openModal = (orderNumber) => {
        const order = orders[orderNumber];
        const modal = order.active ? orderActiveModal : orderReadModal;

        const modalTitle = modal.querySelector('.modal-title');
        const firstName = modal.querySelector('.firstName');
        const email = modal.querySelector('.email');
        const description = modal.querySelector('.description');
        const deadline = modal.querySelector('.deadline');
        const currency = modal.querySelector('.currency_img');
        const count = modal.querySelector('.count');
        const phone = modal.querySelector('.phone');
        const getOrderBtn = modal.querySelector('.get-order');
        const closeModalBtn = modal.querySelector('.close');

        // Прописывает данные заказа в поля модалки
        modalTitle.textContent = order.title;
        firstName.textContent = order.firstName;
        email.textContent = order.email;
        email.href = 'mailto:' + order.email;
        description.textContent = order.description;
        deadline.textContent = order.deadline;
        currency.className = `currency_img ${order.currency}`;
        count.textContent = order.amount;
        phone.href = 'tel:' + order.phone;

        // Закрывает модалку:
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Добавляет обработчик на кнопку принятия заказа:
        getOrderBtn.addEventListener('click', () => {
            // добавить свойство к параметрам заказа
        });

        // Открывает модалку
        modal.style.display = 'block';
    };

    // Обработчик на таблицу при клике по строке
    ordersTable.addEventListener('click', (evt) => {
        const target = evt.target;
        const targetOrder = target.closest('.order');
        const orderNumber = targetOrder.dataset.orderNumber;

        if (targetOrder) {
            openModal(orderNumber);
        }
    });

    customerBtn.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    freelancerBtn.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        renderOrders();
        blockFreelancer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    btnExit.addEventListener('click', () => {
        blockCustomer.style.display = 'none';
        blockFreelancer.style.display = 'none';
        blockChoice.style.display = 'block';
        btnExit.style.display = 'none';
    });

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

        orders.push(elemObj);

        formCustomer.reset();
    });

});