
let newCountry = document.createElement("option");
newCountry.value = "Bolivia";
newCountry.id = "BO";
newCountry.text = "Bolivia";
console.log(newCountry)



/*Aseguramos que se cargue window antes de empezar a crear y generar elementos*/
window.onload = () => {
    let countriesSelector = document.getElementById('countries');
    getCountries().then(data => {
        for (let i = 0; i < data.length; i++) {
            let newCountry = document.createElement("option");
            newCountry.value = data[i].name;
            newCountry.id = data[i].code;
            newCountry.text = data[i].name;
            countriesSelector.appendChild(newCountry);
        }
    }).catch(error => {
        console.log(error);
    })
}

/*
newCountry.value = "Bolivia";
countriesSelector.appendChild(newCountry)
*/

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
            console.log(data[0].name)
            return data;
        }
    } catch (error){
        // TODO: Manejor de errores
        console.log(error);
    }
}

let countries = getCountries();

