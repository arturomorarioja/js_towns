/**
 * Sample front-end application to illustrate the use of JSON server 
 * (https://www.npmjs.com/package/json-server)
 * 
 * JSON server creates a REST API from the JSON file data/towns.json
 * 
 * @author  Arturo Mora-Rioja
 * @version 1.0.0 August 2023
 * @version 1.0.1 October 2025 JS code refactored to ES modules
 *                             Town card creation refactored to <template> and cloneNode()
 */

import { BASE_URL } from './info.js';

/**
 * Town list generation
 */
const showTownList = () => {
    fetch(`${BASE_URL}/towns`)
    .then(response => response.json())
    .then((data) => {
        const townsList = document.querySelector('#list');
        data.forEach((town) => {
            townsList.append(townCard(town));
        });
    }).catch(error => console.log(error));
};

// Town card generation
const townCard = (town) => {
    /**
     * A template literal does not work in this case
     * because the buttons are being attached event listeners
     */

    // return `
    //     <article class="town" data-id="${town.id}">
    //         <p><strong>${town.name}</strong></p>
    //         <p>Region ${town.region}</p>
    //         <p>Area: ${town.area} m<sup>2</sup>. Population: ${town.population}</p>
    //         <p>Website: <a href="${town.website}" target="_blank" title="${town.name}'s website">${town.website}</a></p>
    //         <form>
    //             <button class="edit">Edit</button>
    //             <button class="delete">Delete</button>
    //         </form>
    //     </article>
    // `;


    /**
     * Creating the card with createElement() leads to cumbersome, 
     * difficult to maintain code. In this case it is combined 
     * with innerHTML, which is not recommended because of security issues
     */

    // const article = document.createElement('article');
    // article.classList.add('town');
    // article.setAttribute('data-id', town.id);

    // article.innerHTML = `
    //     <p><strong><span class="name">${town.name}</span></strong></p>
    //     <p>Region <span class="region">${town.region}</span></p>
    //     <p>Area: <span class="area">${town.area}</span> m<sup>2</sup>. Population: <span class="population">${town.population}</span></p>
    //     <p>Website: <a href="${town.website}" target="_blank" title="${town.name}'s website"><span class="website">${town.website}</span></a></p>
    // `;

    // const form = document.createElement('form');

    // const editButton = document.createElement('button');
    // editButton.innerText = 'Edit';
    // editButton.classList.add('edit');
    // editButton.addEventListener('click', editTown);
    
    // const deleteButton = document.createElement('button');
    // deleteButton.innerText = 'Delete';
    // deleteButton.classList.add('delete');
    // deleteButton.addEventListener('click', deleteTown);

    // form.append(editButton);
    // form.append(deleteButton);

    // article.append(form);
    // return article;


    /**
     * Cleaner approach: with <template> and cloneNode()
     */

    const card = document.querySelector('#town').content.cloneNode(true);

    card.querySelector('article').setAttribute('data-id', town.id);

    card.querySelector('h2').innerText = town.name;
    card.querySelector('.region').innerText = town.region;
    card.querySelector('.area').innerText = town.area;
    card.querySelector('.population').innerText = town.population;
    card.querySelector('.website').innerText = town.website;    
    
    card.querySelector('form .edit').addEventListener('click', editTown);
    card.querySelector('form .delete').addEventListener('click', deleteTown);

    return card;
}

/**
 * Modal
 */

const dialog = document.querySelector('dialog');
const dialogHeader = document.querySelector('dialog h2');

// Modal closing
document.querySelectorAll('dialog input[value=Cancel], .close').forEach(element => {
    element.addEventListener('click', () => {
        dialog.close();
    });    
});    

// Initialising the modal to add a town
document.querySelector('#new').addEventListener('click', (e) => {
    e.preventDefault();

    dialogHeader.innerText = 'New town';
    document.querySelectorAll('dialog div > input').forEach(input => {
        input.value = '';
    });
    dialog.showModal();
});

// Initialising the modal to edit a town
const editTown = function(e) {
    e.preventDefault();

    dialogHeader.innerText = 'Edit town';

    const townCard = this.closest('article');
    const townID = townCard.getAttribute('data-id');
    dialog.setAttribute('town-id', townID);

    document.querySelector('#txtName').value = townCard.querySelector('h2').innerText;
    document.querySelector('#txtRegion').value = townCard.querySelector('.region').innerText;
    document.querySelector('#txtArea').value = townCard.querySelector('.area').innerText;
    document.querySelector('#txtPopulation').value = townCard.querySelector('.population').innerText;
    document.querySelector('#txtWebsite').value = townCard.querySelector('.website').innerText;

    dialog.showModal();
}

/**
 * Save town (add or edit)
 */
document.querySelector('dialog > form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Add town
    let url = `${BASE_URL}/towns`;
    let httpMethod = 'POST';
    // Edit town
    if (dialogHeader.innerText === 'Edit town') {
        httpMethod = 'PUT';
        url += '/' + dialog.getAttribute('town-id');
    }

    const town = {
        name: e.target.txtName.value,
        region: e.target.txtRegion.value,
        area: e.target.txtArea.value,
        population: e.target.txtPopulation.value,
        website: e.target.txtWebsite.value
    };

    await fetch(url, {
        method: httpMethod,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(town)
    }).then(response => { console.log(response); })
    .then(data => { console.log(data); })
    .catch(error => { console.log(error); });
});

/**
 * Delete town
 */
const deleteTown = async function(e) {
    e.preventDefault();

    const id = this.closest('article').getAttribute('data-id');
    await fetch(`${BASE_URL}/towns/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => { console.log(response); })
    .then(data => { console.log(data); })
    .catch(error => { console.log(error); });
}

showTownList();