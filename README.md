# TropoCast-Weather-app
 
TropoCast is a client-side weather and urban media dashboard. The project integrates real-time meteorological data stream architectures with a reactive web interface, enriched dynamically via automated media generation engines from public APIs.

<table style="text-align: left;">
  <tr>
    <th style="padding: .5rem;">Features</th>
  </tr>
  <tr>
    <td style="padding: .5rem;">
     - **Real-time weather data:** Displays temperature, wind speed, pressure, and visibility using the OpenWeather API.
     - **Wikipedia integration:** Dynamically fetches the main image of the searched city using the MediaWiki API.
     - **Local moon phase calculation:** Computes and displays the current lunar phase using a client-side JavaScript algorithm.
     - **Local time conversion:** Calculates the exact local time of the searched city using its UTC offset.
    </td>
  </tr>
</table> 

<br>

## Configuration

This project uses an external configuration file to secure API keys and prevent them from being exposed on GitHub.

1. Clone the repository:

2. Create a configuration file:
   - Copy `config.example.js` and rename it to `config.js` in the same directory.

3. Add your OpenWeather API key inside `config.js`:
   ```javascript
   const CONFIG = {
       WEATHER_API_KEY: "YOUR_API_KEY_HERE"
   };
   ```
