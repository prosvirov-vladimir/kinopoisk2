let btn_search = document.getElementById('btn_search');
let results = document.getElementById('results');

const url = 'https://www.omdbapi.com/?apikey=23f82659';

function sendRequest(url) {
    return fetch(url).then(response => { return response.json()} )
}

btn_search.addEventListener('click', function() {
    requestUrl = currentUrl();
    sendRequest(requestUrl)
        .then(data => (console.log(data), result(data)))
        .catch(err => (console.log('error data', err)))
});

function currentUrl() {
    title = document.getElementById('title').value;
    types = document.querySelectorAll('option');
    let type;
    for (type of types) {
        if (type.selected) {
            type = type.value;
            break
        }
    }

    if (title !='') {
        curl = url + '&s=' + title + '&type=' + type;
    } else {
        curl = url;
    }
    return curl;
}

function result(data) {
    if (data['Response'] == "True") {
        count_result = document.createElement('h3');
        count_result.innerHTML = "Найденно: " + data['totalResults'] + " результатов";
        results.append(count_result);
        get_movie(data['Search'])
    } else {
        error = document.createElement('h3');
        error.innerHTML = "Ничего не найденно";
        results.append(error);
        console.log('error not found');
    }
}

function get_movie(array) {
    for (let i = 0; i < array.length; i++) {
        block_movie(array[i]);
    }
}

function block_movie(obj) {
    // title
    title = document.createElement('h3');
    title.innerHTML = obj["Title"];
    results.append(title);
    // year
    year = document.createElement('p');
    year.innerHTML = "<strong>Год: </strong>" + obj["Year"];
    results.append(year);
    // poster
    poster = document.createElement('div');
    if (obj["Poster"] == 'N/A') {
        poster.innerHTML = '<img style="width:150px; height: 300px;" src="https://st.kp.yandex.net/images/no-poster.gif">';
    } else {
        poster.innerHTML = '<img style="width:150px; height: 300px;" src="' + obj["Poster"] + '">';
    }
    results.append(poster);
    // btn with details
    btn_details = document.createElement('input');
    btn_details.type = "button";
    btn_details.id = obj["imdbID"];
    btn_details.value = "Показать подробную информацию";
    results.append(btn_details);
    btn_details.addEventListener('click', show_details);
}

show_details = Event => {
    id = Event.currentTarget.id;
    requestUrl = url + "&i=" + id;
    sendRequest(requestUrl)
        .then(data => (console.log(data), block_info(id, data)))
        .catch(err => console.log('error data', err))
}

function block_info(id, data_json) {
    btn = document.getElementById(id);
    console.log(btn);
    table = document.createElement("table");
    for (element in data_json) {
        if (data_json[element] !== "N/A" && element !== "Response") {
            if (element == "Ratings") {
                table.innerHTML += "<tr><th>" + element + "</th><td>" + data_json[element][0]["Source"] + " - " + data_json[element][0]["Value"] + "</td></tr>";
                table.innerHTML += "<tr><td></td><td>" + data_json[element][1]["Source"] + " - " + data_json[element][1]['Value'] + "</td></tr>";
                table.innerHTML += "<tr><td></td><td>" + data_json[element][2]["Source"] + " - " + data_json[element][2]['Value'] + "</td></tr>";
            } else {
                table.innerHTML += "<tr><th>" + element + "</th><td>" + data_json[element] + "</td></tr>";
            }
        }
        table.innerHTML += "</table>"
        btn.after(table);
    }
}
