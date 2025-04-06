import sys
import os
import requests
from functools import lru_cache
from collections import defaultdict
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2

PAT = '8202f77ad4c04964a18a3384bc66323c'
USER_ID = 'nicholasrader'
APP_ID = 'fridge-item-detection'
WORKFLOW_ID = "predict"

@lru_cache(maxsize=None)
def fetch_recipes_by_ingredient(ingredient):
    url = f"https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}"
    response = requests.get(url)
    data = response.json()
    return data.get("meals") or []

@lru_cache(maxsize=None)
def fetch_recipe_details(meal_id):
    url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}"
    response = requests.get(url)
    data = response.json()
    return data["meals"][0] if data["meals"] else None

if len(sys.argv) != 2:
    print("Usage: python predict-food-items.py <user_id>")
    sys.exit(1)
    
user_id = sys.argv[1]

supported_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic']
image_path = None

for ext in supported_extensions:
    candidate = f"uploaded_images/{user_id}{ext}"
    if os.path.exists(candidate):
        image_path = candidate
        break

if not image_path:
    print(f"No image file found for user ID '{user_id}' with supported extensions {supported_extensions}.")
    sys.exit(1)

with open(image_path, "rb") as image_file:
    image_bytes = image_file.read()

channel = ClarifaiChannel.get_grpc_channel()
stub = service_pb2_grpc.V2Stub(channel)
metadata = (('authorization', 'Key ' + PAT),)
userDataObject = resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID)

post_workflow_results_response = stub.PostWorkflowResults(
    service_pb2.PostWorkflowResultsRequest(
        user_app_id=userDataObject,
        workflow_id=WORKFLOW_ID,
        inputs=[
            resources_pb2.Input(
                data=resources_pb2.Data(
                    image=resources_pb2.Image(
                        base64=image_bytes
                    )
                )
            )
        ],
    ),
    metadata=metadata
)

if post_workflow_results_response.status.code != status_code_pb2.SUCCESS:
    print(post_workflow_results_response.status)
    raise Exception("Post workflow results failed, status: " + post_workflow_results_response.status.description)

results = post_workflow_results_response.results[0]

# for output in results.outputs:
#     model = output.model
#     print("Predicted concepts for the model `%s`" % model.id)
#     for concept in output.data.concepts:
#         print(" %s %.2f" % (concept.name, concept.value))

predicted_ingredients = [
    concept.name.lower()
    for output in results.outputs
    for concept in output.data.concepts
]

print(f"Detected fridge ingredients: {predicted_ingredients}")

recipe_match_count = defaultdict(lambda: {"count": 0, "details": None})

for ingredient in predicted_ingredients:
    meals = fetch_recipes_by_ingredient(ingredient)
    for meal in meals:
        meal_id = meal["idMeal"]
        recipe_match_count[meal_id]["count"] += 1
        if recipe_match_count[meal_id]["details"] is None:
            recipe_match_count[meal_id]["details"] = fetch_recipe_details(meal_id)

sorted_matches = sorted(
    recipe_match_count.items(),
    key=lambda item: item[1]["count"],
    reverse=True
)

print("\nRecipes you can make with your current ingredients:\n")
for meal_id, data in sorted_matches[:10]:
    recipe = data["details"]
    if recipe:
        matched_count = data["count"]
        ingredients = [
            recipe[f"strIngredient{i}"].lower()
            for i in range(1, 21)
            if recipe[f"strIngredient{i}"]
        ]
        match_percent = matched_count / len(ingredients) if ingredients else 0
        print(f"{recipe['strMeal']} ({match_percent:.0%} match)")
        print(f"Ingredients: {', '.join(ingredients)}")
        print(f"Instructions: {recipe['strInstructions'][:150]}...")
        print(f"Link: {recipe['strSource'] or 'https://www.themealdb.com/meal.php?c=' + meal_id}")
        print("\n")