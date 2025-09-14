#!/usr/bin/env python3
"""
Convert SAT WIC CSV data to JSON format for the React app.
Usage: python convert_csv_to_json.py <input.csv> [output.json]
"""

import pandas as pd
import json
import sys
import os

def convert_csv_to_json(input_csv, output_json=None):
    """Convert CSV to JSON format suitable for the WIC quiz app."""

    if not os.path.exists(input_csv):
        print(f"Error: File {input_csv} not found.")
        return False

    try:
        # Read the CSV file
        df = pd.read_csv(input_csv)

        # Validate required columns
        required_columns = [
            'passage', 'blank_sentence', 'choice_A', 'choice_B',
            'choice_C', 'choice_D', 'correct_answer', 'strategy_tag', 'explanation'
        ]

        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            print(f"Error: Missing required columns: {missing_columns}")
            return False

        # Add ID column if not present
        if 'id' not in df.columns:
            df['id'] = range(1, len(df) + 1)

        # Convert to JSON
        json_data = df.to_dict('records')

        # Set default output filename if not provided
        if output_json is None:
            base_name = os.path.splitext(os.path.basename(input_csv))[0]
            output_json = f"public/{base_name}.json"

        # Write JSON file
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)

        print(f"Successfully converted {input_csv} to {output_json}")
        print(f"Total questions: {len(json_data)}")
        return True

    except Exception as e:
        print(f"Error converting file: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_csv_to_json.py <input.csv> [output.json]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    success = convert_csv_to_json(input_file, output_file)
    sys.exit(0 if success else 1)