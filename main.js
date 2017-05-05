function getInfo(html, url) {

    const jsdom = require("jsdom");
    const {JSDOM} = jsdom;
    const dom = new JSDOM(html);
    let news = {
        header: '',
        mainInfo: '',
        img: '',
        url: url
    };

    news.header = dom.window.document.querySelector('div.text_header').textContent;

    let mainInfo = dom.window.document.querySelector('div.static').querySelectorAll('p');
    for (let item = 0; item < mainInfo.length; item++) {

        news.mainInfo += mainInfo[item].textContent

    }
    news.img = dom.window.document.querySelector('div.img-block>img').getAttribute('src');
    return news;

}


function parseHTML(arr) {
    let https = require('https');
    let result = [];
    return new Promise(resolve => {
        for (let i = 0; i < arr.length; i++) {
            let htmlPage;
            let url = arr[i].guid[0];
            https.get(url, (chunk) => {

                chunk.on('error',(error)=>{
                   console.log(error);
                });

                chunk.on('data', (data) => {
                    htmlPage += data
                });
                chunk.on('end', () => {
                    result.push(getInfo(htmlPage, url));
                    if (result.length == arr.length) {
                        resolve(result);
                    }
                })
            })
        }
    });


}
function parse(app) {

    let https = require('https');
    let xml2js = require('xml2js');
    let parser = new xml2js.Parser();
    let concat = require('concat-stream');

    parser.on('error', function (err) {
        console.log('Parser error', err);
    });

    app.get('/news/:count', (req, res) => {

        https.get('https://www.057.ua/rss', function (resp) {

            resp.on('error', function (err) {
                console.log('Error while reading', err);
            });

            resp.pipe(concat(function (buffer) {
                let str = buffer.toString();
                parser.parseString(str, function (err, result) {
                    let list = result.rss.channel[0].item.splice(0, req.params.count);
                    parseHTML(list).then(resolve => {
                        res.send(JSON.stringify(resolve));
                        res.render('index', {
                            title: 'index.html'
                        });
                    });
                });
            }));

        });

    });
}


module.exports = function (app) {
    parse(app);
};
