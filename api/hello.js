from flask import Flask, request, jsonify

app = Flask(__name__)

# Your fixed API key (generate once and keep secret)
MY_API_KEY = "sandeep-api-5343"

@app.route("/my-endpoint", methods=["GET"])
def my_endpoint():
    # Get API key from request header
    api_key = request.headers.get("x-api-key")

    if api_key != MY_API_KEY:
        return jsonify({"error": "Unauthorized"}), 403

    # Example response if authorized
    return jsonify({"message": "Hello Sandeep! ✅", "status": "success"})


if __name__ == "__main__":
    app.run(debug=True)
