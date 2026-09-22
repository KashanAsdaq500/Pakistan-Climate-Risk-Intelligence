import pandas as pd
import numpy as np
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


# =========================
# 1. PATHS
# =========================

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "weather.csv"
MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(exist_ok=True)


# =========================
# 2. LOAD DATA
# =========================

print("Loading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")


# =========================
# 3. CLEAN DATA
# =========================

df["date"] = pd.to_datetime(df["date"])

df = df.dropna()

# Remove timezone information if present
if df["date"].dt.tz is not None:
    df["date"] = df["date"].dt.tz_localize(None)


# =========================
# 4. CREATE TIME FEATURES
# =========================

df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["day_of_year"] = df["date"].dt.dayofyear

# Useful seasonal features
df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)


# =========================
# 5. FEATURES AND TARGET
# =========================

features = [
    "temp_min",
    "rain",
    "solar_radiation",
    "month",
    "day_of_year",
    "month_sin",
    "month_cos",
    "city",
]

target = "temp_max"

X = df[features]
y = df[target]


# =========================
# 6. TRAIN / TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)


# =========================
# 7. PREPROCESSING
# =========================

categorical_features = ["city"]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "city",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# =========================
# 8. RANDOM FOREST MODEL
# =========================

model = RandomForestRegressor(
    n_estimators=150,
    max_depth=15,
    random_state=42,
    n_jobs=-1
)


# =========================
# 9. PIPELINE
# =========================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# =========================
# 10. TRAIN
# =========================

print("Training model...")

pipeline.fit(X_train, y_train)


# =========================
# 11. EVALUATION
# =========================

predictions = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n==============================")
print("MODEL RESULTS")
print("==============================")
print(f"MAE: {mae:.2f} °C")
print(f"R² Score: {r2:.4f}")
print("==============================")


# =========================
# 12. SAVE MODEL
# =========================

model_path = MODEL_DIR / "temperature_model.pkl"

joblib.dump(pipeline, model_path)

print(f"\nModel saved to:")
print(model_path)


# =========================
# 13. SAVE MODEL INFORMATION
# =========================

model_info = {
    "features": features,
    "target": target,
    "cities": sorted(df["city"].unique().tolist()),
    "training_start": str(df["date"].min().date()),
    "training_end": str(df["date"].max().date()),
    "mae": float(mae),
    "r2": float(r2),
}

joblib.dump(
    model_info,
    MODEL_DIR / "model_info.pkl"
)

print("\nTraining completed successfully!")