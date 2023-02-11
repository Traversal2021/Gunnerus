import json

import psycopg2
from django.http import HttpResponse

from .mqtt import message_received, real_time_data
from .topicId import topicID
from datetime import datetime
from django.shortcuts import render

from .models.model1.run_math_model import ModelPredict, fmuinitialize
import utm

def index(request):
  
    return render(request,'home/sensors.html',{
        'SlewingAngle': message_received['Gunnerus/Crane1/slewing_angle'],
        'OuterBoomAngle':message_received['Gunnerus/Crane1/outer_boom_angle'],
        'ExtensionLength':message_received['Gunnerus/Crane1/extension_length_outer_boom'],
        'mainBoomAngle':message_received['Gunnerus/Crane1/main_boom_angle'],
        'C1Pressure': message_received['Gunnerus/Crane1/dp_main_cyl'],
        'engine1speed':message_received['Gunnerus/Engine1/engine_speed'],
        'engine1fuel':message_received['Gunnerus/Engine1/fuel_consumption'],
        'engine1load':message_received['Gunnerus/Engine1/engine_load'],
        'engine1lubepressure':message_received['Gunnerus/Engine1/lube_oil_pressure'],
        'engine1lubetem':message_received['Gunnerus/Engine1/lube_oil_temperature'],
        'engine1cooltem':message_received['Gunnerus/Engine1/coolant_temperature'],
        'engine1temp1':message_received['Gunnerus/Engine1/exhaust_temperature1'],
        'engine1temp2':message_received['Gunnerus/Engine1/exhaust_temperature2'],
        'engine1pressure':message_received['Gunnerus/Engine1/boost_pressure'],
        'engine2speed':message_received['Gunnerus/Engine2/engine_speed'],
        'engine2fuel':message_received['Gunnerus/Engine2/fuel_consumption'],
        'engine2load':message_received['Gunnerus/Engine2/engine_load'],
        'engine2lubepressure':message_received['Gunnerus/Engine2/lube_oil_pressure'],
        'engine2lubetem':message_received['Gunnerus/Engine2/lube_oil_temperature'],
        'engine2cooltem':message_received['Gunnerus/Engine2/coolant_temperature'],
        'engine2temp1':message_received['Gunnerus/Engine2/exhaust_temperature1'],
        'engine2temp2':message_received['Gunnerus/Engine2/exhaust_temperature2'],
        'engine2pressure':message_received['Gunnerus/Engine2/boost_pressure'],
        'engine3speed':message_received['Gunnerus/Engine3/engine_speed'],
        'engine3fuel':message_received['Gunnerus/Engine3/fuel_consumption'],
        'engine3load':message_received['Gunnerus/Engine3/engine_load'],
        'engine3lubepressure':message_received['Gunnerus/Engine3/lube_oil_pressure'],
        'engine3lubetem':message_received['Gunnerus/Engine3/lube_oil_temperature'],
        'engine3cooltem':message_received['Gunnerus/Engine3/coolant_temperature'],
        'engine3temp1':message_received['Gunnerus/Engine3/exhaust_temperature1'],
        'engine3temp2':message_received['Gunnerus/Engine3/exhaust_temperature2'],
        'engine3pressure':message_received['Gunnerus/Engine3/boost_pressure'],   
       
        'thrusterfeed':message_received['Gunnerus/dpThruster/FeedbackProsent'],
        'thrusterset':message_received['Gunnerus/dpThruster/ThrusterSetpunktProsent'],

        'wavetotal':message_received['Gunnerus/WaveRadar/Total_energy_mean_direction'],
        'wavepeak':message_received['Gunnerus/WaveRadar/Primary_wave_peak_direction'],
        'waveprimrypeak':message_received['Gunnerus/WaveRadar/Primary_wave_peak_period'],
        'waveprimarymean':message_received['Gunnerus/WaveRadar/Primary_wave_mean_direction'],
        'waveeast': message_received['Gunnerus/WaveRadar/STW_east_component'],
        'wavenorth':message_received['Gunnerus/WaveRadar/STW_north_component'],
        'waveheight':message_received['Gunnerus/WaveRadar/Significant_wave_height'],
        'waveperiod':message_received['Gunnerus/WaveRadar/Significant_wave_period'],
        'wavespeedeast':message_received['Gunnerus/WaveRadar/Current_speed_east_vector'],
        'wavespeednorth':message_received['Gunnerus/WaveRadar/Current_speed_north_vector'],
        'waveenergy':message_received['Gunnerus/WaveRadar/Total_energy_directional_spread'],
        'wavemeanperiod':message_received['Gunnerus/WaveRadar/Mean_period'],

        'longitude':message_received['Gunnerus/SeapathGPSGga/Longitude'],
        'latitude':message_received['Gunnerus/SeapathGPSGga/Latitude'],
        'speedkmhr':message_received['Gunnerus/SeapathGPSVtg/SpeedKmHr'],
        'speedknots':message_received['Gunnerus/SeapathGPSVtg/SpeedKnots'],
        'coursetrue':message_received['Gunnerus/SeapathGPSVtg/CourseTrue'],
        'longroundspeed':message_received['Gunnerus/SeapathGPSVbw/LonGroundSpeed'],
        'transgroundspeed':message_received['Gunnerus/SeapathGPSVbw/TransGroundSpeed'],

        'windspeed':message_received['Gunnerus/dpWind/Wind_Speed'],
        'winddirection':message_received['Gunnerus/dpWind/Wind_Direction'],
        })


