from dotenv import load_dotenv
import os
import requests

load_dotenv()
token = os.environ.get('TINYBIRD_TOKEN')

data = "delete_condition=time_from >= '2022-12-01'"

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/x-www-form-urlencoded'
}

print(headers)

data_sources = ['generation', 'intensity']

for data_source in data_sources:
    response = requests.post(
        f'https://api.tinybird.co/v0/datasources/{data_source}/delete', headers=headers, data=data)
    print(response.status_code)
