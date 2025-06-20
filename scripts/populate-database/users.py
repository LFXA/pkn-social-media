import requests
from faker import Faker
from dotenv import load_dotenv
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

load_dotenv()

fake = Faker()
API_URL = os.getenv("API_URL") + "/signup"
POKEAPI_URL = os.getenv("POKEAPI_URL") + "/pokemon?offset=0&limit=1600"

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
            print(f"❌ Failed to sign up {name}: {response.status_code} | {response.text}")
    except Exception as e:
        print(f"🔥 Error signing up {name}: {e}")

def main():
    pokemon_names = get_pokemon_names()

    # Limit the number of workers to avoid overwhelming the API
    max_workers = min(77, len(pokemon_names))

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(signup_pokemon, name) for name in pokemon_names]

        for future in as_completed(futures):
            # Just ensuring exceptions are raised here if any
            future.result()

if __name__ == "__main__":
    main()