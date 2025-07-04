import os
from dotenv import load_dotenv
import json
import google.generativeai as genai

load_dotenv()



GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

question_format = [
{
    "questionText": "Question here",
    "answerType": "single",
    "options": [
        {"isCorrect": True,
        "text": "Option 1",
        },
        {"isCorrect": False,
        "text": "Option 2",
        }
    ],
},
{
    "questionText": "Question here",
    "answerType": "multiple",
    "options": [
        {"isCorrect": True,
        "text": "Option 1",
        },
        {"isCorrect": True,
        "text": "Option 2",
        }
    ],
},
]


prompt = [
    f"i want test data in json format so, i will give you the content of the File and you have to format it in Test jason object in provided format. for Ex. \n\n\n {question_format} \n\n\n make sure about if the answerType is multiple than make isCorrect True for correct answer and False for incorrect answer. and for single answerType make only one isCorrect True and all other False. also there should be all feilds in the json object, also no need for any other information, only questions and related feilds,also give me respose in json object \n\n\n",
]

def get_gemini_response(question):
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content([prompt[0], question])
    # print("This is the response from the model: ", response._result.candidates[0].content.parts[0].text)
    th = response.text
    th = th[7:-3]
    th = th.replace("'", '"')

    # Convert `True` and `False` to lowercase (JSON format)
    th = th.replace("True", "true").replace("False", "false")

    # Load JSON
    response_json = json.loads(th)
    return response_json


