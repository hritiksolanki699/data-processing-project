import pandas as pd

# Load the parquet file
file_path = './green_tripdata_2024-01.parquet'
df = pd.read_parquet(file_path)

# Save the dataframe to a CSV file
csv_file_path = 'green_tripdata_2024-01.csv'
df.to_csv(csv_file_path, index=False)

print(f"File converted successfully to {csv_file_path}")
