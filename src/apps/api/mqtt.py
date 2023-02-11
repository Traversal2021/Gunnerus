import time

import paho.mqtt.client as mqtt
import json
from math import radians, cos, sin, asin, sqrt

message_received = {}

real_time_data ={
    
"Gunnerus/Crane1/dp_main_cyl":[],
"Gunnerus/Crane1/extension_length_outer_boom":[],
"Gunnerus/Crane1/main_boom_angle":[],
"Gunnerus/Crane1/slewing_angle":[],
"Gunnerus/Crane1/outer_boom_angle":[],

"Gunnerus/Engine1/engine_speed":[],
"Gunnerus/Engine1/fuel_consumption":[],
"Gunnerus/Engine1/lube_oil_pressure":[],
"Gunnerus/Engine1/lube_oil_temperature":[],
"Gunnerus/Engine1/coolant_temperature":[],
"Gunnerus/Engine1/exhaust_temperature1":[],
"Gunnerus/Engine1/exhaust_temperature2":[],
"Gunnerus/Engine1/engine_load":[],
"Gunnerus/Engine1/boost_pressure":[],

"Gunnerus/Engine2/engine_speed":[],
"Gunnerus/Engine2/fuel_consumption":[],
"Gunnerus/Engine2/engine_load":[],
"Gunnerus/Engine2/lube_oil_pressure":[],
"Gunnerus/Engine2/lube_oil_temperature":[],
"Gunnerus/Engine2/coolant_temperature":[],
"Gunnerus/Engine2/exhaust_temperature1":[],
"Gunnerus/Engine2/exhaust_temperature2":[],
"Gunnerus/Engine2/boost_pressure":[],

"Gunnerus/Engine3/engine_speed":[],
"Gunnerus/Engine3/fuel_consumption":[],
"Gunnerus/Engine3/engine_load":[],
"Gunnerus/Engine3/lube_oil_pressure":[],
"Gunnerus/Engine3/lube_oil_temperature":[],
"Gunnerus/Engine3/coolant_temperature":[],
"Gunnerus/Engine3/exhaust_temperature1":[],
"Gunnerus/Engine3/exhaust_temperature2":[],
"Gunnerus/Engine3/boost_pressure":[],

"Gunnerus/SeapathGPSGga/Longitude":[],
"Gunnerus/SeapathGPSGga/Latitude":[],
"Gunnerus/SeapathGPSVtg/SpeedKmHr":[],
"Gunnerus/SeapathGPSVtg/SpeedKnots":[],
"Gunnerus/SeapathGPSVtg/CourseTrue":[],
"Gunnerus/SeapathGPSVbw/LonGroundSpeed":[],
"Gunnerus/SeapathGPSVbw/TransGroundSpeed":[],

"Gunnerus/SeapathMRU_rates/VertVel":[],
"Gunnerus/SeapathMRU_rates/RollRate":[],
"Gunnerus/SeapathMRU_rates/YawRate":[],
"Gunnerus/SeapathMRU_rates/PitchRate":[],
"Gunnerus/SeapathMRU/Heave":[],
"Gunnerus/SeapathMRU/Pitch":[],
"Gunnerus/SeapathMRU/Roll":[],
"Gunnerus/SeapathMRU/Heading":[],

"Gunnerus/WaveRadar/Total_energy_mean_direction":[],
"Gunnerus/WaveRadar/Primary_wave_peak_direction":[],
"Gunnerus/WaveRadar/Primary_wave_peak_period":[],
"Gunnerus/WaveRadar/Primary_wave_mean_direction":[],
"Gunnerus/WaveRadar/STW_east_component":[],
"Gunnerus/WaveRadar/STW_north_component":[],
"Gunnerus/WaveRadar/Significant_wave_height":[],
"Gunnerus/WaveRadar/Significant_wave_period":[],
"Gunnerus/WaveRadar/Current_speed_east_vector":[],
"Gunnerus/WaveRadar/Current_speed_north_vector":[],
"Gunnerus/WaveRadar/Total_energy_directional_spread":[],
"Gunnerus/WaveRadar/Mean_period":[],

"Gunnerus/hcx_port_mp/Power_mode_RPM_Mode":[],
"Gunnerus/hcx_port_mp/LoadFeedback":[],
"Gunnerus/hcx_port_mp/AzimuthFeedback":[],
"Gunnerus/hcx_port_mp/Running":[],
"Gunnerus/hcx_port_mp/RPMOrder":[],
"Gunnerus/hcx_port_mp/Maneuver_Transit_mode":[],
"Gunnerus/hcx_port_mp/Level_order":[],
"Gunnerus/hcx_port_mp/AzimuthOrder":[],
"Gunnerus/hcx_port_mp/RPMFeedback":[],

"Gunnerus/hcx_stbd_mp/RPMOrder":[],
"Gunnerus/hcx_stbd_mp/Running":[],
"Gunnerus/hcx_stbd_mp/Power_mode_RPM_Mode":[],
"Gunnerus/hcx_stbd_mp/LoadFeedback":[],
"Gunnerus/hcx_stbd_mp/RPMFeedback":[],
"Gunnerus/hcx_stbd_mp/AzimuthFeedback":[],
"Gunnerus/hcx_stbd_mp/AzimuthOrder":[],
"Gunnerus/hcx_stbd_mp/Maneuver_Transit_mode":[],
"Gunnerus/hcx_stbd_mp/Level_order":[],

"Gunnerus/dpThruster/FeedbackProsent":[],
"Gunnerus/dpThruster/ThrusterSetpunktProsent":[],
"Gunnerus/dpWind/Wind_Speed":[],
"Gunnerus/dpWind/Wind_Direction":[],

"AIVDM":[],
"AIVDM/speed":[],
"AIVDM/latitude":[],
"AIVDM/longitude":[],
"AIVDM/course":[],
}
def distance(lat1, lat2, lon1, lon2):
	# The math module contains a function named
	# radians which converts from degrees to radians.
	lon1 = radians(lon1)
	lon2 = radians(lon2)
	lat1 = radians(lat1)
	lat2 = radians(lat2)
	
	# Haversine formula
	dlon = lon2 - lon1
	dlat = lat2 - lat1
	a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2

	c = 2 * asin(sqrt(a))
	
	# Radius of earth in kilometers. Use 3956 for miles
	r = 6371
	
	# calculate the result
	return(c * r)
	

