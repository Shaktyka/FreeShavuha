'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const customerBtn = document.getElementById('customer');
    const freelancerBtn = document.getElementById('freelancer');
    const blockCustomer = document.getElementById('block-customer');
    const blockFreelancer = document.getElementById('block-freelancer');
    const blockChoice = document.getElementById('block-choice');
    const btnExit = document.getElementById('btn-exit');
    const formCustomer = document.getElementById('form-customer');

    const orders = [];

    customerBtn.addEventListener('click', () => {
        // console.log(1);
        blockChoice.style.display = 'none';
        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    freelancerBtn.addEventListener('click', () => {
        // console.log(2);
        blockChoice.style.display = 'none';
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

        // Переписать на filter
        const formElems = [...formCustomer.elements]
            .filter((elem) => (
                (elem.tagName === 'INPUT' && elem.type !== 'radio') ||
                (elem.type === 'radio' && elem.checked) ||
                (elem.tagName === 'TEXTAREA')
            ));

        // Перебор с помощью forEach:
        /*
        formElems.forEach((elem) => {
            if ((elem.tagName === 'INPUT' && elem.type !== 'radio') ||
                (elem.type === 'radio' && elem.checked) ||
                (elem.tagName === 'TEXTAREA')) {
                elemObj[elem.name] = elem.value;
            }
        });
        */

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