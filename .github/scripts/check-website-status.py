import requests
import sys

response = requests.get('https://www.antoinehazebrouck.com')

if not response.ok:
	sys.exit(response.status_code)
else:
	print(response.status_code)
	print(response.text)

	titleTag = "<title>Home</title>"
	if titleTag not in response.text:
		sys.exit(f"{titleTag} not in response")
	else:
		print("ok")