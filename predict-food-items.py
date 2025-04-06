import sys
import os
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2

PAT = '8202f77ad4c04964a18a3384bc66323c'
USER_ID = 'nicholasrader'
APP_ID = 'fridge-item-detection'
WORKFLOW_ID = "predict"

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

model_options = resources_pb2.OutputConfig(
    max_concepts=50,
    min_value=0.0
)

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
        output_config=model_options
    ),
    metadata=metadata
)

if post_workflow_results_response.status.code != status_code_pb2.SUCCESS:
    print(post_workflow_results_response.status)
    raise Exception("Post workflow results failed, status: " + post_workflow_results_response.status.description)

results = post_workflow_results_response.results[0]

for output in results.outputs:
    model = output.model
    print("Predicted concepts for the model `%s`" % model.id)
    for concept in output.data.concepts:
        print(" %s %.2f" % (concept.name, concept.value))
