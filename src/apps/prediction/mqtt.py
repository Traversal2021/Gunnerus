import time

import paho.mqtt.client as mqtt

message_received = {}

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
    message_received[str(msg.topic)] = record_value


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
