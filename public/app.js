function postData(url, d) {
    try {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(d),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || false
            }
        })
           
    } catch (error) {
        console.log(error, "error")
    }
   
    
}

document.querySelector("#sign-up-form").addEventListener('submit', function(e) {
    e.preventDefault()
    postData("http://localhost:9001/register", {
        email: this[0].value,
        user: this[1].value,
        password: this[2].value
    })
});

document.querySelector("#token-check").addEventListener('click', function(e) {
    e.preventDefault();
    postData(
        'http://localhost:9001/checkToken/1', 
        {}
    ).then(function (response) {
        return response.json();
    }).then(function (data) {
        return data;
    });
})
document.querySelector("#login-form").addEventListener('submit', function(e) {
    e.preventDefault();
    postData("http://localhost:9001/login", {
        email: this[0].value,
        password: this[1].value
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        localStorage.setItem('token', data)
    });
});