'use strict';

const baseUrl = 'http://localhost:3000';
const listLink = document.querySelector('a[href="#list"]');

listLink.addEventListener('click', () => {
    
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
});

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
        <p><strong>${town.name}</strong></p>
        <p>Region ${town.region}</p>
        <p>Area: ${town.area} m<sup>2</sup>. Population: ${town.population}</p>
        <p>Website: <a href="${town.website}" target="_blank" title="${town.name}'s website">${town.website}</a></p>
    `;

    const form = document.createElement('form');

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit');
    
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', async function(e) {
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
    });

    form.append(editButton);
    form.append(deleteButton);

    article.append(form);
    return article;
}

/**
 * Add town
 */
document.querySelector('#new > form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTown = {
        name: document.querySelector('#txtName').value,
        region: document.querySelector('#txtRegion').value,
        area: document.querySelector('#txtArea').value,
        population: document.querySelector('#txtPopulation').value,
        website: document.querySelector('#txtWebsite').value
    };

    await fetch(baseUrl + '/towns', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTown)
    }).then((response) => { console.log(response); })
    .then((data) => { console.log(data); })
    .catch((error) => { console.log(error); });
});

/**
 * Delete town
 */
document.querySelectorAll('.delete').forEach((deleteButton) => {
    deleteButton.addEventListener('click', function(e) {
        alert('clicked');
        e.preventDefault();

        const id = this.parentElement.parentElement.getAttribute('data-id');
        alert(id);
    });
});

listLink.click();