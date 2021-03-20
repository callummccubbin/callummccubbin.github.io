let currentIndex = resetIndex();
var wb = false;

var countSlider = document.getElementById("numberOfNames");
var minSlider = document.getElementById("minLength");
var maxSlider = document.getElementById("maxLength");

var countSliderOutput = document.getElementById("numberOfNamesOutput");
var minLengthOutput = document.getElementById("minLengthOutput");
var maxLengthOutput = document.getElementById("maxLengthOutput");
countSliderOutput.innerHTML = countSlider.value;
minLengthOutput.innerHTML = minSlider.value;
maxLengthOutput.innerHTML = maxSlider.value;

let dataCars = [
    "Ford",
    "Mercedes",
    "Chevrolet",
    "Subaru",
    "Jeep",
    "Buick",
    "Mclaren",
    "Honda",
    "Nissan",
    "Acura",
    "Audi",
    "Tesla",
    "Cadillac",
    "Mazda",
    "Volkswagen",
    "Volvo",
    "Porsche",
    "Suzuki",
    "Chrysler",
    "Maserati",
    "Ferrari",
    "Fiat"
]

let dataGreek = [
    "Aphrodite",
    "Apollo",
    "Ares",
    "Artemis",
    "Athena",
    "Demeter",
    "Dionysus",
    "Hades",
    "Hephaestus",
    "Hera",
    "Hermes",
    "Hestia",
    "Poseidon",
    "Zeus",
    "Enceladus",
    "Porphyrion",
    "Lethe",
    "Medusa",
    "Helios",
    "Achilles",
    "Ariadne",
    "Ajax",
    "Daedalus",
    "Diomedes",
    "Minos",
    "Theseus",
    "Jason",
    "Odysseus",
    "Orpheus",
    "Perseus",
    "Pandora",
    "Agamemnon",
    "Oedipus",
    "Peleus",
    "Midas",
    "Tyndareus",
    "Patroclus",
    "Atreus",
    "Circe",
    "Menelaus"
]


countSlider.oninput = function() {
    countSliderOutput.innerHTML = this.value;
}

minSlider.oninput = function() {
    minLengthOutput.innerHTML = this.value;
}

maxSlider.oninput = function() {
    maxLengthOutput.innerHTML = this.value;
}

function resetIndex() {
    let index = new Array(27);

    console.log(index);
    return index;
}

function wbcheck() {
    checkBox = document.getElementById("wbcheck");
    //console.log(wb);
    wb = checkBox.checked;
}


function generateNames(index) {

    count = countSlider.value;
    let min = Math.min(minSlider.value, maxSlider.value);
    let max = Math.max(maxSlider.value, minSlider.value);
    
    //console.log(count, "is the count")
    //console.log(min, "is the min");
    //console.log(max, "is the max");

    //console.log(index[0] == undefined);

    let output = "";
    let tries = 0;

    if (index[0] == undefined) {
        output = "Error: index is empty. Add words to it or select a preset index"
    } else {
        for (i = 0; i < count; i++) {
            let name = getName(index, max);
            //console.log(name.length, "name length");
            if(name.length <= min) {
                i--;
                tries++;
                if(tries > 1000) {
                    output = "Error. Maximum number of tries reached. Change parameters or index.";
                    break;
                }
            } else {
                output = output + " " + name;
            }
        }
    }

    document.getElementById("output").innerHTML = output;
    return output;
}

function addSet(index, dataToAdd) {

    data = document.getElementById(dataToAdd).value;
    //console.log(document.getElementById(dataToAdd).value);
    //console.log(data);
    let dataSet = data.split(", ");

    for (let item of dataSet) {
        words = item.split(" ");
        for (let word of words) {
            word = word.toLowerCase();
            index = addIndex(index, word);
        }
    }

    //console.log(index, "is the index");
    //console.log(currentIndex, "is the currentIndex");
    document.getElementById(dataToAdd).value = "";
    return index;

}

function addPreset(index, data) {

    for (let item of data) {
        item = item.toLowerCase();
        index = addIndex(index, item);
    }
    console.log(index);
    return index;
}

function append(base, add) {
    if (base === undefined) {
        base = add;
    } else {
        base = base + add;
    }
    return base;
}

function addIndex(index, data) {
    data = data += ' ';
    //console.log(data, "G", "L");
    index[0] = append(index[0], data.charAt(0));

    let pos = 1;
    let val = data.charCodeAt(pos - 1);
    //console.log(data.charCodeAt(pos - 1), "should be val");

    while(val != 32) {

        //console.log(val, "is val")

        index[val - 96] = append(index[val - 96], data.charAt(pos))

        //console.log(index[val - 96], "is new the index point")
        pos++;
        val = data.charCodeAt(pos - 1);
        if (pos > 100) {
            break;
        }
    }

    return index;
}

function getName(index, max) {

    let name = "";
    //console.log(name);
    let currentLetter = pickLetter(index, 96);
    name += currentLetter;

    while(currentLetter != ' ') {
        currentLetter = pickLetter(index, currentLetter.charCodeAt(0));

        if((wb == true) && (Math.round(4 * Math.random()) == 0)) {
            name += "'";
        }
        //console.log(name.length, "is the length");
        //console.log(max, "is the max");
        if(name.length >= max) {
            break;
        }

        name += currentLetter;
    }
    //console.log(name, "is the full name");
    return name;
}

function pickLetter(index, input) {

    let row = index[input - 96];
    //console.log(input - 96, "is the row");
    //console.log(row, "is the row content");
    let num = Math.round((row.length - 1) * Math.random());
    //console.log(num, "is the num");

    let letter = row.charAt(num);
    //console.log(letter, "is the letter")
    return letter;
}
