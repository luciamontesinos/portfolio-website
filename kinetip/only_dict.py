import nltk
from nltk.corpus import words

# Download the words corpus if not already downloaded
nltk.download('words')

# Load the English words corpus
english_words = set(words.words())

# File paths
input_file = "/Users/lumo/Documents/processing-wordle/words.csv"
output_file = "/Users/lumo/Documents/processing-wordle/filtered_words.csv"

# Read the input file
with open(input_file, 'r') as file:
    lines = file.readlines()

# Filter words that are in the English dictionary
filtered_words = [word.strip() for word in lines if word.strip() in english_words]

# Write the filtered words to the output file
with open(output_file, 'w') as file:
    file.write("\n".join(filtered_words))

print(f"Filtered words saved to {output_file}")