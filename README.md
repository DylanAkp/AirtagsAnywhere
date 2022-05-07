## Interface

<details>
  <summary>💻 Click to view desktop interface</summary>
  
  ![Alt Text](/readme_files/desktop.png "Desktop view")
</details>
<details>
  <summary>📱 Click to view mobile interface</summary>
  
  ![Alt Text](/readme_files/phone.png "Phone view")
</details>

## ❓ Why

With this project, you can see the airtags location on a simple web-app from any device.
The idea of this project is to learn how Airtags location are stored and how to use them, it has been made for educational purposes.

## 🚀 Quick start

### You'll need

- A bit of time
- Any device running MacOS that needs to be always on (to get airtags location and host the server)

### Getting Started On MacOS

- Install NodeJS (https://nodejs.dev/download)
- Clone the repository in a convenient location
- Replace "`localhost`" with the local ip address of your Mac in `front_airtags/src/config.json`
- run `npm install` in both back and front folder
- run `npm start` in back then front folder
- open `localhost:3000` on your browser and check if it's working

### Getting Started On Your Non-Apple Device

- Type the IP of your Mac on your address bar, followed by :3000, login, and that's it !


If you want to access it from the external network, do a wireguard server (or open the port 3000, but I do not recommend it)


## ⌨️ Credits

- AirtagAlex (for the idea of using the Items.data file) : https://github.com/icepick3000/AirtagAlex
