let division = document.getElementById("fetchedData");
let searchBar = document.getElementById("myInput");
let arr = [];
let isState = true;
let sortingOrder = true;
let fetchedData = "";
let state = {
    AN: "Andaman and Nicobar Islands",
    AP: "Andhra Pradesh",
    AR: "Arunachal Pradesh",
    AS: "Assam",
    BR: "Bihar",
    CT: "Chhattisgarh",
    GA: "Goa",
    GJ: "Gujarat",
    HR: "Haryana",
    HP: "Himachal Pradesh",
    JH: "Jharkhand",
    KA: "Karnataka",
    KL: "Kerala",
    MP: "Madhya Pradesh",
    MH: "Maharashtra",
    MN: "Manipur",
    ML: "Meghalaya",
    MZ: "Mizoram",
    NL: "Nagaland",
    OR: "Odisha",
    PB: "Punjab",
    RJ: "Rajasthan",
    SK: "Sikkim",
    TN: "Tamil Nadu",
    TG: "Telangana",
    TR: "Tripura",
    UL: "Uttarakhand",
    UP: "Uttar Pradesh",
    WB: "West Bengal",
    CH: "Chandigarh",
    DN: "Dadra and Nagar Haveli",
    DD: "Daman and Diu",
    DL: "Delhi",
    JK: "Jammu and Kashmir",
    LA: "Ladakh",
    LD: "Lakshadweep",
    PY: "Pondicherry",
    UT: "Uttarakhand",
    TT: "Tottempudi"

};

let data = "https://data.covid19india.org/v4/min/data.min.json";
fetch(data)
    .then(x => x.json())
    .then(y => {
        fetchedData = y;
        var states = Object.getOwnPropertyNames(fetchedData);
        for (let i = 0; i < states.length; i++) {
            let stateDetails = fetchedData[states[i]];
            arr.push([stateDetails.meta.date, state[states[i]], states[i], stateDetails.meta.population, validateData(stateDetails.delta7.confirmed), stateDetails.total.confirmed, validateData(stateDetails.delta7.recovered), stateDetails.total.recovered, validateData(stateDetails.delta7.deceased), stateDetails.total.deceased, stateDetails.total.tested, stateDetails.total.vaccinated1, stateDetails.total.vaccinated2]);
        }
        createStateTable(arr);
    })
    .catch((error) => {
        division.innerHTML = `<h1 id='error'>Error:${error}</h1>`;
    });


/**
 * The state table is created in this function and passed as an argument in the function "pushTable". 
 * @param {array} data 
 */
function createStateTable(data) {
    searchBar.value = "";
    isState = true;
    var table = `<table id='myTable'><tr> <th> Date </th> <th> State </th> <th data-id='3' >Population</th> <th data-id='5'>Confirmed</th> <th data-id='7'>Recovered</th> <th data-id='9'>Deceased</th> <th data-id='10'>Tested</th> <th data-id='11'>Vaccinated dose1</th>  <th data-id='12'>Vaccinated dose2</th> </tr>`;
    if (data.length > 0) {
        for (element of data) {
            table += `<tr> <td>${element[0]}</td> <td><a href=${element[1]} class='state' data-date=${element[0]} data-stateName=${element[2]}>${element[1]}</a></td><td>${element[3]}</td> <td> [<span style='color:red'>&#8593;${element[4]}</span>]${element[5]}</td> <td>[<span style='color:red'>&#8593;${element[6]}</span>] ${element[7]}</td> <td>[<span style='color:red'>&#8593;${element[8]}</span>] ${element[9]}</td> <td>${element[10]}</td> <td>${element[11]}</td> <td>${element[12]}</td> </tr>`;
        }
    } else {
        division.innerHTML = `<h1 id='error'>Error Occurred</h1>`;
    }
    table += `</table>`;
    pushTable(table);
}

/**
 * When we click on the state using event delegation, it will select the state details and passed as argument in the function "getDistrictDetails".  
 * @param {string} table 
 */
function pushTable(table) {
    division.innerHTML = table;
    division.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
            e.preventDefault();
            division.innerHTML = getDistrictDetails(fetchedData[e.target.dataset.statename], e.target.dataset.date);
            stateName(state[e.target.dataset.statename]);
        }
    })
}


/**
 * 
 * @param {object} stateDetail 
 * @param {number} date 
 * @returns string
 */
function getDistrictDetails(stateDetail, date) {
    searchBar.value = "";
    isState = false;
    var districtNames = Object.getOwnPropertyNames(stateDetail.districts);
    var districtDetails = stateDetail.districts;
    var table = ` <input type='button' id='btn' value='Back' onclick='createStateTable(arr)'><h2 id='district' style='color:red'></h2><table id='myTable'><tr> <th>Date</th> <th> District </th> <th>Population</th> <th>Confirmed</th> <th>Deceased</th> <th>Recovered</th> <th>Vaccinated dose1</th> <th>Vaccinated dose2</th>  </tr>`;
    if (districtNames.length>0) {
    for (var i = 0; i < districtNames.length; i++) {
        var district = districtNames[i];
        var data = {
            ...districtDetails[district].meta,
            ...districtDetails[district].total
        };
        
            table += `<tr> <td>${date}</td> <td>${district}</td> <td>${validateData(data.population)}</td> <td>${validateData(data.confirmed)}</td> <td>${validateData(data.deceased)}</td> <td>${validateData(data.recovered)}</td> <td>${validateData(data.vaccinated1)}</td> <td>${validateData(data.vaccinated2)}</td> </tr>`;
        } 
    }
    else {
        division.innerHTML = `<h1 id='error'>Error Occurred</h1>`;
    }
    table += "</table>";
    return table;
}

/**
 * To print the state Name on the District table.
 * @param {string} Name 
 */
function stateName(Name) {
    var title = document.getElementById("district");
    title.innerHTML = Name;
}


division.addEventListener("click", function (e) {
    if (e.target.tagName === "TH" && isState) {
        sortArray(e.target.dataset.id);
    }
});

/**
 * Sorting the state details using sort method. 
 * @param {number} id 
 * @param {array} data 
 */

function sortArray(id, data = arr) {
    if(data.length > 0){
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < (data.length - i - 1); j++) {

            data.sort((a, b) => {
                if (sortingOrder) {
                    return a[id] - b[id];
                } else {
                    return b[id] - a[id];
                }
            })
        }
    }
    sortingOrder = !sortingOrder;
    createStateTable(data);
    }else{
        division.innerHTML = `<h1 id='error'>Error Occurred</h1>`;   
    }
}
/*
 *   when we execute the event onkeyup it will call the function "search".
 *   It will check the each letter in the state and district names that we searched.    
 */
function search() {
    let filter = searchBar.value.toUpperCase();
    let myTable = document.getElementById("myTable");
    var tr = myTable.getElementsByTagName("tr");
    if(tr.length > 0){
    for (var i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[1];
        if (td) {
            let textValue = td.textContent || td.innerHTML;

            if (textValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }}
    else{
        division.innerHTML = `<h1 id='error'>Error Occurred</h1>`;   
    }
}
/**
 * 
 * @param {number} value 
 * @returns string or number
 */
function validateData(value) {
    return value ? value : "-";
}