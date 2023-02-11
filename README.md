<a name="readme-top"></a>
<!-- ABOUT THE PROJECT -->
## ✨ About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This is the digital twin of Gunnerus vessel. Currently, the website is mainly built for the digital representation of cranes, engines and ship motion.  According to functionality, the page are designed to show real-time and historical data as well as to demonstrate manual control with the control panel. 

## ✨ Page overview

[![real_time_screen_shot][product-screenshot]]
When this page is enabled, the sensor data will be collected from MQTT broker and visualize them with the help of the 3D model map on the left side. A more mathematical representation will be shown on the right side.

[![historical_screen_shot][product-screenshot]]
In this page, a recreation of movement for a selected peroid. On the left bottom, there is the controller for the playback. Implemented functon including pause, drag and speed control. The selection and data visualization is shown on the right half side. When the time was selected, a graph about selectable events will pop out. Once the event is selected, the data will be visualized both in a 3D visual way and mathematical way. The process will be shown simutonuously appear in both vein.

[![crane_control_screen_shot][product-screenshot]]
This page demonstrate the manual control of the movement of the crane. With the control panel, the crane's  can be changed.

[![enginee_real_time_screen_shot][product-screenshot]]
This is a mathematical representation of real-time data.

## ✨ Built With

* [![python_django][Next.js]][Next-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![React][React.js]][React-url]
* [![three][three.js]][React-url]
* [![dash][dash]][Vue-url]
* [![MQTT][mqtt]][Angular-url]
* [![psycopg2][psycopg2]][Svelte-url]
* [![JQuery][JQuery.com]][JQuery-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
