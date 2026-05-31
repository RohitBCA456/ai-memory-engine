import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
import joblib

df = pd.read_csv('memory_data.csv')

model_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1, 3), 
        stop_words=None, 
        lowercase=True
    )),
    ('clf', LinearSVC(C=1.0))
])

X_train, X_test, y_train, y_test = train_test_split(
    df['text'], 
    df['label'], 
    test_size=0.2, 
    random_state=42
)
model_pipeline.fit(X_train, y_train)

joblib.dump(model_pipeline, 'memory_classifier.joblib')

print("Model re-trained with identity-focus.")
print(f"Accuracy: {model_pipeline.score(X_test, y_test):.2%}")