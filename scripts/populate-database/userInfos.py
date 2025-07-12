import os
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")
base_url =os.getenv("POKEAPI_URL")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
users_collection = db[MONGO_COLLECTION]

def get_last_english_property(entries, property):
    for entry in reversed(entries):
        if entry["language"]["name"] == "en":
            return entry[property]
    return None

# Fetch Pokémon data from the PokéAPI
def get_pokemon_data(pokemon_name):
    url = f"{base_url}/pokemon/{pokemon_name}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        types = [t["type"]["url"].rstrip("/").split("/")[-1] for t in data["types"]]

        # Get Pokémon ID
        poke_api_id = data["id"] 
        stats = data["stats"]

        # Fetch color from the species endpoint
        species_url =  data["species"]["url"] 
        species_response = requests.get(species_url)
        
        if species_response.status_code != 200:
            print(f"Failed to fetch species data for Pokémon {pokemon_name}")
            return None

        species_data = species_response.json()

        color = species_data.get("color", {}).get("name")
        if color == "black":
            color = "brown"
        flavor_text = get_last_english_property(species_data["flavor_text_entries"], "flavor_text")
        genus = get_last_english_property(species_data["genera"], "genus")
        shape = species_data.get("shape", {}).get("name")
        base_stats = [stat["base_stat"] for stat in stats]
        
        return {
            "types": types,
            "pokeApiId": poke_api_id,
            "color": color,
            "about": genus.upper() + ' \n\nShape: '+ shape.title() + ' \n\n' + flavor_text.replace("\n", " "), 
            "stats": base_stats,
            "evolutionChain": int(species_data["evolution_chain"]["url"].rstrip('/').split('/')[-1])

        }
    else:
        print(f"Failed to fetch data for Pokémon ID {pokemon_name}")
        return None

# Get all users and update each with Pokémon data
def update_users():
    users = list(users_collection.find({}))
    print(f"Found {len(users)} users.")

    for user in users:
        pokemon_data = get_pokemon_data(user["username"])
        if pokemon_data:
            result = users_collection.update_one(
                {"_id": user["_id"]},
                {"$set": {
                    "types": pokemon_data["types"],
                    "pokeApiId": pokemon_data["pokeApiId"],
                    "color": pokemon_data["color"],
                    "about": pokemon_data["about"],
                    "stats": pokemon_data["stats"],
                    "evolutionChain": pokemon_data["evolutionChain"],
                }}
            )
            print(f"Updated user {user.get('email', user['_id'])} with {pokemon_data}")

if __name__ == "__main__":
    update_users()