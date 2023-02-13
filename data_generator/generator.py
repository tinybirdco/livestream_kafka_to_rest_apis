from datetime import datetime, timedelta
from carbonintensity.intensity import intensity_generate_day
from carbonintensity.generation import generation_generate_day
from helpers import get_producer
import time

request_date = datetime(year=2022, month=12, day=1)

producer = get_producer()

# Load factors once https://carbon-intensity.github.io/api-definitions/#get-intensity-factors

while request_date <= datetime.now():

    # Generate Intensity data https://carbon-intensity.github.io/api-definitions/#get-intensity-date-date
    intensity_generate_day(request_date)

    # Generate Generation data https://carbon-intensity.github.io/api-definitions/#get-generation-from-pt24h
    if request_date >= datetime(year=2018, month=6, day=1):
        # The Generation API only starts from 2018-06-01
        generation_generate_day(request_date)

    request_date = request_date + timedelta(days=1)
    # We want to avoid hitting the ESO APIs too often: be nice!
    time.sleep(2)
generation_generate_day(datetime.now()+timedelta(days=1))

producer.flush()
