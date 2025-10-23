const express = require('express');
const path = require('path');
require('dotenv').config();

function server() {
    const app = express();
    const PORT = process.env.PORT;

    const dashboard = path.join(__dirname, `../dashboard/dist`);

    app.use(express.static(dashboard));

    app.get('*', (req, res) => {
        res.sendFile(path.join(dashboard, 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`🌍 Servidor web corriendo en http://localhost:${PORT}`)
    });
}

module.exports = { server };