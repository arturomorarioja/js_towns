/**
 * Sample front-end application to illustrate the use of JSON server 
 * (https://www.npmjs.com/package/json-server)
 * 
 * JSON server creates a REST API from the JSON file data/towns.json
 * 
 * @author  Arturo Mora-Rioja
 * @version 1.0.0 August 2023
 */
'use strict';

const baseUrl = 'http://localhost:3000';    // JSON server URL

/**
 * Town list generation
 */
const showTownList = () => {
    fetch(baseUrl + '/towns')
    .then((response) => {
        return response.json();
    }).then((data) => {
        const townsList = document.querySelector('#list');
        data.forEach((town) => {
            townsList.append(townCard(town));
        });
    }).catch((error) => {
        console.log(error);
    });
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

    const article = document.createElement('article');
    article.classList.add('town');
    article.setAttribute('data-id', town.id);

    article.innerHTML = `
        <p><strong><span class="name">${town.name}</span></strong></p>
        <p>Region <span class="region">${town.region}</span></p>
        <p>Area: <span class="area">${town.area}</span> m<sup>2</sup>. Population: <span class="population">${town.population}</span></p>
        <p>Website: <a href="${town.website}" target="_blank" title="${town.name}'s website"><span class="website">${town.website}</span></a></p>
    `;

    const form = document.createElement('form');

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit');
    editButton.addEventListener('click', editTown);
    
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', deleteTown);

    form.append(editButton);
    form.append(deleteButton);

    article.append(form);
    return article;
}

/**
 * Modal
 */

const dialog = document.querySelector('dialog');
const dialogHeader = document.querySelector('dialog h2');

// Modal closing
document.querySelectorAll('dialog input[value=Cancel], .close').forEach((element) => {
    element.addEventListener('click', () => {
        dialog.close();
    });    
});    

// Initialising the modal to add a town
document.querySelector('#new').addEventListener('click', function (e) {
    e.preventDefault();

    dialogHeader.innerText = 'New town';
    document.querySelectorAll('dialog div > input').forEach(function(input) {
        input.value = '';
    });
    dialog.showModal();
});

// Initialising the modal to edit a town
const editTown = function(e) {
    e.preventDefault();
    
    dialogHeader.innerText = 'Edit town';

    const townID = this.parentElement.parentElement.getAttribute('data-id');
    dialog.setAttribute('town-id', townID);

    document.querySelector('#txtName').value = document.querySelector(`article[data-id="${townID}"] span.name`).innerText;
    document.querySelector('#txtRegion').value = document.querySelector(`article[data-id="${townID}"] span.region`).innerText;
    document.querySelector('#txtArea').value = document.querySelector(`article[data-id="${townID}"] span.area`).innerText;
    document.querySelector('#txtPopulation').value = document.querySelector(`article[data-id="${townID}"] span.population`).innerText;
    document.querySelector('#txtWebsite').value = document.querySelector(`article[data-id="${townID}"] span.website`).innerText;

    dialog.showModal();
}

/**
 * Save town (add or edit)
 */
document.querySelector('dialog > form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Add town
    let url = baseUrl + '/towns';
    let httpMethod = 'POST';
    // Edit town
    if (dialogHeader.innerText === 'Edit town') {
        httpMethod = 'PUT';
        url += '/' + dialog.getAttribute('town-id');
    }

    const town = {
        name: document.querySelector('#txtName').value,
        region: document.querySelector('#txtRegion').value,
        area: document.querySelector('#txtArea').value,
        population: document.querySelector('#txtPopulation').value,
        website: document.querySelector('#txtWebsite').value
    };

    await fetch(url, {
        method: httpMethod,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(town)
    }).then((response) => { console.log(response); })
    .then((data) => { console.log(data); })
    .catch((error) => { console.log(error); });
});

/**
 * Delete town
 */
const deleteTown = async function(e) {
    e.preventDefault();

    const id = this.parentElement.parentElement.getAttribute('data-id');
    await fetch(baseUrl + '/towns/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => { console.log(response); })
    .then((data) => { console.log(data); })
    .catch((error) => { console.log(error); });
}

showTownList();