# Create your views here.
def prediction(request):

    fmu, vrs = fmuinitialize()

    latitude = message_received["Gunnerus/SeapathGPSGga/Latitude"]
    longitude = message_received["Gunnerus/SeapathGPSGga/Longitude"]
    u0 = message_received["Gunnerus/SeapathGPSVtg/SpeedKmHr"]
    v0 = message_received["Gunnerus/SeapathGPSVbw/TransGroundSpeed"]
    r0 = message_received["Gunnerus/SeapathMRU_rates/YawRate"]
    rudder_cd_pt = message_received["Gunnerus/hcx_port_mp/AzimuthFeedback"]
    rpm_cd_pt = message_received["Gunnerus/hcx_port_mp/RPMFeedback"]
    rudder_cd_sb = message_received["Gunnerus/hcx_stbd_mp/AzimuthFeedback"]
    rpm_cd_sb = message_received["Gunnerus/hcx_stbd_mp/RPMFeedback"]
    global_wind_direction = message_received["Gunnerus/dpWind/Wind_Direction"]
    global_wind_speed = message_received["Gunnerus/dpWind/Wind_Speed"]

    x0, y0, psi0, zone = utm.from_latlon(latitude, longitude)

    u0 = u0 / 3.6
    v0 = v0 * 0.514

    prediction_model = ModelPredict(
        fmu,
        vrs,
        x0,
        y0,
        psi0,
        u0,
        v0,
        r0,
        rudder_cd_pt,
        rpm_cd_pt,
        rudder_cd_sb,
        rpm_cd_sb,
        global_wind_direction,
        global_wind_speed,
    )

    predicton_result = prediction_model.simulate()
    return HttpResponse(predicton_result, content_type="text/json")

def draw_data (request, topic):
    mqttTopic = topic
    mqttData = json.dumps([{'topic': mqttTopic, 'value': real_time_data[mqttTopic]}])
    return HttpResponse(mqttData,content_type='text/json')

def CraneRealTime(request):
    craneData = json.dumps(
        {
            "double_link1": message_received["Gunnerus/Crane1/main_boom_angle"],
            "double_link2": message_received["Gunnerus/Crane1/outer_boom_angle"],
            "yaw_support": message_received["Gunnerus/Crane1/slewing_angle"],
            "load_cell_hook": message_received[
                "Gunnerus/Crane1/extension_length_outer_boom"
            ],
            "tele": message_received["Gunnerus/Crane1/extension_length_outer_boom"],
            "lat": message_received["Gunnerus/SeapathGPSGga/Latitude"],
            "lon": message_received["Gunnerus/SeapathGPSGga/Longitude"],
            "head": message_received["Gunnerus/SeapathMRU/Heading"],
        }
    )
    return HttpResponse(craneData, content_type="text/json")


def ShipPositionRealTime(request):
    PositionData = json.dumps(
        {
            "lat": message_received["Gunnerus/SeapathGPSGga/Latitude"],
            "lon": message_received["Gunnerus/SeapathGPSGga/Longitude"],
            "head": message_received["Gunnerus/SeapathMRU/Heading"],
        }
    )
    return HttpResponse(PositionData, content_type="text/json")


