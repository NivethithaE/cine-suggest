from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load data
movies = pd.read_csv("tmdb_5000_movies.csv")
movies = movies[['id', 'title', 'overview', 'genres']].dropna()

def convert(obj):
    try:
        return " ".join([i['name'] for i in ast.literal_eval(obj)])
    except:
        return ""

movies['tags'] = movies['overview'] + " " + movies['genres'].apply(convert)
tfidf = TfidfVectorizer(stop_words='english')
vectors = tfidf.fit_transform(movies['tags'])
similarity = cosine_similarity(vectors)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    movie = data.get("movie", "").lower()
    try:
        index = movies[movies['title'].str.lower() == movie].index[0]
        distances = similarity[index]
        recs = sorted(enumerate(distances), reverse=True, key=lambda x: x[1])[1:6]
        titles = [movies.iloc[i[0]]['title'] for i in recs]
        return jsonify({ "recommendations": titles })
    except:
        return jsonify({ "error": "Movie not found" }), 404

if __name__ == "__main__":
    app.run(debug=True)
