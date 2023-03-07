import argparse
import json
import mqttClient

def loadConfig(configFile):
      data = None
      with open(configFile) as config:
              data = json.load(config)
      return data

def run(config):
	mqttClient.PubSub(config= config, listener = True).bootstrap_mqtt().start()




if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="firmware",
        description="A demo firmware in python, that will connect to IoT, periodically publish some metrics and interact with it's device shadow"
		)
    parser.add_argument("-c", "--config", help = "path to the config json file for the device")
    args = parser.parse_args()
    if not args.config:
        parser.print_usage()
        exit(0)
    config = loadConfig(args.config)
    run(config)