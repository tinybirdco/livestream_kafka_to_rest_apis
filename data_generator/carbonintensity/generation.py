from helpers import send_to_kafka, carbonintensity_strptime, standard_time_format
from datetime import datetime
import requests
import time


def get_data(request_date_fmt, attempt=1):
    url = f'https://api.carbonintensity.org.uk/generation/{request_date_fmt}/pt24h'
    days_data = requests.get(url).json()
    if 'data' in days_data:
        return days_data
    else:
        if attempt < 4:
            print(
                f'Attempt {attempt}: Request to Generation API failed, retrying...')
            time.sleep(attempt)
            get_data(request_date_fmt, attempt=attempt+1)
        else:
            print(
                f'Generation {request_date_fmt}: All retries failed, skipping day.')
            return None


def generation_generate_day(request_date):
    request_date_fmt = datetime.strftime(request_date, '%Y-%m-%d')
    print('Generation: ' + request_date_fmt)
    days_data = get_data(request_date_fmt)
    if days_data is None:
        return
    for period in days_data['data']:
        row = {}
        for fuel in period['generationmix']:
            row[fuel['fuel']] = fuel['perc']
        row['time_from'] = standard_time_format(
            carbonintensity_strptime(period['from']))
        row['time_to'] = standard_time_format(
            carbonintensity_strptime(period['to']))
        send_to_kafka('generation', row)
