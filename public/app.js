function postData(url, d) {
    try {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(d),
            headers: {'Content-Type': 'application/json'}
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

document.querySelector("#login-form").addEventListener('submit', function(e) {
    e.preventDefault();
    postData("http://localhost:9001/login", {
        email: this[0].value,
        password: this[1].value
    });
});