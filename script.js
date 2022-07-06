/* La base de datos de paises regiones esta incorrecta, en chile da Marga Marga que es una provincia */

/*Aseguramos que se cargue window antes de empezar a crear y generar elementos*/
window.onload = () => {
    let countriesSelector = document.getElementById('countries');
    let selectCountry = document.getElementById('selectCountry');
    getCountries().then(data => {
        for (let i = 0; i < data.length; i++) {
            let newCountry = document.createElement("option");
            newCountry.value = data[i].code;
            newCountry.text = data[i].country;
            countriesSelector.appendChild(newCountry);
        }
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
            for (let i = 0; i < data.length; i++) {
                let newRegion = document.createElement("option");
                newRegion.value = data[i].shortCode;
                newRegion.text = data[i].name;
                regionSelector.appendChild(newRegion);
            }}).catch(error => {console.log(error);});
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
    }
    }


    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }