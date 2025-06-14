import requests
import re
from dotenv import load_dotenv
import os

load_dotenv()

API_URL = os.getenv("API_URL") + "/channels/create"  # Adjust as needed
ADMIN_TOKEN =  os.getenv("ADMIN_TOKEN")

HEADERS = {
    "Authorization": f"Bearer {ADMIN_TOKEN}",
    "Content-Type": "application/json"
}

def sanitize_name(name: str) -> str:
    """Ensure name follows channel rules (max 20 chars, letters/numbers/underscores/periods)."""
    name = name.lower().strip().replace("-", "_")
    return re.sub(r"[^\w\.]", "", name)[:20]

def create_channel(name, order, description):
    payload = {
        "name": name,
        "authRequired": False,
        "order": order,
        "description": description
    }
    response = requests.post(API_URL, json=payload, headers=HEADERS)
    if response.status_code == 200:
        print(f"[✔] Created channel: {name}")
    else:
        print(f"[✖] Failed to create '{name}': {response.text}")

def get_pokedex_description(pokedex_url):
    try:
        res = requests.get(pokedex_url)
        res.raise_for_status()
        data = res.json()

        for entry in data.get('descriptions', []):
            if entry['language']['name'] == 'en':
                return entry['description']
        return "No English description found."
    except Exception as e:
        return f"Failed to fetch or parse Pokédex: {e}"
    
def handle_region(region):
    pokedexes = region.get("pokedexes", [])
    region_name = region.get("name")
    description = ""
    if len(pokedexes) == 1:
        print(f"Fetching description for region '{region_name}' from its only Pokédex...")
        description = get_pokedex_description(pokedexes[0]["url"])
        return description
    elif any(p['name'] == region_name for p in pokedexes):
        print(f"Fetching description for Pokédex named '{region_name}'...")
        matched = next(p for p in pokedexes if p['name'] == region_name)
        description = get_pokedex_description(matched["url"])
        return description
    else:
        target_name = f"original-{region_name}"
        matched = next((p for p in pokedexes if p['name'] == target_name), None)

        if matched:
            print(f"Fetching description for '{target_name}'...")
            description = get_pokedex_description(matched["url"])
            return description
        else:
            return description

def main():
    print("Fetching Pokédex region names from PokeAPI...")
    response = requests.get(os.getenv("POKEAPI_URL") + "/region/")
    response.raise_for_status()
    regions = response.json()["results"]

    for i, entry in enumerate(regions):        
        raw_name = entry["name"]
        name = sanitize_name(raw_name)
        response = requests.get(entry["url"])
        response.raise_for_status()
        region = response.json()
        description = handle_region(region)
        description = description if description!="" else f"Pokédex region: {raw_name.capitalize()}"
        create_channel(name.capitalize(), order=i + 1, description=description)

if __name__ == "__main__":
    main()