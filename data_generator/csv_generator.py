from pyarrow import csv
import pyarrow as pa
from helpers import send_batches_to_kafka

convert_options = csv.ConvertOptions()
convert_options.column_types = { 'time_to': pa.string(), 'time_from': pa.string() }

with csv.open_csv('./data_generator/data_files/intensity.csv', convert_options=convert_options) as intensity_stream, csv.open_csv('./data_generator/data_files/generation.csv', convert_options=convert_options) as generation_stream:
    intensity_done = False
    generation_done = False
    intensity_iterations = 0
    generation_iterations = 0
    while not intensity_done or not generation_done:
        try:
            intensity_next_batch = intensity_stream.read_next_batch()
            print('Intensity')
            intensity_iterations += 1
            send_batches_to_kafka('intensity', intensity_next_batch.to_pylist())
        except StopIteration:
            print(f'Intensity COMPLETE: {intensity_iterations}')
            intensity_done = True
        try:
            if intensity_iterations % 30 == 0:
                generation_next_batch = generation_stream.read_next_batch()
                print('Generation')
                generation_iterations += 1
                send_batches_to_kafka('generation', generation_next_batch.to_pylist())
            else:
                pass
        except StopIteration:
            print(f'Generation COMPLETE: {generation_iterations}')
            generation_done = True
