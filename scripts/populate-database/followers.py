import requests
import time
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

POKEAPI_BASE = os.getenv("POKEAPI_URL")
BACKEND_BASE = os.getenv("API_URL")  # your backend login URL
LOGIN_ENDPOINT = "/login"

def get_json(url):
    try:
        resp = requests.get(url)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"❌ Error fetching {url}: {e}")
        return None

def get_infos_from_species_url(species_url):
    data = get_json(species_url)
    return {
        "generation": data["generation"]["name"],
        "is_legendary": data["is_legendary"],
        "is_mythical": data["is_mythical"],
        } if data else None

def get_pokemon_info(name):
    data = get_json(f"{POKEAPI_BASE}/pokemon/{name}")
    if not data: return None
    species_url = data["species"]["url"]
    return get_infos_from_species_url(species_url)

def login_pokemon(pokemon_name):
    email = f"{pokemon_name}@poke.com"
    password = f"{pokemon_name}{pokemon_name}"
    payload = {
        "email": email,
        "password": password
    }
    try:
        response = requests.post(BACKEND_BASE + LOGIN_ENDPOINT, json=payload)
        if response.status_code == 200:
            print(f"✅ Logged in as {pokemon_name}")
        else:
            print(f"❌ Login failed for {pokemon_name}: {response.text}")
    except Exception as e:
        print(f"❌ Exception during login for {pokemon_name}: {e}")

def roman_to_int(roman):
    roman_numerals = {
        "i": 1, "ii": 2, "iii": 3, "iv": 4, "v": 5,
        "vi": 6, "vii": 7, "viii": 8, "ix": 9, "x": 10
    }
    return roman_numerals.get(roman.lower(), -1)

def can_follow(follower, followed, follower_types, followed_types, type_to_friendly_types):
    def gen_number(g):
        suffix = g.split('-')[-1]
        return roman_to_int(suffix)

    follower_gen = gen_number(follower['generation'])
    followed_gen = gen_number(followed['generation'])

    follower_is_special = follower["is_legendary"] or follower["is_mythical"]
    followed_is_special = followed["is_legendary"] or followed["is_mythical"]
    friendly_types = set()
    for f_type in follower_types:
        friendly_types.update(type_to_friendly_types.get(f_type, set()))

    # Check if followed types are friendly according to follower's friendly types
    is_friendly = bool(followed_types & friendly_types)

    if not follower_is_special and not followed_is_special and is_friendly:
        return follower_gen >= followed_gen

    if follower_is_special and followed_is_special and is_friendly:
        return True

    if not follower_is_special and followed_is_special:
        return follower_gen >= followed_gen

    return False


def main():
    print("🔍 Fetching all Pokémon types...")
    types = get_json(f"{POKEAPI_BASE}/type?offset=0&limit=100")
    pokemon_infos = {}
    type_to_friendly_types = {}
    if not types:
        print("❌ Failed to fetch types.")
        return

    for type_entry in types["results"]:
        type_name = type_entry["name"]
        print(f"\n=== 🧪 Type: {type_name.upper()} ===")
        type_data = get_json(type_entry["url"])
        if not type_data:
            continue

        damage_rel = type_data["damage_relations"]
        friendly_types = set(
            t["name"] for t in (
                damage_rel["double_damage_to"]
                + damage_rel["half_damage_from"]
                + damage_rel["no_damage_from"]
            )
        )
        print(f"🤝 Friendly with: {', '.join(friendly_types)}")
        type_to_friendly_types[type_name] = friendly_types
        pokemon_list = type_data["pokemon"]
       
        for entry in pokemon_list:
            poke_name = entry["pokemon"]["name"]
            info = get_pokemon_info(poke_name)
            if info:
                 if poke_name not in pokemon_infos:
                    pokemon_infos[poke_name] = {
                        "info": info,
                        "types": set()
                    }

                 pokemon_infos[poke_name]["types"].add(type_name)

    print("\n🔗 Calculating valid follow relationships...")
    follows = []
    names = list(pokemon_infos.keys())

    for i in range(len(names)):
        for j in range(len(names)):
            if i == j:
                continue
            follower_name = names[i]
            followed_name = names[j]

            f_info = pokemon_infos[follower_name]["info"]
            f_types = pokemon_infos[follower_name]["types"]
            fd_info = pokemon_infos[followed_name]["info"]
            fd_types = pokemon_infos[followed_name]["types"]

            if can_follow(f_info, fd_info, f_types, fd_types, type_to_friendly_types):
                follows.append({
                    "user": followed_name,
                    "follower": follower_name
                })
    print(f"✅ {len(follows)} valid follows found.")
    for follow in follows:
        print(follow)

if __name__ == "__main__":
    main()