/* Pendiente: La base de datos de paises regiones esta incorrecta, en chile da Marga Marga que es una provincia */
/*Proximos pasos:
- En la herramienta de busqueda permitir la opcion ALL y agregar el endpoint al backend. 
*/


/*Aseguramos que se cargue window antes de empezar a crear y generar elementos*/
window.onload = () => {
    let countriesSelector = document.getElementById('countries');
    let selectCountry = document.getElementById('selectCountry');
    let findSpot = document.getElementById('findSpot');
    let spotList = document.getElementById('spotList');
    let selectRegion = document.getElementById('regionSelector');
    let regionSelector = document.getElementById('region');
    let countryData;
    let countryCode;
    let activeRegion;
    let windDirectionData = [
        { 'name': 'On Shore'},
        { 'name': 'Off Shore'},
        { 'name': 'Side On'},
        { 'name': 'Side Off'},
        { 'name': 'Side Shore'},
    ];
    let addspot = document.getElementById('addSpot');
    addspot.dataset.modalTarget = '#modal';

    /* Aca comienza la funcionalidad de un modal que saque de este tutorial:  https://www.youtube.com/watch?v=MBaw_6cPmAw -----------------------*/
    
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('[data-close-button]');
    const overlay = document.getElementById('overlay');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        }
        );
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        }
        );
    });

    overlay.addEventListener('click', ()=>{
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            closeModal(modal);
        }
        );
    })

    /* ---------- Hasta aca llega la funcionalidad del overlay */

    /*Poblamos la lista de paises y regiones para la busqueda */
    getCountries().then(data => {
        countryData = data;
        populateList(countriesSelector, "option", data, "code", "country");
        countryCode = countriesSelector.options[countriesSelector.selectedIndex].value;
        getRegions(countryCode).then(data => {
            removeAllChildNodes(regionSelector);
            populateList(regionSelector, "option", data, "shortCode", "name");
            activeRegion = data;

        }).catch(error => {console.log(error);});

        countriesSelector.addEventListener('change', () => {
            getRegions(countriesSelector.options[countriesSelector.selectedIndex].value).then(data => {
                activeRegion = data;
                removeAllChildNodes(regionSelector);
                populateList(regionSelector, "option", data, "shortCode", "name");
    
            }).catch(error => {console.log(error);});

        })


    }).catch(error => {
        console.log(error);
    });

    /*----------- Populacion de tabla de spots ya existentes ------------------*/
    
            
    get('spot').then(data => {    
    removeAllChildNodes(spotList);
    for(let i=0; i<data.rows.length; i++){ 
        let newSpot = document.createElement('tr');
        let newSpotName = document.createElement('td');
        newSpotName.innerHTML = data.rows[i].name;
        let spotCountry = document.createElement('td');
        spotCountry.innerHTML = countryData[countryData.findIndex(country => country.code == data.rows[i].countryCode)].country;
        spotCountry.dataset.countryCode = data.rows[i].countryCode;
        let spotRegion = document.createElement('td');
        spotRegion.innerHTML = data.rows[i].regionCode;
        let windDirection = document.createElement('td');
        windDirection.innerHTML = data.rows[i].windDirection;
        let spotID = document.createElement('td');
        spotID.innerHTML = data.rows[i].id;
        let editSpot = document.createElement('td');
        let editButton = document.createElement('button');
        editButton.innerHTML = "Edit";
        editButton.dataset.modalTarget = '#modal'

        /* Modal de edicion de spot */

        editButton.onclick = () => { 
                     /*Comenzamos a trabajar con el modal */
                     const modal = document.querySelector(editButton.dataset.modalTarget);
                     const spotEditList = document.getElementById('spotEditList');
                     removeAllChildNodes(spotEditList);
         
                     /*Poblamos la tabla del modal con los datos del spot a editar */
                     let newSpotEdit = document.createElement('tr');
                     spotEditList.appendChild(newSpotEdit);

                     let newSpotNameEdit = document.createElement('td');
                     let spotName = document.createElement('input');
                     spotName.value = data.rows[i].name;
                     newSpotNameEdit.appendChild(spotName);
                     newSpotEdit.appendChild(newSpotNameEdit);
                     
         
                     let newSpotCountryEdit = document.createElement('td');
                     let countryName = document.createElement('select');
                     populateList(countryName, "option", countryData, "code", "country");
                     countryName.selectedIndex = countryData.findIndex(country => country.code == data.rows[i].countryCode);
                     newSpotCountryEdit.appendChild(countryName);
                     newSpotEdit.appendChild(newSpotCountryEdit);

                     /* Populamos con el pais elegido y la region elegida*/
         
         
                     let newSpotRegionEdit = document.createElement('td');
                     let regionName = document.createElement('select');
                     regionName.id = "regionEdit";
         
                     getRegions(data.rows[i].countryCode).then(data => {
                         populateList(regionName, "option", data, "shortCode", "name");
                     }).catch(error => {console.log(error);})
                     
                     

                     newSpotRegionEdit.appendChild(regionName);
                     newSpotEdit.appendChild(newSpotRegionEdit);
         
                     /* Si se cambia el pais elegido las regiones tienen que cambiar, eso lo manejamos aca */
         
                     countryName.addEventListener('change', () =>{
                         console.log(`Se elige el pais ${countryName.options[countryName.selectedIndex].value}`);
                         let regiontochange = document.getElementById('regionEdit');
                         removeAllChildNodes(regiontochange);
                         let regionData;
                         getRegions(countryName.options[countryName.selectedIndex].value).then(data => {
                             populateList(regiontochange, "option", data, "shortCode", "name");
                             regionData = data;
                             console.log(regionData);
                 
                         }).catch(error => {console.log(error);})
                         newSpotRegionEdit.appendChild(regionName);
                     })
         
         
                     let newSpotWindDirectionEdit = document.createElement('td');
                     let windDirectionName = document.createElement('select');
                     populateList(windDirectionName, "option", windDirectionData, "name", "name");
         
                     windDirection.value = data.rows[i].windDirection;
                     newSpotWindDirectionEdit.appendChild(windDirectionName);
                     newSpotEdit.appendChild(newSpotWindDirectionEdit);
         
                     let newSpotId = document.createElement('td');
                     newSpotId.innerHTML = data.rows[i].id;
                     newSpotEdit.appendChild(newSpotId);
         
                     let editSpot = document.createElement('td');
                     let innerEditButton = document.createElement('button');
                     innerEditButton.innerHTML = "Edit";
                     innerEditButton.id = 'editSpot';
                     editSpot.appendChild(innerEditButton);
                     newSpotEdit.appendChild(editSpot);
                     let recognizedButton = document.getElementById('editSpot')
                     recognizedButton.onclick = editSpotOnDb;

                     let deleteButton = document.createElement('button');
                     deleteButton.innerHTML = "Delete";
                     deleteButton.id = 'deleteSpot';
                     editSpot.appendChild(deleteButton);
                     let deleteButtonPointer = document.getElementById('deleteSpot');
                     deleteButtonPointer.onclick = deleteSpotOnDb;

                     openModal(modal);
        };
        editSpot.appendChild(editButton);
        newSpot.appendChild(newSpotName);
        newSpot.appendChild(spotCountry);
        newSpot.appendChild(spotRegion);
        newSpot.appendChild(windDirection);
        newSpot.appendChild(spotID);
        newSpot.appendChild(editSpot);
        spotList.appendChild(newSpot);
    }
});

addspot.onclick = () => {
    const spotEditList = document.getElementById('spotEditList');
    removeAllChildNodes(spotEditList);

    let newSpotEdit = document.createElement('tr');
    spotEditList.appendChild(newSpotEdit);

    let newSpotNameEdit = document.createElement('td');
    let spotName = document.createElement('input');
    newSpotNameEdit.appendChild(spotName);
    newSpotEdit.appendChild(newSpotNameEdit);
    

    let newSpotCountryEdit = document.createElement('td');
    let countryName = document.createElement('select');
    populateList(countryName, "option", countryData, "code", "country");
    newSpotCountryEdit.appendChild(countryName);
    newSpotEdit.appendChild(newSpotCountryEdit);

    /* Populamos con el pais elegido y la region elegida*/


    let newSpotRegionEdit = document.createElement('td');
    let regionName = document.createElement('select');
    regionName.id = "regionEdit";
    let regionData;

    getRegions('AF').then(data => {
        populateList(regionName, "option", data, "shortCode", "name");
        regionData = data;

    }).catch(error => {console.log(error);})
    
    newSpotRegionEdit.appendChild(regionName);
    newSpotEdit.appendChild(newSpotRegionEdit);
    /*spotEditList.appendChild(newSpotEdit);*/

    /* Si se cambia el pais elegido las regiones tienen que cambiar, eso lo manejamos aca */

    countryName.addEventListener('change', () =>{
        console.log(`Se elige el pais ${countryName.options[countryName.selectedIndex].value}`);
        let regiontochange = document.getElementById('regionEdit');
        removeAllChildNodes(regiontochange);
        let regionData;
        getRegions(countryName.options[countryName.selectedIndex].value).then(data => {
            populateList(regiontochange, "option", data, "shortCode", "name");
            regionData = data;
            console.log(regionData);

        }).catch(error => {console.log(error);})
        newSpotRegionEdit.appendChild(regionName);
    })


    let newSpotWindDirectionEdit = document.createElement('td');
    let windDirectionName = document.createElement('select');
    populateList(windDirectionName, "option", windDirectionData, "name", "name");

    newSpotWindDirectionEdit.appendChild(windDirectionName);
    newSpotEdit.appendChild(newSpotWindDirectionEdit);
    spotEditList.appendChild(newSpotEdit);

    let newSpotId = document.createElement('td');
    newSpotEdit.appendChild(newSpotId);

    let createSpot = document.createElement('td');
    let innerEditButton = document.createElement('button');
    innerEditButton.innerHTML = "Add";
    innerEditButton.id = 'createSpot';
    createSpot.appendChild(innerEditButton);
    newSpotEdit.appendChild(createSpot);
    let recognizedButton = document.getElementById('createSpot')
    recognizedButton.onclick = createSpotOnDb;
    openModal(modal);
}

};

