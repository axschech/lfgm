function data(url, d, type) {
    type = type || 'POST'
    
    let payload = {
        method: type,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') || false
        }
    };

    if (payload.method === "POST") {
        payload.body = JSON.stringify(d);
    }

    try {
        return fetch(url, payload)
           
    } catch (error) {
        console.log(error, "error")
    }
   
    
}


const parseToken = token => JSON.parse(atob(token.split('.')[1]))

document.querySelector("#sign-up-form").addEventListener('submit', function(e) {
    e.preventDefault()
    data("http://localhost:9001/register", {
        email: this[0].value,
        user: this[1].value,
        password: this[2].value
    })
});

document.querySelector("#token-check").addEventListener('click', function(e) {
    e.preventDefault();

    const token = parseToken(localStorage.getItem('token'))

    data(
        'http://localhost:9001/user/' + token.id, 
        {},
        'GET'
    ).then(function (response) {
        return response.json();
    }).then(function (data) {
        return data;
    });
})
document.querySelector("#login-form").addEventListener('submit', function(e) {
    e.preventDefault();
    data("http://localhost:9001/login", {
        email: this[0].value,
        password: this[1].value
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data)
        localStorage.setItem('token', data.token)
    });
});