import requests
from faker import Faker
from dotenv import load_dotenv
import os

load_dotenv()

fake = Faker()
API_URL =  os.getenv("API_URL") + "/signup"  # Your signup endpoint
POKEAPI_URL = os.getenv("POKEAPI_URL") +"/pokemon?offset=20&limit=1500"  # Limit to 10 Pokémon

def get_pokemon_names():
    response = requests.get(POKEAPI_URL)
    response.raise_for_status()
    data = response.json()
    return [pokemon['name'] for pokemon in data['results']]

def signup_pokemon(name):
    email = f"{name}@poke.com"
    password = name + name
    payload = {
        "fullName": name.title().replace("-", " "),
        "username": name.lower(),
        "email": email,
        "password": password
    }

    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            print(f"✅ Signed up: {name} | Email: {email}")
        else:
            print(f"❌ Failed to sign up {name}: {response.text}")
    except Exception as e:
        print(f"🔥 Error signing up {name}: {e}")

def main():
    pokemon_names = get_pokemon_names()
    for name in pokemon_names:
        signup_pokemon(name)

if __name__ == "__main__":
    main()