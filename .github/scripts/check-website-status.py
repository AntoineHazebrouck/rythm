import requests
import sys

response = requests.get("https://www.antoinehazebrouck.com")

if not response.ok:
	sys.exit(response.status_code)
else:
	print(response.status_code)

	if not response.url.startswith("https://accounts.google.com/"):
		sys.exit(f"request was not redirected to 'https://accounts.google.com/' : {response.url}")
	else:
		print("ok")