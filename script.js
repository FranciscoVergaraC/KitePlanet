
let newCountry = document.createElement("option");
newCountry.value = "Bolivia";
newCountry.id = "BO";
newCountry.text = "Bolivia";

let selectContry = document.getElementById('selectContry');


/*Aseguramos que se cargue window antes de empezar a crear y generar elementos*/
window.onload = () => {
    let countriesSelector = document.getElementById('countries');
    getCountries().then(data => {
        for (let i = 0; i < data.length; i++) {
            let newCountry = document.createElement("option");
            newCountry.value = data[i].country;
            newCountry.id = data[i].code;
            newCountry.text = data[i].country;
            countriesSelector.appendChild(newCountry);
        }
    }).catch(error => {
        console.log(error);
    });
    selectContry.onclick = () => {
        let countrySelector = document.getElementById('countries');
        
        getCities(countryCode).then(data => {
            let citiesSelector = document.getElementById('cities');
            citiesSelector.innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                let newCity = document.createElement("option");
                newCity.value = data[i].city;
                newCity.id = data[i].code;
                newCity.text = data[i].city;
                citiesSelector.appendChild(newCity);
            }

    });

    getCities(`CN`).then(
        console.log('request success')
    );
}};

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

const getCities = async (countryCode) =>{
    console.log('getcities called');
    try {
        let response = await fetch(`http://localhost:4001/${countryCode}/cities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        let data = await response.json();
        if (response.ok){
            console.log(data)
            return data;
        }
    } catch (error){
    }
    }

let countries = getCountries();

