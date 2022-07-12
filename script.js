/* La base de datos de paises regiones esta incorrecta, en chile da Marga Marga que es una provincia */

/*Aseguramos que se cargue window antes de empezar a crear y generar elementos*/
window.onload = () => {
    let countriesSelector = document.getElementById('countries');
    let selectCountry = document.getElementById('selectCountry');
    let findSpot = document.getElementById('findSpot');
    let spotList = document.getElementById('spotList');
    getCountries().then(data => {
        populateList(countriesSelector, "option", data, "code", "country")
    }).catch(error => {
        console.log(error);
    });
    selectCountry.onclick = () => {
        let countriesSelector = document.getElementById('countries');
        let countryCode = countriesSelector.options[countriesSelector.selectedIndex].value;
        console.log(`Se ingresa a elegir regiones de pais con codigo ${countryCode}`);
        getRegions(countryCode).then(data => {
            let regionSelector = document.getElementById('region');
            removeAllChildNodes(regionSelector);
            populateList(regionSelector, "option", data, "shortCode", "name");

        }).catch(error => {console.log(error);});
            findSpot.style.display = "inline";
            findSpot.onclick = () => {
                get('spot').then(data => {    
                removeAllChildNodes(spotList);
                for(let i=0; i<data.rows.length; i++){
                    let newSpot = document.createElement('tr');
                    let newSpotName = document.createElement('td');
                    newSpotName.innerHTML = data.rows[i].name;
                    let spotCountry = document.createElement('td');
                    spotCountry.innerHTML = data.rows[i].countryCode;
                    let spotRegion = document.createElement('td');
                    spotRegion.innerHTML = data.rows[i].regionCode;
                    let windDirection = document.createElement('td');
                    windDirection.innerHTML = data.rows[i].windDirection;
                    newSpot.appendChild(newSpotName);
                    newSpot.appendChild(spotCountry);
                    newSpot.appendChild(spotRegion);
                    newSpot.appendChild(windDirection);
                    spotList.appendChild(newSpot);
                }
            });}
    }
};


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
        // TODO: Manejor de errores
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