const deleteSpotOnDb = async (event) => {
    const basePath = event.path
    const spotId = basePath[2].childNodes[4].innerHTML;
    console.log(`Se enviara a eliminar el spot con id ${spotId}`);
    try {
        const response = await fetch('http://localhost:4001/deletespot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: spotId
            })
        });
        const data = await response.json();
        alert("Spot eliminado con exito");
        closeModal(modal);
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

const createSpotOnDb = async (event) =>{
    const basePath = event.path
    const spotName = basePath[2].childNodes[0].children[0].value;
    const spotCountry = basePath[2].childNodes[1].children[0].value;
    const spotRegion = basePath[2].childNodes[2].children[0].value;
    const spotWindDirection = basePath[2].childNodes[3].children[0].value;
    const spotId = basePath[2].childNodes[4].innerHTML;
    console.log(`Se enviara una consulta con los siguientes datos: Name: ${spotName}, Country: ${spotCountry}, Region: ${spotRegion}, WindDirection: ${spotWindDirection}, Id: ${spotId}`);
    try {
        const response = await fetch('http://localhost:4001/newspot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: spotName,
                countryCode: spotCountry,
                regionCode: spotRegion,
                windDirection: spotWindDirection,
            })
        });
        const data = await response.json();
        alert("Spot creado con exito");
        closeModal(modal);
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

const editSpotOnDb = async (event) => {
    const basePath = event.path
    const spotName = basePath[2].childNodes[0].children[0].value;
    const spotCountry = basePath[2].childNodes[1].children[0].value;
    const spotRegion = basePath[2].childNodes[2].children[0].value;
    const spotWindDirection = basePath[2].childNodes[3].children[0].value;
    const spotId = basePath[2].childNodes[4].innerHTML;
    console.log(`Se enviara una consulta con los siguientes datos: Name: ${spotName}, Country: ${spotCountry}, Region: ${spotRegion}, WindDirection: ${spotWindDirection}, Id: ${spotId}`);
    try {
        const response = await fetch('http://localhost:4001/spotEdit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: spotName,
                countryCode: spotCountry,
                regionCode: spotRegion,
                windDirection: spotWindDirection,
                id: spotId
            })
        });
        const data = await response.json();
        alert("Spot editado con exito");
        closeModal(modal);
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

/*populateList(countryName, "option", countryData, "shortCode", "name"); */

const populateList = (elementId, htmlType, data, value, text) => {
    for(let i = 0; i < data.length; i++){
        let newElement = document.createElement(htmlType);
        newElement.value = data[i][value];
        newElement.text = data[i][text];
        elementId.appendChild(newElement);
    }
};

const getCountries = async () =>{
    try {
        let response = await fetch('http://localhost:4001/countries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        let data = await response.json();
        if (response.ok){
            return data;
        }
    } catch (error){
        console.log(error);
    }
}

const getRegions = async (countryCode) =>{
    try {
        let response = await fetch(`http://localhost:4001/${countryCode}/cities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        let data = await response.json();
        if (response.ok){
            return data;
        }
    } catch (error){
        console.log(error);
    }
    }


    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    const get = async (param) =>{
        try {
            let response = await fetch(`http://localhost:4001/${param}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            });
            let data = await response.json();
            if (response.ok){
                return data;
            }
        } catch (error){
            // TODO: Manejor de errores
            console.log(error);
        }
    }

function openModal (modal) {
    if(modal == null) return 
    else{
    modal.classList.add('active');
    overlay.classList.add('active');
}
}


function closeModal (modal) {
    if(modal ==null) return
    modal.classList.remove('active');
    overlay.classList.remove('active');
}
