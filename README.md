<a name="readme-top"></a>
<!-- ABOUT THE PROJECT -->
## ✨ About The Project

![Gunnerus Screen Shot][front-page]

This is the digital twin of Gunnerus vessel. Currently, the website is mainly built for the digital representation of cranes, engines and ship motion.  According to functionality, the page are designed to show real-time and historical data as well as to demonstrate manual control with the control panel. 

## ✨ Page overview

[![Sensor detection screen shot][sensor-detection]]
This page shows the distribution of the sensors and the real time can be presented once the sensor was clicked.


[![crane control screen shot][crane-control]]
This page demonstrate the manual control of the movement of the crane. With the control panel, the crane's  can be changed.

[![crane real time screen shot][crane-real-time]]
When this page is enabled, the sensor data will be collected from MQTT broker and visualize them with the help of the 3D model map on the left side. A more mathematical representation will be shown on the right side.

[![historical screen shot][historical-data]]
In this page, a recreation of movement for a selected peroid. On the left bottom, there is the controller for the playback. Implemented functon including pause, drag and speed control. The selection and data visualization is shown on the right half side. When the time was selected, a graph about selectable events will pop out. Once the event is selected, the data will be visualized both in a 3D visual way and mathematical way. The process will be shown simutonuously appear in both vein.

[![ship motion real time screen shot][ship-motion-real-time]]
On the map,hip motion data which are collected from MQTT broker will be visualized in a 3D way. A more mathematical representation will be shown on the right side.

[![enginee_real_time_screen_shot][engine-real-time]]
This is a mathematical representation of real-time data.

<!-- GETTING STARTED -->
## ✨ Getting Started

### 👉 Set Up for `Unix`, `MacOS` 

> Install modules via `VENV`  

```bash
$ virtualenv env
$ source env/bin/activate
$ pip3 install -r requirements.txt
```

<br />

### 👉 Set Up for `Windows` 

> Install modules via `VENV` (windows) 

```
$ virtualenv env
$ .\env\Scripts\activate
$ pip3 install -r requirements.txt
```

<br />



### 👉 Start/resatrt the app

> Active virtual environment
For `Unix`, `MacOS` 

```bash
$ source env/bin/activate
```
<br />

For `Windows` 

```bash
$ .\env\Scripts\activate
```
<br />
```

> Run the app

```bash
$ cd the/manage.py/folder
$ python manage.py runserver 0.0.0.0:9000
```

At this point, the app will response to external connection at the port of 9000. 

<br />

## ✨ Code-base structure

The project is coded using a simple and intuitive structure presented below:

```bash
< PROJECT ROOT >
   |
   |-- core/                               # Implements app configuration
   |    |-- settings.py                    # Defines Global Settings
   |    |-- wsgi.py                        # Start the app in production
   |    |-- urls.py                        # Define URLs served by all apps/nodes
   |
   |-- apps/
   |    |
   |    |-- home/                          # An app that serves front page and sensor detection
   |    |    |-- views.py                  # Serve HTML files
   |    |    |-- urls.py                   # Define the urls  
   |    |
   |    |-- api/                           # An app that serves api connection
   |    |    |-- mqtt.py                   # Connecting with MQTT broker and processing the data
   |    |    |-- views.py                  # Serve ressponse to API request
   |    |    |-- urls.py                   # Define routes  
   |    |
   |    |-- crane/                         # An app dealing with crane data visualization
   |    |    |-- views.py                  # Serve HTML pages for real_time, control and historical (both crane and shipmotion)
   |    |    |-- urls.py                   # Define routes  
   |    |
   |    |-- engine/                        # An app that serves engine data
   |    |    |-- views.py                  # Serve HTML pages for engine real-time data
   |    |    |-- urls.py                   # Define routes  
   |    |
   |    |-- shipmotion/                    # A app that serves the movement of ship motion
   |    |    |-- views.py                  # Serve HTML pages for real-time shipmotion
   |    |    |-- urls.py                   # Define some super simple routes 
   |    |
   |    |-- authentication/                # Handles auth routes (login and register)
   |    |    |-- urls.py                   # Define authentication routes  
   |    |    |-- views.py                  # Handles login and registration  
   |    |    |-- forms.py                  # Define auth forms (login and register) 
   |    |
   |    |-- static/
   |    |    |-- <css, JS, images>         # CSS files, Javascripts files
   |    |
   |    |-- templates/                     # Templates used to render pages
   |         |-- includes/                 # HTML chunks and components
   |         |    |-- navigation.html      # Top menu component
   |         |    |-- sidebar.html         # Sidebar component
   |         |    |-- footer.html          # App Footer
   |         |    |-- scripts.html         # Scripts common to all pages
   |         |
   |         |-- layouts/                   # Master pages
   |         |    |-- base-fullscreen.html  # Used by Authentication pages
   |         |    |-- base.html             # Used by common pages
   |         |
   |         |-- accounts/                  # Authentication pages
   |         |    |-- login.html            # Login page
   |         |    |-- register.html         # Register page
   |         |
   |         |-- crane/                     # Crane pages
   |         |    |-- crane_base.html       # Basic framework
   |         |    |-- crane_control.html    # Crane control page
   |         |    |-- crane_history.html    # Historical data page
   |         |    |-- crane_real_time.html  # Real time data page
   |         |
   |         |-- engine/                    # Engine page
   |         |    |-- base.html             # Basic framework
   |         |    |-- real_time.html        # Real time data page
   |         |
   |         |-- ship_motion/               # Ship motion pages
   |         |    |-- ship_motion_base.html # Basic framework
   |         |    |-- real_time.html        # Real time data page
   |         |    |-- shipmotion2.html      # Real time data page 2
   |         |
   |         |-- home/                      # UI Kit Pages
   |              |-- front_page.html       # front page
   |              |-- sensors.html          # sensor detection
   |              |-- 404-page.html         # 404 page
   |              |-- *.html                # All other pages
   |
   |-- requirements.txt                     # Development modules - SQLite storage
   |
   |-- .env                                 # Inject Configuration via Environment
   |-- manage.py                            # Start the app - Django default start script
   |
   |-- ************************************************************************
```

<br />


<!-- Bug EXAMPLES -->
## Bug examples
1. The most common bug happends when the MQTT broker is not working.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[front-page]: images/front_page.PNG
[sensor-detection]: images/sensor_detection.PNG
[crane-control]: images/crane_control.PNG
[crane-real-time]: images/crane_real_time.PNG
[historical-data]: images/historical_data.PNG
[ship-motion-real-time]: images/ship_motion_real_time.PNG
[engine-real-time]: images/engine_real_time.PNG
