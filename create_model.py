# Adapted from https://www.labellerr.com/blog/food-recognition-and-classification-using-deep-learning/
import subprocess
import sys

# Function to install a package if it's not already installed
def install_package(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# List of required packages
required_packages = [
    "numpy",
    "pandas",
    "tensorflow",
    "scikit-learn",
    "Pillow"
]

# Install missing packages
for package in required_packages:
    try:
        __import__(package)
    except ImportError:
        install_package(package)

import numpy as np
import pandas as pd
from pathlib import Path
import os
import tensorflow as tf
from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report
import json
from PIL import Image

# Define the image directory path dynamically
image_dir = Path(os.path.join(os.getcwd(), 'uploaded_images'))

# Retrieve file paths and labels
filepaths = list(image_dir.glob(r'**/*.jpg'))
labels = list(map(lambda x: os.path.split(os.path.split(x)[0])[1], filepaths))

# Create a DataFrame
filepaths = pd.Series(filepaths, name='Filepath').astype(str)
labels = pd.Series(labels, name='Label')
images = pd.concat([filepaths, labels], axis=1)

# Sample 100 images per category
category_samples = []
for category in images['Label'].unique():
    category_slice = images.query("Label == @category")
    if len(category_slice) >= 100:
        category_samples.append(category_slice.sample(100, random_state=1))
    else:
        category_samples.append(category_slice)

# Shuffle and reset index
image_df = pd.concat(category_samples, axis=0).sample(frac=1.0, random_state=1).reset_index(drop=True)

# Split dataset into training (70%) and testing (30%)
train_df, test_df = train_test_split(image_df, train_size=0.7, shuffle=True, random_state=42)

# Image data generators
train_generator = tf.keras.preprocessing.image.ImageDataGenerator(
    preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input,
    validation_split=0.2
)
test_generator = tf.keras.preprocessing.image.ImageDataGenerator(
    preprocessing_function=tf.keras.applications.mobilenet_v2.preprocess_input
)

# Create training, validation, and test image datasets
train_images = train_generator.flow_from_dataframe(
    dataframe=train_df,
    x_col='Filepath',
    y_col='Label',
    target_size=(224, 224),
    color_mode='rgb',
    class_mode='categorical',
    batch_size=32,
    shuffle=True,
    seed=42,
    subset='training'
)

val_images = train_generator.flow_from_dataframe(
    dataframe=train_df,
    x_col='Filepath',
    y_col='Label',
    target_size=(224, 224),
    color_mode='rgb',
    class_mode='categorical',
    batch_size=32,
    shuffle=True,
    seed=42,
    subset='validation'
)

test_images = test_generator.flow_from_dataframe(
    dataframe=test_df,
    x_col='Filepath',
    y_col='Label',
    target_size=(224, 224),
    color_mode='rgb',
    class_mode='categorical',
    batch_size=32,
    shuffle=False
)

# Load MobileNetV2 as the base model
pretrained_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet',
    pooling='avg'
)
pretrained_model.trainable = False

# Construct the classification model
inputs = pretrained_model.input
x = tf.keras.layers.Dense(128, activation='relu')(pretrained_model.output)
x = tf.keras.layers.Dense(128, activation='relu')(x)
num_classes = len(train_images.class_indices)
outputs = tf.keras.layers.Dense(101, activation='softmax')(x)
model = tf.keras.Model(inputs, outputs)

# Display model summary
# print(model.summary())

# Compile and train the model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    train_images,
    validation_data=val_images,
    epochs=50,
    callbacks=[
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True
        )
    ]
)

# Evaluate the model
# results = model.evaluate(test_images, verbose=0)
# test_accuracy = results[1] * 100
# print("Test Accuracy: {:.2f}%".format(test_accuracy))

def load_and_preprocess_image(image_path, target_size=(224, 224)):
    image = Image.open(image_path).convert('RGB')
    image = image.resize(target_size)
    image_array = np.array(image)
    image_array = tf.keras.applications.mobilenet_v2.preprocess_input(image_array)
    return np.expand_dims(image_array, axis=0)

def predict_client_image(client_id):
    # Construct the file path based on the client ID
    image_path = os.path.join(os.getcwd(), 'uploaded_images', f'{client_id}.jpg')
    
    # Check if the file exists
    if not os.path.exists(image_path):
        return json.dumps({"error": f"Image file for client ID {client_id} not found."})
    
    processed_image = load_and_preprocess_image(image_path)
    predictions = model.predict(processed_image)
    predicted_class_index = np.argmax(predictions, axis=1)[0]
    
    # Map index to label using the training generator's class indices
    class_indices = train_images.class_indices
    index_to_class = {v: k for k, v in class_indices.items()}
    predicted_label = index_to_class[predicted_class_index]
    
    result_data = {
        "predicted_food_item": predicted_label,
        "confidence": float(predictions[0][predicted_class_index])
    }
    
    return json.dumps(result_data)

# Example usage: Replace 'unique_client_id' with the actual client id
client_id = 'unique_client_id'
print(predict_client_image(client_id))