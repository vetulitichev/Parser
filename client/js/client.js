fetch('http://localhost:3000/news/10', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    method: "GET"
})
    .then(function (res) {
        return res.json()
    })
    .then((data) => {

        console.log(data);
        for (let item = 0; item < data.length; item++) {
            let header = `<h3>${data[item].header}</h3>`;
            let mainIfo = `<p>${data[item].mainInfo}</p>`;
            let img = `<img src="${data[item].img}">`;
            let url = `<a href=${data[item].url}>Ссылка на оригинал</a>`;

            document.body.innerHTML += header + img + mainIfo + url;
        }
    });