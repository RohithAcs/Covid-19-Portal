var division = document.getElementById("fetchedData");
var arr = [];
var data = "";
var isState = true;
var sortingOrder = true;
var state = {
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

//  Getting the Covid19 details from json endpoints,via asynchronous request using XHR.

/**
 *   "data" variable has the object data.
 *  using "push" method adding data into an array.
 *   calling "createStateTable" function passing argument as array="arr".
 */
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://data.covid19india.org/v4/min/data.min.json');
xhr.onreadystatechange = function () {
    if (xhr.readyState == 3) {
        console.log("Loading");
    }
    if (xhr.readyState == 4 && xhr.status === 200) {
        data = JSON.parse(xhr.response);
        var states = Object.getOwnPropertyNames(data);
        for (var i = 0; i < states.length; i++) {
            var stateDetails = data[states[i]];
            if (state[states[i]]) {
                arr.push([stateDetails.meta.date, state[states[i]], states[i], stateDetails.meta.population, validateData(stateDetails.delta7.confirmed), stateDetails.total.confirmed, validateData(stateDetails.delta7.recovered), stateDetails.total.recovered, validateData(stateDetails.delta7.deceased), stateDetails.total.deceased, stateDetails.total.tested, stateDetails.total.vaccinated1, stateDetails.total.vaccinated2]);
            } else {
                division.innerHTML = "<h1 id='error'>Error Occurred</h1>"
            }
        }
        createStateTable(arr);
    }
}
xhr.send();


//if any errors occurs in API then it will print "Some Error Occurred".
xhr.onerror = function () {
    division.innerHTML = "<h1 id='error'>Some Error Occurred</h1>"
}


/**
 * The state table is created and passed as an argument in the function "pushTable". 
 * @param {array} data 
 */
function createStateTable(data) {
    isState = true;
    if (data.length > 0) {
        var table = "<table id='myTable'><tr> <th> Date </th> <th> State </th> <th data-id='3' >Population</th> <th data-id='5'>Confirmed</th> <th data-id='7'>Recovered</th> <th data-id='9'>Deceased</th> <th data-id='10'>Tested</th> <th data-id='11'>Vaccinated dose1</th>  <th data-id='12'>Vaccinated dose2</th> </tr>";
        for (var i = 0; i < data.length; i++) {
            table += "<tr> <td>" + data[i][0] + "</td> <td><a href=" + data[i][1] + " class='state' data-stateName=" + data[i][2] + " >" + data[i][1] + "</a></td><td>" + data[i][3] + "</td> <td> [<span style='color:red'>&#8593;" + data[i][4] + "</span>] " + data[i][5] + "</td> <td>[<span style='color:red'>&#8593;" + data[i][6] + "</span>] " + data[i][7] + "</td> <td>[<span style='color:red'>&#8593;" + data[i][8] + "</span>] " + data[i][9] + "</td> <td>" + data[i][10] + "</td> <td>" + data[i][11] + "</td> <td>" + data[i][12] + "</td> </tr>";
        }
        table += "</table>";
        pushTable(table);
    } else {
        division.innerHTML = "<h1 id='error'>Error Occurred</h1>";
    }
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
            division.innerHTML = getDistrictDetails(data[e.target.dataset.statename]);
            stateName(state[e.target.dataset.statename]);
        }
    })
}

/**
 * The district details is created and returned back to the function to print the data.
 * @param {object} stateDetails 
 * @returns string 
 */
function getDistrictDetails(stateDetails) {
    isState = false;
    var districtNames = Object.getOwnPropertyNames(stateDetails.districts);
    var districtDetails = stateDetails.districts;
    var table = " <input type='button' id='btn' value='Back' onclick='createStateTable(arr)'><h2 id='district' style='color:red'></h2><table id='myTable'><tr> <th>Date</th> <th> District </th> <th>Population</th> <th>Confirmed</th> <th>Deceased</th> <th>Recovered</th> <th>Vaccinated dose1</th> <th>Vaccinated dose2</th>  </tr>";
    for (var i = 0; i < districtNames.length; i++) {
        var district = districtNames[i];
        var data = Object.assign({}, districtDetails[district].meta, districtDetails[district].total);
        table += "<tr> <td>" + stateDetails.meta.date + "</td> <td>" + district + "</td> <td>" + validateData(data.population) + "</td> <td>" + validateData(data.confirmed) + "</td> <td>" + validateData(data.deceased) + "</td> <td>" + validateData(data.recovered) + "</td> <td>" + validateData(data.vaccinated1) + "</td> <td>" + validateData(data.vaccinated2) + "</td> </tr>";
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
        customSortArray(parseInt(e.target.dataset.id));
    }
});

/**
 * Sorting the state details using bubble sort. 
 * @param {number} id 
 * @param {array} data 
 */
function customSortArray(id, data = arr) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < (data.length - i - 1); j++) {
            if (sortingOrder) {
                if (data[j][id] > data[j + 1][id]) {
                    var temp = data[j]
                    data[j] = data[j + 1]
                    data[j + 1] = temp
                }
            } else {
                if (data[j][id] < data[j + 1][id]) {
                    var temp = data[j]
                    data[j] = data[j + 1]
                    data[j + 1] = temp
                }
            }
        }
    }
    sortingOrder = !sortingOrder;
    createStateTable(data);
}

/*
 *   when we execute the event onkeyup it will call the function "search".
 *   It will check the each letter in the state and district names that we searched.    
 */
function search() {
    var filter = document.getElementById("myInput").value.toUpperCase();
    var myTable = document.getElementById("myTable");
    var tr = myTable.getElementsByTagName("tr");
    for (var i = 1; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName('td')[1];
        if (td) {
            var textValue = td.textContent || td.innerHTML;

            if (textValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
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