# connect with mqtt broker
def on_connect(client, userdata, flags, rc):
    subtop = "Gunnerus/#"
    client.subscribe([(subtop, 0)])
    print("Connecting with result code " + str(rc))


def on_subscribe(
    client, userdata, mid, granted_qos
):  ##Called when the broker responds to a subscribe request.
    print("Subscribed:", str(mid), str(granted_qos))


def on_message(client, userdata, msg):
    global message_received, ship_lat, ship_lon

    record_information = str(msg.payload.decode("utf-8"))
    record_value = list(record_information.split(","))

    if record_value[0] == "None":
        record_value[0] = 0.0

    message_received[str(msg.topic)] = record_value[0]

    if (msg.topic == "Gunnerus/SeapathGPSGga/Longitude"):
        ship_lat = float(record_value[0])/100
    if (msg.topic == "Gunnerus/SeapathGPSGga/Latitude"):
        ship_lon = float(record_value[0])/100


    if (msg.topic != "AIVDM"):
        if len(real_time_data[str(msg.topic)]) < 60:
            real_time_data[str(msg.topic)].append(record_value)
        else:
            real_time_data[str(msg.topic)].pop(0)
            real_time_data[str(msg.topic)].append(record_value)
    else:
        record_value2=json.loads(msg.payload.decode("utf-8"))
        speed_topic = msg.topic + "/speed"
        lat_topic = msg.topic + "/latitude"
        lon_topic = msg.topic + "/longitude"
        coourse_topic = msg.topic + "/course"
        dtempdict = {
            speed_topic: "speed",
            lat_topic: "lat",
            lon_topic: "lon",
            coourse_topic: "course",
        }
        unitDict = {
            speed_topic: "km/h",
            lat_topic: "degree",
            lon_topic: "degree",
            coourse_topic: "degree",
        }
        if len(real_time_data[str(msg.topic)]) < 60:
                real_time_data[str(msg.topic)].append(record_value)
        else:
                real_time_data[str(msg.topic)].pop(0)
                real_time_data[str(msg.topic)].append(record_value)

        if (distance(float(ship_lat), float(record_value2["lat"]), float(ship_lon), float(record_value2["lon"])) <= 5):

            if len(real_time_data[str(msg.topic)]) < 60:
                real_time_data[str(msg.topic)].append(record_value)
            else:
                real_time_data[str(msg.topic)].pop(0)
                real_time_data[str(msg.topic)].append(record_value)

            for temtopic in [speed_topic, lat_topic, lon_topic, coourse_topic]:
                if len(real_time_data[temtopic]) < 60:
                    real_time_data[temtopic].append([record_value2["mmsi"], record_value2[dtempdict[temtopic]],unitDict[temtopic]])
                else:
                    real_time_data[temtopic].pop(0)
                    real_time_data[temtopic].append([record_value2["mmsi"], record_value2[dtempdict[temtopic]],unitDict[temtopic]])

        # print('message_received',message_received)




def on_unsubscirbe(
    client, userdata, mid
):  # Called when broker responds to an unsubscribe request.
    print("Unsubscribed:", str(mid))


def on_disconnect(
    client, userdata, rc
):  # called when the client disconnects from the broker
    if rc != 0:
        print("Unexpected Disconnection")


client_id = time.strftime("%Y%m%d%H%M%S", time.localtime(time.time()))
client = mqtt.Client(client_id)
client.on_subscribe = on_subscribe
client.on_unsubscribe = on_unsubscirbe
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set("gunnerus", "gunnerus")
print("connecting")
client.connect("ihb-mqtt.it.ntnu.no", 1883, 60)

subtop = "Gunnerus/#"
client.subscribe([(subtop, 0)])


client.loop_start()