def EngineRealTime(request):
    craneData = json.dumps(
        {
            "engine1_power": message_received["Gunnerus/Engine1/engine_load"],
            "engine1_speed": message_received["Gunnerus/Engine1/engine_speed"],
            "engine1_exhaust_temp": message_received[
                "Gunnerus/Engine1/exhaust_temperature1"
            ],
            "engine1_lub_oil_temp": message_received[
                "Gunnerus/Engine1/lube_oil_temperature"
            ],
            "engine2_power": message_received["Gunnerus/Engine2/engine_load"],
            "engine2_speed": message_received["Gunnerus/Engine2/engine_speed"],
            "engine2_exhaust_temp": message_received[
                "Gunnerus/Engine2/exhaust_temperature1"
            ],
            "engine2_lub_oil_temp": message_received[
                "Gunnerus/Engine2/lube_oil_temperature"
            ],
            "engine3_power": message_received["Gunnerus/Engine3/engine_load"],
            "engine3_speed": message_received["Gunnerus/Engine3/engine_speed"],
            "engine3_exhaust_temp": message_received[
                "Gunnerus/Engine3/exhaust_temperature1"
            ],
            "engine3_lub_oil_temp": message_received[
                "Gunnerus/Engine3/lube_oil_temperature"
            ],
        }
    )
    return HttpResponse(craneData, content_type="text/json")


def historicData(request, info):
    startTime = request.GET.get("ST")
    endTime = request.GET.get("ET")
    topic = request.GET.get("TO")
    message_recieved = searchDatabase(startTime, endTime, topic)
    historicalData = json.dumps(
        [{"topic": topic, "value": message_recieved}], default=str
    )
    return HttpResponse(historicalData, content_type="text/json")


def TimelineData(request, info):
    startTime = request.GET.get("ST")
    endTime = request.GET.get("ET")
    constrain = request.GET.get("CS")
    message_recieved = searchTimeline(startTime, endTime, constrain)
    timeline = json.dumps(message_recieved, default=str)
    return HttpResponse(timeline, content_type="text/json")


def searchDatabase(startTime, endTime, topic):
    table_name_tem = []
    HistoricalFiguredata = []
    topicid = topicID[topic]
    classification = "null"
    ps_connection = None
    if 1 <= topicid <= 5:
        classification = "crane"
    elif 6 <= topicid <= 32:
        classification = "engine"
    elif 40 <= topicid <= 47 or 60 <= topicid <= 79:
        classification = "shipmotion"
    elif 33 <= topicid <= 39 or 80 <= topicid <= 81:
        classification = "environment"
    elif topicid == 82:
        classification = "AIS"
    else:
        classification = "others"

    try:
        ps_connection = psycopg2.connect(
            host="10.53.97.152",
            dbname="postgres",
            user="myuser",
            password="iot",
            port=5432,
        )
        cursor = ps_connection.cursor()

        # get the table name

        cursor.execute(
            """SELECT table_name FROM managetables WHERE managetables.devices = '%s' """
            % (classification)
        )
        table_name_al = cursor.fetchall()
        cursor.execute(
            """SELECT table_name FROM managetables WHERE managetables.start_time < '%s' and managetables.devices = '%s' """
            % (startTime, classification)
        )
        table_name_st = cursor.fetchall()[-1]
        cursor.execute(
            """SELECT table_name FROM managetables WHERE  '%s' < end_time and devices = '%s'"""
            % (endTime, classification)
        )
        table_name_en = cursor.fetchall()

        print(table_name_en)

        if len(table_name_en) == 0:
            table_name_en.append(table_name_al[-1])

        startIndex = -1
        endIndex = -1
        for i in range(len(table_name_al)):
            if table_name_al[i][0] == table_name_st[0]:
                table_name_tem.append(table_name_al[i][0])
                startIndex = i
            if startIndex != -1 and endIndex == -1:
                table_name_tem.append(table_name_al[i][0])
            if table_name_al[i][0] == table_name_en[0][0]:
                endIndex = i
                break
        table_name = list(set(table_name_tem))
        table_name.sort(key=table_name_tem.index)

        for i in range(len(table_name)):
            select_query = (
                " SELECT topicid, value, datetime from %s" % table_name[0]
                + " WHERE datetime >'%s' " % startTime
                + " and datetime <'%s' " % endTime
                + " and topicid=%s " % topicid
            )
            cursor.execute(select_query)
            temp_data = cursor.fetchall()
            HistoricalFiguredata.append(temp_data)

        HistoricalFiguredata["values"][0][0].sort(
            key=lambda date: datetime.strptime(date[2], "%m-%Y")
        )

    except (Exception, psycopg2.Error) as error:
        print("Error while updating PostgreSQL table", error)

    finally:
        # closing database connection.
        if ps_connection:
            cursor.close()
            ps_connection.close()
            print("PostgreSQL connection is closed")
            return HistoricalFiguredata


