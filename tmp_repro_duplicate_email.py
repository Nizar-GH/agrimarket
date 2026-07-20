import json
import urllib.request
import urllib.error

url = 'http://localhost:8283/api/clients'
headers = {'Content-Type': 'application/json'}

# GET clients
try:
    req = urllib.request.Request(url, headers={'Accept': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        body = resp.read().decode('utf-8')
        print('GET STATUS', resp.status)
        print('GET BODY')
        print(body[:4000])
except urllib.error.HTTPError as e:
    print('GET STATUS', e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print('GET ERROR', e)

# POST duplicate email
payload = {
    'nom': 'Test2',
    'prenom': 'Test2',
    'genre': 'Homme',
    'email': 'jean.leroy@email.fr',
    'telephone': '+33 6 12 34 56 79',
    'adresseLivraison': '2 rue Test',
    'codePostal': '75002',
    'ville': 'Paris',
    'imageProfil': '',
    'estActif': True,
    'recaptchaToken': 'dev-recaptcha-token',
}
try:
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    with urllib.request.urlopen(req) as resp:
        body = resp.read().decode('utf-8')
        print('POST STATUS', resp.status)
        print('POST BODY')
        print(body[:4000])
except urllib.error.HTTPError as e:
    print('POST STATUS', e.code)
    print('POST BODY')
    print(e.read().decode('utf-8'))
except Exception as e:
    print('POST ERROR', e)
