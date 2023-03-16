import os
import socket
import ssl
from time import sleep
from random import uniform
import json
import tempfile
import random
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

import logging
logging.basicConfig(level=logging.DEBUG)

# Refactored original source - https://github.com/mariocannistra/python-paho-mqtt-for-aws-iot

startState = {"state": {"reported": {"color": "orange"}}}


class PubSub(object):

    def __init__(self, config, listener=False):
        self.config = config
        self.connect = False
        self.listener = listener
        self.shadowRootTopic = '$aws/things/' + \
            self.config['thingName'] + '/shadow'
        self.topic = self.shadowRootTopic + '/#'
        self.logger = logging.getLogger(repr(self))
        self.logger.info(self.topic)

    def __on_publish(self, client, userdata, mid):
        self.logger.debug('on publish gave: ' + str(mid))

    def __on_connect(self, client, userdata, flags, rc):
        self.connect = True
        self.mqttc.publish(self.shadowRootTopic + '/update',
                           json.dumps(startState), qos=1)

        if self.listener:
            self.mqttc.subscribe(self.topic)

        self.logger.debug("{0}".format(rc))

    def __on_message(self, client, userdata, msg):
        self.logger.info(
            "{0}, {1} - {2}".format(userdata, msg.topic, msg.payload))

    def __on_log(self, client, userdata, level, buf):
        self.logger.debug("{0}, {1}, {2}, {3}".format(
            client, userdata, level, buf))

    def saveCertInTempFile(self, cert):
        caFile = tempfile.NamedTemporaryFile(
            prefix=self.config['thingName'], mode="w+t", delete=False)
        caFile.write(cert)
        caFile.close()
        return caFile.name

    def bootstrap_mqtt(self):

        self.mqttc = AWSIoTMQTTClient(self.config['thingName'])
        self.mqttc.configureEndpoint(self.config['endpoint'], 443)
        
        # self.mqttc.on_connect = self.__on_connect
        # self.mqttc.on_message = self.__on_message
        # self.mqttc.on_publish = self.__on_publish
        # self.mqttc.on_log = self.__on_log


        caPath = self.saveCertInTempFile(self.config['awsRootPem'])
        certPath = self.saveCertInTempFile(self.config['certPem'])
        keyPath = self.saveCertInTempFile(self.config['privateKey'])

        self.mqttc.configureCredentials(caPath, keyPath, certPath)

        self.connect = self.mqttc.connect()
        
        if self.connect:
            self.logger.info('Connected!!')
            self.mqttc.publish(self.shadowRootTopic + '/update',
                           json.dumps(startState), 1)
            self.mqttc.subscribe(self.topic, 1, self.__on_message)


        return self

    def start(self):

        while True:
            sleep(2)
            if self.connect == True:
                self.mqttc.publish('metrics', json.dumps(
                    {"temp": 20+2*random.random(), "hum": random.randint(60, 100), "pressure": random.randint(940, 1060) }), 1)
            else:
                self.logger.debug("Attempting to connect.")