def searchTimeline(startTime, endTime, constrain):
    table_name_tem = []
    timelinedata = {}
    output_results = {
        1: [],
        2: [],
        3: [],
    }
    ps_connection = None

    try:
        ps_connection = psycopg2.connect(
            host="10.53.97.152",
            dbname="postgres",
            user="myuser",
            password="iot",
            port=5432,
        )
        cursor = ps_connection.cursor()

        # get the table name

        cursor.execute(
            """SELECT table_name FROM managetables WHERE managetables.devices = 'engine' """
        )
        table_name_al = cursor.fetchall()
        cursor.execute(
            """SELECT table_name FROM managetables WHERE managetables.start_time < '%s' and managetables.devices = 'engine' """
            % (startTime)
        )
        table_name_st = cursor.fetchall()[-1]
        cursor.execute(
            """SELECT table_name FROM managetables WHERE  '%s' < end_time and devices = 'engine'"""
            % (endTime)
        )
        table_name_en = cursor.fetchall()

        if len(table_name_en) == 0:
            table_name_en.append(table_name_al[-1])

        startIndex = -1
        endIndex = -1
        for i in range(len(table_name_al)):
            if table_name_al[i][0] == table_name_st[0]:
                table_name_tem.append(table_name_al[i][0])
                startIndex = i
            if startIndex != -1 and endIndex == -1:
                table_name_tem.append(table_name_al[i][0])
            if table_name_al[i][0] == table_name_en[0][0]:
                endIndex = i
                break
        table_name = list(set(table_name_tem))
        table_name.sort(key=table_name_tem.index)

        currentEvent = -1
        eventNumber = 0
        temp_data = []

        select_query = (
            " SELECT datetime from %s" % table_name[0]
            + " WHERE datetime >'%s' " % startTime
            + " and datetime <'%s' " % endTime
            + "and %s" % constrain
        )
        cursor.execute(select_query)
        constrainedDate = cursor.fetchall()
        newstarTime = constrainedDate[0][0]
        select_query = (
            " SELECT datetime from %s" % table_name[-1]
            + " WHERE datetime >'%s' " % startTime
            + " and datetime <'%s' " % endTime
            + "and %s" % constrain
        )
        cursor.execute(select_query)
        constrainedDate = cursor.fetchall()
        newEndTime = constrainedDate[-1][0]

        for i in range(len(table_name)):
            select_query = (
                " SELECT eventcode, datetime from %s" % table_name[i]
                + " WHERE datetime >'%s' " % newstarTime
                + " and datetime <'%s' " % newEndTime
            )
            cursor.execute(select_query)
            temp_data = cursor.fetchall()
            for j in range(len(temp_data)):
                if currentEvent != temp_data[j][0]:
                    timelinedata[eventNumber] = {
                        "event": temp_data[j][0],
                        "time": temp_data[j][1],
                    }
                    currentEvent = temp_data[j][0]
                    eventNumber = eventNumber + 1

        base_time = []
        event_time = []
        for i in range(len(timelinedata)):
            base_time.append(timelinedata[i]["time"])
            event_time.append(timelinedata[i]["event"])

        base_time.append(datetime.strptime(endTime, "%Y-%m-%dT%H:%M"))

        for i in range(len(event_time)):
            output_results[event_time[i]].append(
                {
                    "from": base_time[i],
                    "to": base_time[i + 1],
                }
            )

    except (Exception, psycopg2.Error) as error:
        print("Error while updating PostgreSQL table", error)

    finally:
        # closing database connection.
        if ps_connection:
            cursor.close()
            ps_connection.close()
            print("PostgreSQL connection is closed")
            return output_results
