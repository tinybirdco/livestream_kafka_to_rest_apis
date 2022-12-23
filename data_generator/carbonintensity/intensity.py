from datetime import datetime, timedelta
from helpers import carbonintensity_strptime, standard_time_format, send_to_kafka, deviate
import requests
import time


def get_data(request_date_fmt, attempt=1):
    url = f'https://api.carbonintensity.org.uk/intensity/date/{request_date_fmt}'
    days_data = requests.get(url).json()
    if 'data' in days_data:
        return days_data
    else:
        if attempt < 4:
            print(
                f'Attempt {attempt}: Request to Intensity API failed, retrying...')
            time.sleep(attempt)
            get_data(request_date_fmt, attempt=attempt+1)
        else:
            print(
                f'Intensity {request_date_fmt}: All retries failed, skipping day.')
            return None


def intensity_generate_day(request_date):
    request_date_fmt = datetime.strftime(request_date, '%Y-%m-%d')
    print('Intensity: ' + request_date_fmt)
    days_data = get_data(request_date_fmt)
    if days_data is None:
        return
    period_count = len(days_data)
    current_period = 0
    for period in days_data['data']:
        original_from = carbonintensity_strptime(period['from'])
        original_to = carbonintensity_strptime(period['to'])
        from_time = carbonintensity_strptime(period['from'])
        to_time = from_time+timedelta(seconds=30)
        forecast = period['intensity']['forecast']
        actual = period['intensity']['actual']
        # Sometimes the value for actual is None...
        if actual is None:
            actual = forecast
        index = period['intensity']['index']
        while from_time < original_to:
            next_actual = days_data[current_period +
                                    1]['intensity']['actual'] if current_period < period_count - 1 else None
            next_forecast = days_data[current_period +
                                      1]['intensity']['forecast'] if current_period < period_count - 1 else None
            row = {
                'time_from': standard_time_format(from_time),
                'time_to': standard_time_format(to_time),
                'intensity_forecast': deviate(forecast, next_forecast),
                'intensity_actual': deviate(actual, next_actual),
                'intensity_index': index
            }
            send_to_kafka('intensity', row)
            from_time = from_time+timedelta(seconds=30)
            to_time = from_time+timedelta(seconds=30)
