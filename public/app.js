const createRestaurant = document.querySelector('.create_restaurant')
createRestaurant.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = createRestaurant.querySelector('.name').value
    const neighborhood = createRestaurant.querySelector('.neighborhood').value
    const photography = createRestaurant.querySelector('.photography').value
    const address = createRestaurant.querySelector('.address').value
    const latlng = createRestaurant.querySelector('.latlng').value
    const cuisineType = createRestaurant.querySelector('.cuisine_type').value
    const operatingHours = createRestaurant.querySelector('.operating_hours').value
    post('/createRestaurant', { name, neighborhood, photography, address, latlng, cuisineType, operatingHours })
})

document.getElementById('get_restaurant').addEventListener('click', (e) => {
    e.preventDefault();
    fetch('/getRestaurant')
        .then((res) => {console.log(res); return res.json()})
        .then((res) => {console.log(res)})



})


function post (path, data) {
    return window.fetch(path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}