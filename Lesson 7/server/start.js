const express = require('express');
const fs = require('fs');

const port = 3000;
const static_dir = '../public';

const app = express();

app.use(express.json());
app.use(express.static(static_dir));

app.get('/catalogData', (req, res) => {
    fs.readFile('data/catalog.json', 'utf8', (err, data) => {
        res.send(data);
    })
});

app.get('/cart', (req, res) => {
    fs.readFile('data/cart.json', 'utf8', (err, data) => {
        res.send(data);
    })
});

app.post('/addToCart', (req, res) => {
    fs.readFile('data/cart.json', "utf8", (err, data) => {
        const cart = JSON.parse(data);
        const item = req.body;
        item.quantity = 1;

        console.log(data, item)

        if (cart.some(e => e.id_product === item.id_product)) {
            const index = cart.findIndex(e => e.id_product === item.id_product);
            ++cart[index].quantity;
        } else {
            cart.push(item);
        }

        fs.writeFile('data/cart.json', JSON.stringify(cart), (err) => {
            console.log('Item added');
            res.end();
        });

        fs.readFile('data/stats.json', 'utf8', (err, data) => {
            const log = JSON.parse(data);

            const logInfo = {
                title: item.product_name,
                time: new Date()
            };

            log[0].ADDED.push(logInfo);

            fs.writeFile('data/stats.json', JSON.stringify(log), (err) => {
                res.end();
            });
        });
    });
});

app.delete('/removeFromCart', (req, res) => {
    fs.readFile('data/cart.json', "utf8", (err, data) => {
        const cart = JSON.parse(data);
        const item = req.body;
        const index = cart.findIndex((e) => e.id_product === item.id_product)

        if (cart.some(e => e.id_product === item.id_product)) {
            if (cart[index].quantity > 1) {
                --cart[index].quantity;
            } else {
                cart.splice(index, 1)
            }
        } else {
            cart.splice(index, 1)
        }

        fs.writeFile('data/cart.json', JSON.stringify(cart), (err) => {
            console.log('Item deleted');
            res.end();
        });

        fs.readFile('data/stats.json', 'utf8', (err, data) => {
            const log = JSON.parse(data);

            const logInfo = {
                title: item.product_name,
                time: new Date()
            };

            log[1].DELETED.push(logInfo);

            fs.writeFile('data/stats.json', JSON.stringify(log), (err) => {
                res.end();
            });
        });
    });
});

app.listen(port, function () {
    console.log(`Server is running on port ${port} !`)
});