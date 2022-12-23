# https://stephenallwright.com/python-round-time-15-minutes/

import math
import json
import random
import time
import os
from dotenv import load_dotenv
from datetime import timedelta, datetime
from confluent_kafka import Producer

load_dotenv()
key = os.environ.get('KAFKA_KEY')
secret = os.environ.get('KAFKA_SECRET')
bootstrap_servers = os.environ.get('KAFKA_BROKERS')

conf = {'bootstrap.servers': bootstrap_servers, 'client.id': 'demo1',
        "security.protocol": "SASL_SSL",
        "sasl.mechanisms": "PLAIN",
        "sasl.username": key,
        "sasl.password": secret,
        "linger.ms": 5}
producer = None


def get_producer():
    global producer
    if producer is None:
        producer = Producer(conf)
    return producer


def decision(probability):
    return random.random() < probability


def deviate(original, next):
    # 80% chance we return the same value
    if decision(0.8):
        return original
    # 20% we deviate the number
    if next:
        # If we know the next number, pick a number between current
        return random.randint(original-1, next+1)
    else:
        return random.randint(original-1, original+1)


def round_down_dt(dt, delta):
    return datetime.min + math.floor((dt - datetime.min) / delta) * delta


def round_up_dt(dt, delta):
    return datetime.min + math.ceil((dt - datetime.min) / delta) * delta


def round_nearest_dt(dt, delta):
    return datetime.min + round((dt - datetime.min) / delta) * delta


def get_30_min_time_window():
    now = datetime.now()
    delta = timedelta(minutes=30)
    return {
        'from': round_down_dt(now, delta),
        'to': round_up_dt(now, delta),
    }


def carbonintensity_strptime(str):
    return datetime.strptime(str, '%Y-%m-%dT%H:%MZ')


def standard_time_format(date):
    return datetime.strftime(date, '%Y-%m-%dT%H:%M:%SZ')


def send_to_kafka(topic, message):
    producer = get_producer()
    producer.poll(0)
    try:
        producer.produce(topic, value=json.dumps(message).encode('utf-8'))
    except BufferError:
        producer.flush()
        producer.produce(topic, value=json.dumps(message).encode('utf-8'))


def batch(iterable, n=1):
    l = len(iterable)
    for ndx in range(0, l, n):
        yield iterable[ndx:min(ndx + n, l)]


def send_batches_to_kafka(topic, message_batch):
    producer = get_producer()
    for batch_slice in batch(message_batch, 1000):
        producer.poll(0)
        for message in batch_slice:
            try:
                producer.produce(topic, value=json.dumps(message).encode('utf-8'))
            except BufferError:
                producer.flush()
                producer.produce(topic, value=json.dumps(message).encode('utf-8'))
        time.sleep(0.1)
