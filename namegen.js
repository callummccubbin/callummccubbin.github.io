let currentIndex = resetIndex();
var wb = false;

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

    countSlider = document.getElementById("numberOfNames");
    count = countSlider.value;
    console.log(count, "is the count")

    let output = "";
    for (i = 0; i <= count; i++) {
        let name = getName(index);
        output = output + " " + name;
    }
    document.getElementById("output").innerHTML = output;
    return output;
}

function addSet(index, data) {

    data = document.getElementById(data).value;
    console.log(data);
    let dataSet = data.split(", ");

    for (let item of dataSet) {
        console.log(item);
        item = item.toLowerCase();
        index = addIndex(index, item);
    }

    console.log(index, "is the index");
    console.log(currentIndex, "is the currentIndex");
    return index;

}

function addCarz(index) {
    let data = [
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

function getName(index) {

    let name = "";
    console.log(name);
    let currentLetter = pickLetter(index, 96);
    name += currentLetter;

    while(currentLetter != ' ') {
        currentLetter = pickLetter(index, currentLetter.charCodeAt(0));

        if(wb == true && Math.round(10 * Math.random())) {
            name += "'";
        }

        name += currentLetter;
    }
    console.log(name, "is the full name");
    return name;
}

function pickLetter(index, input) {

    let row = index[input - 96];
    console.log(input - 96, "is the row");
    console.log(row, "is the row content");
    let num = Math.round((row.length - 1) * Math.random());
    console.log(num, "is the num");

    let letter = row.charAt(num);
    console.log(letter, "is the letter")
    return letter;
}