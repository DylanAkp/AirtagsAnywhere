const express = require('express')
const fs = require('fs');
var cors = require('cors')
const app = express()
const port = 3890

app.use(cors())

app.get('/json', (req, res) => {
    try {
        const data = fs.readFileSync(process.env.HOME + '/Library/Caches/com.apple.findmy.fmipcore/Items.data', 'utf8');
        let parsed_data = JSON.parse(data);
        let filtered_data = parsed_data
            .filter(appleDevice => appleDevice.productType && appleDevice.productType.type === "b389" &&
            appleDevice.batteryStatus && appleDevice.address && appleDevice.address.formattedAddressLines &&
            appleDevice.location && appleDevice.location.latitude && 
            appleDevice.location.longitude && appleDevice.location.timeStamp && appleDevice.role && appleDevice.role.emoji && 
            appleDevice.serialNumber)
            .map(appleDevice => {
                return {
                    name: appleDevice.name,
                    battery: 100 - ( appleDevice.batteryStatus - 1) * 20,
                    address: appleDevice.address.formattedAddressLines.join(", "),
                    coords: [
                        appleDevice.location.latitude,
                        appleDevice.location.longitude
                    ],
                    date: new Date(appleDevice.location.timeStamp).toLocaleString(),
                    emote: appleDevice.role.emoji,
                    sn: appleDevice.serialNumber,
                    product: appleDevice.productType.type
                }
            });
        res.json(filtered_data);
    } catch (err) {
        console.error(err);
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})